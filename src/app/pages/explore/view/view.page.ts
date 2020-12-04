import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {DestinationService} from '../../../services/destination.service';
import {Spot} from '../../../models/destination.model';
import {Post} from '../../../models/post.model';
import {PostService} from '../../../services/post.service';
import {map} from 'rxjs/operators';
import {ProfileService} from '../../../services/profile.service';
import {Profile} from '../../../models/profile.model';

@Component({
  selector: 'app-view',
  templateUrl: './view.page.html',
  styleUrls: ['./view.page.scss'],
})
export class ViewPage implements OnInit {
  spotId: string;
  spot: Spot;
  posts: Post[];
  profiles: Profile[];
  constructor(
      private activatedRoute: ActivatedRoute,
      private destinationServ: DestinationService,
      private postServ: PostService,
      private profileServ: ProfileService,
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
