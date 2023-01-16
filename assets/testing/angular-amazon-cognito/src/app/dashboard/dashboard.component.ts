import { Component } from '@angular/core';
import { map, take } from 'rxjs';
import { ApiService } from './api.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {

  constructor(
    private apiService: ApiService
  ) {

  }

  download(file: string): void {
    this.apiService.download(file).pipe(
      take(1),
      map(response => {
        const newWindow = window.open();
        newWindow?.document.write(response)
      })
    ).subscribe();
  }
}
