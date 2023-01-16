import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CognitoService } from '../cognito.service';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent implements OnInit {

  menu: any;

  constructor(
    public router: Router,
    public cognitoService: CognitoService) {
  }

  ngOnInit(): void {
    this.initMenu();
    this.cognitoService.getCurrentUser();
  }

  initMenu(): void {
    this.menu = [
      {
        name: 'Dashboard',
        url: '/dashboard'
      },
      {
        name: 'Create user',
        url: '/user-create'
      },
      {
        name: 'Add role',
        url: '/add-role'
      },
      {
        name: 'Remove role',
        url: '/remove-role'
      },
    ]
  }

  logout(): void {
    localStorage.removeItem('access_token');
    this.router.navigate(['/signIn']);
  }
}
