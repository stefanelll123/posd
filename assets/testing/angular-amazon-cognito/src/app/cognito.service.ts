import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Amplify, Auth } from 'aws-amplify';

import { environment } from '../environments/environment';

export interface IUser {
  email: string;
  password: string;
  showPassword: boolean;
  code: string;
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class CognitoService {

  private authenticationSubject: BehaviorSubject<any>;

  constructor() {
    Amplify.configure({
      Auth: environment.cognito,
    });

    this.authenticationSubject = new BehaviorSubject<boolean>(false);
  }

  public signUp(user: IUser): Promise<any> {
    return Auth.signUp({
      username: user.email,
      password: user.password,
    });
  }

  public firstLogin(user: IUser): Promise<any> {
    return Auth.signIn(user.email, user.password)
      .then(response => {
          console.log('Response login:')
          console.log(response);

          Auth.completeNewPassword(response, 'Parolaaa1!', response.challengeParam.requiredAttributes)
          .then(res => {
            console.log('Response complete:')
            console.log(res);
          })
        }
      );
  }

  public confirmSignUp(user: IUser): Promise<any> {
    return Auth.confirmSignUp(user.email, user.code);
  }

  public signIn(user: IUser): Promise<any> {
    return Auth.signIn(user.email, user.password)
    .then(() => {
      this.authenticationSubject.next(true);
    });
  }

  public signOut(): Promise<any> {
    return Auth.signOut()
    .then(() => {
      this.authenticationSubject.next(false);
    });
  }

  public isAuthenticated(): Promise<boolean> {
    if (this.authenticationSubject.value) {
      return Promise.resolve(true);
    } else {
      return this.getUser()
      .then((user: any) => {
        if (user) {
          return true;
        } else {
          return false;
        }
      }).catch(() => {
        return false;
      });
    }
  }

  public getUser(): Promise<any> {
    return Auth.currentUserInfo();
  }

  public updateUser(user: IUser): Promise<any> {
    return Auth.currentUserPoolUser()
    .then((cognitoUser: any) => {
      return Auth.updateUserAttributes(cognitoUser, user);
    });
  }

  public test(username: string, password: string): Promise<any> {
    return Auth.signIn(username, password)
    .then((user) => {
      if (user.challengeName === 'NEW_PASSWORD_REQUIRED') {
        const { requiredAttributes } = user.challengeParam; // the array of required attributes, e.g ['family_name', 'address']
        Auth.completeNewPassword(
          user, // the Cognito User Object
          'Parolaaaa1!', // the new password
          // OPTIONAL, the required attributes
          {
            family_name: 'Stefan',
            address: 'First street, Bucharest'
          }
        )
          .then((user) => {
            // at this time the user is logged in if no MFA required
            console.log(user);
          })
          .catch((e) => {
            console.log(e);
          });
      } else {
        // other situations
      }
    })
    .catch((e) => {
      console.log(e);
    });
  }
}
