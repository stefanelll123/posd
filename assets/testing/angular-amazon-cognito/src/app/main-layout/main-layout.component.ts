import { Component, OnInit } from '@angular/core';
import { CognitoService } from '../cognito.service';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent implements OnInit {

  constructor(private cognitoService: CognitoService) {
  }

  ngOnInit(): void {
    this.cognitoService.getCurrentUser();
  }
}
