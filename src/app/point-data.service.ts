import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { shareReplay, map, switchAll } from 'rxjs/operators';
import { Observable, forkJoin, of, config } from 'rxjs';
import { MetadataService, OpendapService, TimeSeries } from 'map-wald';
import { FeatureCollection, Feature, GeoJsonProperties } from 'geojson';
import { Point } from 'leaflet';

const standardVariables = [
  'longitude',
  'latitude',
  'ID',
  'admin_country',
  'admin_province',
  'hydro_basin',
  'hydro_cat'
];

export interface PointConfig {
  label: string;
  filename: string;
  meta?: string[];
  variables: string[];
  time: string;
  timeFirst: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class PointDataService {
  private layers: Observable<PointConfig[]>;
  private layerCache: { [key: string]: Observable<FeatureCollection> } = {};

  constructor(private http: HttpClient, private metadata: MetadataService, private dap: OpendapService) {
    this.layers = http.get(`${environment.pointConfig}?${(new Date()).getTime()}`).pipe(shareReplay()) as Observable<PointConfig[]>;
  }

  getLayers(): Observable<PointConfig[]> {
    return this.layers;
  }

  getSites(layer: string,filter?:{[key:string]:any}): Observable<FeatureCollection> {
    const res$ = this._layerConfig(layer).pipe(
      map(lyr => {
        if (!this.layerCache[lyr.label]) {
          this.layerCache[lyr.label] = this._retrieveLayer(lyr);
        }
        return this.layerCache[lyr.label];
      }),
      switchAll()
    );

    if(!filter){
      return res$;
    }

    return res$.pipe(
      map(fc=>{
        return {
          type: 'FeatureCollection',
          features: fc.features.filter(f=>{
            return Object.keys(filter).every(k=>{
              return f.properties[k]===filter[k];
            });
          })
        };
      }));
  }

  getTimes(layer: string): Observable<Date[]> {
    return this._layerConfig(layer).pipe(
      map(cfg=>{
        const url = `${environment.tds}/dodsC/${cfg.filename}`;
        return this.metadata.getTimeDimensionForURL(url)
      }),
      switchAll()
    );
  }

  getValues(layer:string, filter:{[key:string]:any}, timestep: Date, variable?: string): Observable<FeatureCollection>{
    return forkJoin([
      this.getSites(layer),
      this._layerConfig(layer)
    ]).pipe(
      map(([f,c])=>{
        let features:FeatureCollection = f;
        let config:PointConfig = c;
        variable = variable || config.variables[0];
        return {
          features,
          variable,
          config,
          url: ''
        };
      }),
      map(query=>{
        query.url = `${environment.tds}/dodsC/${query.config.filename}`;
        return forkJoin([
          this.metadata.dasForUrl(query.url),
          this.metadata.getTimeDimensionForURL(query.url),
          of(query)
        ]);
      }),
      switchAll(),
      map(([das,timeDim,query])=>{
        const featureRange = this.dap.dapRangeQuery(0,query.features.features.length-1);
        const timeStepIdx = timeDim.indexOf(timestep);
        if(timeStepIdx<0){
          // Error
        }
        const timeQuery =  this.dap.dapRangeQuery(timeStepIdx)
        return forkJoin([
          this.dap.getData(`${query.url}.ascii?${query.variable}${featureRange}${timeQuery}`,das),
          of(query)
        ]);
      }),
      switchAll(),
      map(([data,query])=>{
        const vals = data[query.variable] as number[];
        const result:FeatureCollection = {
          type:'FeatureCollection',
          features:[]
        };
        result.features = query.features.features.map(f=>{
          const newF: Feature = {
            type: 'Feature',
            geometry:f.geometry,
            properties:Object.assign({},f.properties)
          };
          const idx = (data.ID as number[]).indexOf(newF.properties.ID);
          newF.properties.value = data[query.variable][idx];
          return newF;
        })
        return result;
      }));
  }

  getTimeSeries(layer:string,feature:Feature,variable?:string):Observable<TimeSeries>{
    let res$ = forkJoin([
      this.getSites(layer),
      this._layerConfig(layer)]).pipe(
      map(([f,c])=>{
        let features:FeatureCollection = f;
        let config:PointConfig = c;
        variable = variable || config.variables[0];
        return {
          variable: variable,
          config: config,
          idx: features.features.findIndex(f=>f.properties.ID===feature.properties.ID),
          url: ''
        };
      }),
      map(query=>{
        query.url = `${environment.tds}/dodsC/${query.config.filename}`;
        return forkJoin([this.metadata.dasForUrl(query.url), this.metadata.ddxForUrl(query.url), of(query)]);
      }),
      switchAll(),
      map(([das,ddx,query])=>{
        const range = this.dap.dapRangeQuery(query.idx);

        let dateRange = '';
        if(query.config.timeFirst){
          const timeSize = +ddx.variables[query.config.time].dimensions[0].size;
          dateRange = this.dap.dapRangeQuery(0,timeSize-1);
        }
        const url = `${query.url}.ascii?${query.variable}${dateRange}${range}`;
        return forkJoin([this.dap.getData(url,das),of(query)]);
      }),
      switchAll(),
      map(([data,query])=>{
        const vals = data[query.variable] as number[];
        return {
          dates:data[query.config.time] as Date[],
          values:vals
        };
      }),
      map(ts=>{
        return {
          dates:ts.dates.filter((_,i)=>!isNaN(ts.values[i])&&(ts.values[i]!==null)),
          values:ts.values.filter(v=>!isNaN(v)&&(v!==null))
        };
      }));
    return res$;
  }

  private _layerConfig(lbl:string): Observable<PointConfig>{
    return this.layers.pipe(
      map(cfg => {
        return cfg.find(lyr => lyr.label === lbl);
      }));
  }
  private _retrieveLayer(lyr: PointConfig): Observable<FeatureCollection> {
    const variables = ([] as string[]).concat(standardVariables, lyr.meta || []);
    const url = `${environment.tds}/dodsC/${lyr.filename}`;
    return forkJoin([this.metadata.dasForUrl(url),this.metadata.ddxForUrl(url)]).pipe(
      map(([das,ddx]) => {
        const size = +ddx.variables.ID.dimensions[0].size;
        const rangeQuery = this.dap.dapRangeQuery(0,size-1);
        return forkJoin(variables.map(v => {
          return this.dap.getData(`${url}.ascii?${v}`, das);
        }));
      }),
      switchAll(),
      map(data=>{
        let result:{[key:string]:number[]} = {};
        data.forEach((d,i)=>{
          result[variables[i]] = d[variables[i]] as number[];
        })
        return result;
      }),
      map(data => {
        const result: FeatureCollection = {
          type: 'FeatureCollection',
          features: []
        };

        result.features = data.longitude.map((_,i)=>{
          let f: Feature = {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [data.longitude[i],data.latitude[i]],
            },
            properties:{}
          };
          variables.slice(2).forEach(v=>{
            f.properties[v] = data[v][i];
          });
          return f;
        });
        return result;
      }));
  }

}
