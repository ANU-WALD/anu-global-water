import { TestBed } from '@angular/core/testing';

import { PlotDataService } from './plot-data.service';

describe('PlotDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PlotDataService = TestBed.get(PlotDataService);
    expect(service).toBeTruthy();
  });
});
