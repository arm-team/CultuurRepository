import { Component, OnInit } from '@angular/core';
import {Profile} from '../../models/profile.model';
import {ProfileService} from '../../services/profile.service';
import {PostService} from '../../services/post.service';
import {count, map} from 'rxjs/operators';
import {Post} from '../../models/post.model';
import {ActivatedRoute} from '@angular/router';
import {Spot} from '../../models/destination.model';
import {DestinationService} from '../../services/destination.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.page.html',
  styleUrls: ['./post.page.scss'],
})
export class PostPage implements OnInit {
  spotId: string;
  profiles: Profile[];
  posts: Post[];
  spot: Spot;
  constructor(
      private activatedRoute: ActivatedRoute,
      private profileServ: ProfileService,
      private postServ: PostService,
      private destinationServ: DestinationService,
  ) { }

  async ngOnInit() {
    await this.activatedRoute.paramMap.subscribe(paramMap => {
      if (!paramMap.has('spotId')) { return; }
      const spotId = paramMap.get('spotId');
      this.spotId = spotId;
      this.destinationServ.getSpot(spotId).valueChanges()
          .subscribe(data => {
            this.spot = data;
            console.log(data);
          });

      this.postServ.getPosts(['spotid', spotId]).snapshotChanges()
          .pipe(
              map(changes => changes.map(c => ({key: c.payload.key, ...c.payload.val()})))
          ).subscribe(data => {
            this.posts = data;
            console.log(data);
          });

      this.profileServ.getProfiles().snapshotChanges()
          .pipe(
              map(changes => changes.map(c => ({key: c.payload.key, ...c.payload.val()})))
          ).subscribe(data => {
        this.profiles = data;
        console.log(data);
      });
    });
  }

  openMap(url: string){
    window.open(url, '_system');
  }

  findProfile(uid: string){
    return this.profiles.find(profile => {
        return profile.key === uid;
    });
  }

  countItem(item: any[]): number{
    return Object.keys(item).length;
  }
}

