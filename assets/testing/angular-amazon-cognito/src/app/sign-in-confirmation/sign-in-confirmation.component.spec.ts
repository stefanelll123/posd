import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignInConfirmationComponent } from './sign-in-confirmation.component';

describe('SignInConfirmationComponent', () => {
  let component: SignInConfirmationComponent;
  let fixture: ComponentFixture<SignInConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SignInConfirmationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SignInConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
