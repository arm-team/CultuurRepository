import { Component, OnInit } from '@angular/core';
import {NgForm} from '@angular/forms';
import {AuthenticationService} from '../services/authentication.service';
import {ComponentService} from '../services/component.service';
import {Router} from '@angular/router';
import firebase from 'firebase';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.page.html',
  styleUrls: ['./signin.page.scss'],
})
export class SigninPage implements OnInit {

  constructor(
    private authService: AuthenticationService,
    private compService: ComponentService,
    private router: Router,
  ) { }

  ngOnInit() {
  }

  async onSubmit(form: NgForm): Promise<void> {
    await this.compService.showLoading();
    const email = form.value.email.toString();
    const password = form.value.password.toString();
    try {
      const userCredential: firebase.auth.UserCredential = await this.authService.signIn(
          email,
          password
      );
      this.authService.userId = userCredential.user.uid;
      await this.compService.hideLoading();
      await this.router.navigateByUrl('/tabs/home');
    } catch (error) {
      await this.compService.hideLoading();
      await this.compService.handleError(error);
    }
  }

}
