import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { shareReplay, map, switchAll, tap } from 'rxjs/operators';
import { Observable, forkJoin, of, config } from 'rxjs';
import { MetadataService, OpendapService, TimeSeries } from 'map-wald';
import { FeatureCollection, Feature, GeoJsonProperties } from 'geojson';
import { Point } from 'leaflet';
import { FeatureDataService, FeatureDataConfig } from './feature-data.service';
import { ThrowStmt } from '@angular/compiler';

const standardVariables = [
  'longitude',
  'latitude',
  'ID',
  'admin_country',
  'admin_province',
  'hydro_basin',
  'hydro_cat'
];

@Injectable({
  providedIn: 'root'
})
export class PointDataService {
  private layers: Observable<FeatureDataConfig[]>;

  constructor(private featureData:FeatureDataService, http: HttpClient) {
    this.layers = http.get(`${environment.pointConfig}?${(new Date()).getTime()}`).pipe(
      tap((cfg:FeatureDataConfig[])=>{
        return cfg.forEach(lyr=>{
          lyr.meta = [].concat(standardVariables,lyr.meta||[])
        });
      }),
      shareReplay());
  }

  getLayers(): Observable<FeatureDataConfig[]> {
    return this.layers;
  }

  getSites(layer: string,filter?:{[key:string]:any}): Observable<FeatureCollection> {
    return this._layerConfig(layer).pipe(
      map(lyr=>this.featureData.getFeatures(lyr,filter)),
      switchAll());
  }

  getTimes(layer: string): Observable<Date[]> {
    return this._layerConfig(layer).pipe(
      map(lyr=>this.featureData.getTimes(lyr)),
      switchAll());
  }

  getValues(layer:string, filter:{[key:string]:any}, timestep: Date, variable?: string): Observable<FeatureCollection>{
    return this._layerConfig(layer).pipe(
      map(lyr=>this.featureData.getValues(lyr,filter,timestep,variable)),
      switchAll());
  }

  getTimeSeries(layer:string,feature:Feature,variable?:string):Observable<TimeSeries>{
    return this._layerConfig(layer).pipe(
      map(lyr=>this.featureData.getTimeSeries(lyr,feature,variable)),
      switchAll());
  }

  private _layerConfig(lbl:string): Observable<FeatureDataConfig>{
    return this.layers.pipe(
      map(cfg => {
        return cfg.find(lyr => lyr.label === lbl);
      }));
  }
}
