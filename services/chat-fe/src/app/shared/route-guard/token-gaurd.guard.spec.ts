import { TestBed } from '@angular/core/testing';

import { TokenGaurdGuard } from './token-gaurd.guard';

describe('TokenGaurdGuard', () => {
  let guard: TokenGaurdGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(TokenGaurdGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
