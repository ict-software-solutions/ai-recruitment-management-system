import { TestBed } from '@angular/core/testing';

import { AirmsService } from './airms.service';

describe('AirmsService', () => {
  let service: AirmsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AirmsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
