import { TestBed } from '@angular/core/testing';

import { ApiintegrateService } from './apiintegrate.service';

describe('ApiintegrateService', () => {
  let service: ApiintegrateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiintegrateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
