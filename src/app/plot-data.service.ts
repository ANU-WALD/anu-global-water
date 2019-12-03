import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})


export class PlotDataService {

  private cmdObs = new Subject<any>();

  cmdObservable$ = this.cmdObs.asObservable();

  public sendCmd(data: any) {
    if (data) {
      this.cmdObs.next(data);
    }
  }

  constructor() {
  }
}

