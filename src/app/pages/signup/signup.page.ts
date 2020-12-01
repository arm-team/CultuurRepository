import { Component, OnInit } from '@angular/core';
import {NgForm} from '@angular/forms';
import {AuthenticationService} from '../../services/authentication.service';
import firebase from 'firebase';
import {ComponentService} from '../../services/component.service';
import {Router} from '@angular/router';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

  constructor(
    private authService: AuthenticationService,
    private compService: ComponentService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  async onSubmit(form: NgForm): Promise<void>{
    await this.compService.showLoading();
    const iemail = form.value.email.toString();
    const ipassword = form.value.password.toString();
    const iusername = form.value.username.toString();
    const iname = form.value.name.toString();
    const icountry = form.value.country.toString();
    const profile: any = {
      countryid: icountry,
      coverurl: 'https://i.ibb.co/HXNgjQv/cover.png',
      email: iemail,
      imageurl: 'https://i.ibb.co/NYR2CH5/image.png',
      name: iname,
      username: iusername,
    };

    try {
      const userCredential: firebase.auth.UserCredential = await this.authService.signUp(
        iemail,
        ipassword,
        profile
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
