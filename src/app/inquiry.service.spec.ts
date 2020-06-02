import { TestBed, inject } from '@angular/core/testing';

import { InquiryService } from './inquiry.service';

describe('InquiryService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InquiryService]
    });
  });

  it('should be created', inject([InquiryService], (service: InquiryService) => {
    expect(service).toBeTruthy();
  }));
});
