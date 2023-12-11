import { TestBed } from '@angular/core/testing';

import { ApiFirebaseService } from './api-firebase.service';

describe('ApiFirebaseService', () => {
  let service: ApiFirebaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiFirebaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
