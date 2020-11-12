import { Component, OnInit } from '@angular/core';
import {ProfileService} from '../services/profile.service';
import {Profile} from '../models/profile.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  profile: Profile;
  constructor(
      private profileServ: ProfileService,
  ) { }

  ngOnInit() {
    this.profileServ.getProfile().then(res => res.subscribe(r => this.profile = r));
  }

}
