import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthStackGuard } from './guards/auth-stack.guard';
import { AuthGuard } from './guards/auth.guard';
import { MainLayoutComponent } from './main-layout/main-layout.component';

import { SignInConfirmationComponent } from './sign-in-confirmation/sign-in-confirmation.component';
import { SignInComponent } from './sign-in/sign-in.component';

const routes: Routes = [
  {
    path: 'signIn',
    component: SignInComponent,
    canActivate: [AuthStackGuard],
  },
  {
    path: 'signInConfirmation',
    component: SignInConfirmationComponent,
    canActivate: [AuthStackGuard],
  },
  {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
      },
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
  ],
  exports: [
    RouterModule,
  ],
})
export class AppRoutingModule {
}
