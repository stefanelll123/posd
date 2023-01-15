import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CognitoService, IUser } from '../cognito.service';
import { IUserConfirmation } from '../models/user.model';

@Component({
  selector: 'app-sign-in-confirmation',
  templateUrl: './sign-in-confirmation.component.html',
  styleUrls: ['./sign-in-confirmation.component.scss']
})
export class SignInConfirmationComponent {
  loading: boolean;
  user: IUserConfirmation;
  userPayload: any;

  constructor(private router: Router,
              private cognitoService: CognitoService,
              private activatedRoute: ActivatedRoute) {
    this.loading = false;
    this.user = {} as IUserConfirmation;
  }

  signInConfirmation(): void {
    this.cognitoService.signInConfirmation(this.user);
  }
}
