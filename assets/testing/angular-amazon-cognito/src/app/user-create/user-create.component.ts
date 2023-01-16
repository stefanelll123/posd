import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { map, take } from 'rxjs';
import { ApiService } from '../dashboard/api.service';

@Component({
  selector: 'app-user-create',
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.scss']
})
export class UserCreateComponent {
  loading = false;
  user = {
    username: '',
    temporaryPassword: '',
    showPassword: false,
  };

  constructor(
              private apiService: ApiService,
              private router: Router) {
  }

  createUser(): void {
    this.apiService.createUser(this.user).pipe(
      take(1),
      map((response) => {
        this.router.navigate(['/dashboard']);
      })
    ).subscribe();
  }
}
