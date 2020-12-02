import { Component, OnInit } from '@angular/core';
import {ProfileService} from '../../services/profile.service';
import {Profile} from '../../models/profile.model';
import {AuthenticationService} from '../../services/authentication.service';
import {Router} from '@angular/router';
import firebase from 'firebase';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  profile: Profile;
  currentUser: firebase.User;
  constructor(
      private profileServ: ProfileService,
      private authService: AuthenticationService,
      private router: Router,
  ) { }

  async ngOnInit() {
    const user: firebase.User = await this.authService.getUser();
    this.currentUser = user;
  }

  ionViewWillEnter(){
    this.profileServ.getProfile(this.currentUser.uid).valueChanges()
        .subscribe(data => {
          this.profile = data;
          console.log(data);
        });
  }

  async signOut(){
    await this.authService.signOut();
    await this.router.navigateByUrl('/signin');
  }
}
