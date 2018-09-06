import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(private authService: AuthService) {

  }

  ngOnInit(): void {
    // this is done to take care of reload authentication since this
    // component is the one which loads first
    this.authService.autoAuthUser();
  }
}
