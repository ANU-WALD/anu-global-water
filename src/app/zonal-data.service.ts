import { Injectable } from '@angular/core';
import { FeatureDataService, FeatureDataConfig } from './feature-data.service';
import { TimeSeries, InterpolationService } from 'map-wald';
import { Observable } from 'rxjs';
import { Feature } from 'geojson';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { shareReplay, map, switchAll } from 'rxjs/operators';

const LAYER_DELIMITER='$$$';

export interface ZonalConfig {
  url:string,
  vectors:{
    label:string,
    id:string,
    time:string,
    urlParams:{[key:string]:any}
  }[];
  grids:{
    label:string,
    urlParams:{[key:string]:any}
    timeseries:string[]
  }[];
}


@Injectable({
  providedIn: 'root'
})
export class ZonalDataService {
  private layers: Observable<ZonalConfig>;

  constructor(http: HttpClient, private featureData:FeatureDataService) {
    this.layers = http.get(`${environment.vectorConfig}?${(new Date()).getTime()}`).pipe(
      map(data=>{
        console.log(data);
        return data;
      }),
      shareReplay()) as Observable<ZonalConfig>;
  }

  getVectorLayers():Observable<any>{
    return this.layers.pipe(
      map(cfg=>cfg.vectors)
    );
  }

  getDataLayers():Observable<any>{
    return this.layers.pipe(
      map(cfg=>cfg.grids)
    );
  }

  getTimeSeries(vectorLayer:string,dataLayer:string,feature:Feature,params?:any,variable?:string):Observable<TimeSeries>{
    return this._layerConfig(vectorLayer,dataLayer,params).pipe(
      map(lyr=>this.featureData.getTimeSeries(lyr,feature,variable)),
      switchAll());
  }

  private _layerConfig(vectorLayer:string,dataLayer:string,params?:any):Observable<FeatureDataConfig>{
    return this.layers.pipe(
      map(cfg=>{

        const vectorCfg = cfg.vectors.find(v=>v.label===vectorLayer);
        const gridCfg = cfg.grids.find(g=>g.label===dataLayer);

        const result = {
          label: `${vectorLayer}${LAYER_DELIMITER}${dataLayer}`,
          filename: InterpolationService.interpolate(cfg.url,Object.assign({},vectorCfg.urlParams||{},gridCfg.urlParams||{},params||{})),
          meta:[
            vectorCfg.id
          ],
          variables: gridCfg.timeseries,
          time:vectorCfg.time,
          id:vectorCfg.id,
          timeFirst:true,
          skipGeometry:true
        };

        return result;
      })
    );
  }

}
