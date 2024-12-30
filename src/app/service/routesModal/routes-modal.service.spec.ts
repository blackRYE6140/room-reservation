import { TestBed } from '@angular/core/testing';

import { RoutesModalService } from './routes-modal.service';

describe('RoutesModalService', () => {
  let service: RoutesModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RoutesModalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
