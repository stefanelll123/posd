import { Component } from '@angular/core';
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
    this.apiService.download(file).subscribe();
  }
}
