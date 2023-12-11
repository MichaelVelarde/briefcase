import { TestBed } from '@angular/core/testing';

import { FirebaseImageService } from './firebase-image.service';

describe('FirebaseImageService', () => {
  let service: FirebaseImageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FirebaseImageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
