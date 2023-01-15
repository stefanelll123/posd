import { TestBed } from '@angular/core/testing';

import { AuthStackGuard } from './auth-stack.guard';

describe('AuthStackGuard', () => {
  let guard: AuthStackGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AuthStackGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
