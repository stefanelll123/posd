import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { IUser, CognitoService } from '../cognito.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent {

  loading = false;
  user = {} as IUser;

  constructor(private router: Router,
              private cognitoService: CognitoService) {
  }

  signIn(): void {
    this.cognitoService.signIn(this.user);
  }
}
