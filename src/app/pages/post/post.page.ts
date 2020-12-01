import { Component, OnInit } from '@angular/core';
import {Profile} from '../../models/profile.model';
import {ProfileService} from '../../services/profile.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.page.html',
  styleUrls: ['./post.page.scss'],
})
export class PostPage implements OnInit {
  profile: Profile;
  constructor(
      private profileServ: ProfileService,
  ) { }

  ngOnInit() {
    this.profileServ.getProfile().then(res => res.subscribe(r => this.profile = r));
  }

}
