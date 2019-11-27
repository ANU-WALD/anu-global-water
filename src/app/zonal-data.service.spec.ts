import { TestBed } from '@angular/core/testing';

import { ZonalDataService } from './zonal-data.service';

describe('ZonalDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ZonalDataService = TestBed.get(ZonalDataService);
    expect(service).toBeTruthy();
  });
});
