import { TestBed } from '@angular/core/testing';

import { GoogleTtsService } from './google-tts.service';

describe('GoogleTtsService', () => {
  let service: GoogleTtsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GoogleTtsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
