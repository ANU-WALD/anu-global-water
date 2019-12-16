import { TestBed } from '@angular/core/testing';

import { VectorLayerService } from './vector-layer.service';

describe('VectorLayerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: VectorLayerService = TestBed.get(VectorLayerService);
    expect(service).toBeTruthy();
  });
});
