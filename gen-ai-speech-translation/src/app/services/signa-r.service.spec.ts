import { TestBed } from '@angular/core/testing';

import { SignalRService } from './signa-r.service';

describe('SignaRService', () => {
  let service: SignalRService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SignalRService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
