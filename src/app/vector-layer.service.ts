import { Injectable } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { FeatureCollection, Feature } from 'geojson';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { shareReplay, map, switchAll } from 'rxjs/operators';
import { InterpolationService } from 'map-wald';

export interface VectorLayerConfig{
  label:string;
  coverage:string;
  files:number;
  key:string;
  next_level:string;
  split:{
    key:string;
    files:number;
  }[];
}

@Injectable({
  providedIn: 'root'
})
export class VectorLayerService {
  private config$:Observable<VectorLayerConfig[]>;
  private layerCache:{[key:string]:Observable<FeatureCollection>}={};

  constructor(private _http:HttpClient) {
    this.config$ = this._http.get(environment.vectorMetadata).pipe(
      shareReplay()
    ) as Observable<VectorLayerConfig[]>;
  }

  private getLayerConfig(name:string):Observable<VectorLayerConfig> {
    return this.config$.pipe(
      map(cfg=>cfg.find(l=>l.label===name))
    );
  }

  private getGeoJSON(coverage:string,count:number):Observable<FeatureCollection>{
    const url = 'assets/vectors/'+coverage;
    if(count===1){
      return this._http.get(url) as Observable<FeatureCollection>;
    }
    const filenames = Array(count).fill(0).map((_,i)=>url.replace('.json',`${i}.json`));
    return forkJoin(filenames.map(fn=>this._http.get(fn))).pipe(
      map((subsets:FeatureCollection[])=>{
        return {
          type:'FeatureCollection',
          features: ([] as Feature[]).concat(...subsets.map(subset=>subset.features))
        } as FeatureCollection;
      })
    );
  }

  getSubLayer(name:string,featureKey:string):Observable<FeatureCollection>{
    const cacheKey = `${name}:${featureKey}`;
    if(!this.layerCache[cacheKey]){
      const res$ = this.getLayerConfig(name).pipe(
        map(lyr=>{
          const lookup:any = {};
          lookup[lyr.key] = featureKey;
          const url = InterpolationService.interpolate(lyr.next_level,lookup);
          const splitCfg = lyr.split.find(s=>s.key===featureKey);
          const count = splitCfg?splitCfg.files:1;
          return this.getGeoJSON(url,count);
        }),
        switchAll(),
        shareReplay()
      );

      this.layerCache[cacheKey] = res$;
    }

    return this.layerCache[cacheKey];
  }

  getLayer(name:string):Observable<FeatureCollection>{
    if(!this.layerCache[name]){
      const res$ = this.getLayerConfig(name).pipe(
        map(lyr=>this.getGeoJSON(lyr.coverage,lyr.files)),
        switchAll(),
        shareReplay()
      );

      this.layerCache[name] = res$;
    }

    return this.layerCache[name];
  }
}
