import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { SignInConfirmationComponent } from './sign-in-confirmation/sign-in-confirmation.component';
import { UserCreateComponent } from './user-create/user-create.component';
import { TokenInterceptor } from 'src/token.interceptor';
import { UserRoleComponent } from './user-role/user-role.component';

@NgModule({
  declarations: [
    AppComponent,
    SignInComponent,
    DashboardComponent,
    MainLayoutComponent,
    SignInConfirmationComponent,
    UserCreateComponent,
    UserRoleComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true},
  ],
  bootstrap: [
    AppComponent,
  ],
})
export class AppModule {
}
