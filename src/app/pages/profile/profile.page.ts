import { Component, OnInit } from '@angular/core';
import {ProfileService} from '../../services/profile.service';
import {Profile} from '../../models/profile.model';
import {AuthenticationService} from '../../services/authentication.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  profile: Profile;
  constructor(
      private profileServ: ProfileService,
      private authService: AuthenticationService,
      private router: Router,
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.profileServ.getProfile().then(res => res.subscribe(r => this.profile = r));
  }

  async signOut(){
    await this.authService.signOut();
    await this.router.navigateByUrl('/signin');
  }
}
