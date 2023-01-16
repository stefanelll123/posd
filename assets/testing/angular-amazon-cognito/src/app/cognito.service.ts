import { Injectable } from '@angular/core';
import { Amplify, Auth } from 'aws-amplify';

import { environment } from '../environments/environment';
import { IUserConfirmation } from './models/user.model';
import { Router } from '@angular/router';

export interface IUser {
  username: string;
  password: string;
  showPassword: boolean;
  code: string;
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class CognitoService {

  userConfirmationPassword: any;

  constructor(
    private router: Router,
  ) {
    Amplify.configure({
      Auth: environment.cognito,
    });
  }

  async getCurrentUser() {
    try {
      const user = await Auth.currentUserInfo();   
      console.log(user)   
    } catch (error) {
      console.log(error);
    }
  }

  async signIn(payload: IUser) {
    try {
      const user = await Auth.signIn(payload.username, payload.password);

      if (user?.challengeName === 'NEW_PASSWORD_REQUIRED') {
        this.userConfirmationPassword = user;
        this.router.navigate(['/signInConfirmation']);
        return;
      }

      localStorage.setItem('access_token', user.signInUserSession.accessToken.jwtToken)
      this.router.navigate(['/dashboard'])
    } catch (error) {
      console.log(error);
    }
  }

  async signInConfirmation(payload: IUserConfirmation) {
    try {
      const user = await Auth.completeNewPassword(this.userConfirmationPassword, payload.password,
        {
          family_name: payload.name,
          address: payload.address
        }
      );

      localStorage.setItem('access_token', user.signInUserSession.accessToken.jwtToken)
      this.router.navigate(['/dashboard'])
    } catch (error) {
      console.log(error);
    }
  }
}
