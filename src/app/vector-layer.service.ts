import { Injectable } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { FeatureCollection, Feature } from 'geojson';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { shareReplay, map, switchAll } from 'rxjs/operators';

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

  getLayer(name:string):Observable<FeatureCollection>{
    if(!this.layerCache[name]){
      const res$ = this.config$.pipe(
        map(cfg=>cfg.find(l=>l.label===name)),
        map(lyr=>{
          const url = 'assets/vectors/'+lyr.coverage;
          if(lyr.files===1){
            return this._http.get(url) as Observable<FeatureCollection>;
          }
          const filenames = Array(lyr.files).fill(0).map((_,i)=>url.replace('.json',`${i}.json`));
          return forkJoin(filenames.map(fn=>this._http.get(fn))).pipe(
            map((subsets:FeatureCollection[])=>{
              return {
                type:'FeatureCollection',
                features: ([] as Feature[]).concat(...subsets.map(subset=>subset.features))
              } as FeatureCollection;
            })
          );
        }),
        switchAll(),
        shareReplay()
      );

      this.layerCache[name] = res$;
    }

    return this.layerCache[name];
  }
}
