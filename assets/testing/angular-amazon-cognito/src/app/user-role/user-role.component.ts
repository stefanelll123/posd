import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map, take } from 'rxjs';
import { ApiService } from '../dashboard/api.service';

@Component({
  selector: 'app-user-role',
  templateUrl: './user-role.component.html',
  styleUrls: ['./user-role.component.scss']
})
export class UserRoleComponent implements OnInit {
  loading = false;
  user = {
    username: '',
    groupName: '',
  };
  path: string | undefined;

  constructor(
    private activatedRoute: ActivatedRoute,
    private apiService: ApiService,
    private router: Router) {
  }

  ngOnInit(): void {
    this.path = this.activatedRoute.snapshot.routeConfig?.path as string;
  }

  addRole(): void {
    this.apiService.addRole(this.user).pipe(
      take(1),
      map((response) => {
        this.router.navigate(['/dashboard']);
      })
    ).subscribe();
  }

  removeRole(): void {
    this.apiService.removeRole(this.user).pipe(
      take(1),
      map((response) => {
        this.router.navigate(['/dashboard']);
      })
    ).subscribe();
  }
}
