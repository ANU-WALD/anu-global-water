import { Injectable } from '@angular/core';
import { FeatureDataService } from './feature-data.service';
import { TimeSeries } from 'map-wald';
import { Observable } from 'rxjs';
import { Feature } from 'geojson';

const LAYER_DELIMITER='$$$';

@Injectable({
  providedIn: 'root'
})
export class ZonalDataService {

  constructor(private featureData:FeatureDataService) { }


  // getTimeSeries(vectorLayer:string,dataLayer:string,feature:Feature,variable?:string):Observable<TimeSeries>{
  //}

}
