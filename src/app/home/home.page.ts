import { Component } from '@angular/core';
import {AuthenticationService} from '../services/authentication.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  today = Date.now();
  constructor(
    private authService: AuthenticationService,
    private router: Router,
  ) {}
  async onSignout(){
    await this.authService.signout();
    await this.router.navigateByUrl('/signin');
  }
}
