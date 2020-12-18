import { Component, OnInit } from '@angular/core';
import {Profile} from '../../models/profile.model';
import {ProfileService} from '../../services/profile.service';
import {PostService} from '../../services/post.service';
import {map} from 'rxjs/operators';
import {Post} from '../../models/post.model';
import {ActivatedRoute} from '@angular/router';
import {Spot} from '../../models/destination.model';
import {DestinationService} from '../../services/destination.service';
import {AuthenticationService} from '../../services/authentication.service';
import firebase from 'firebase';

@Component({
  selector: 'app-post',
  templateUrl: './post.page.html',
  styleUrls: ['./post.page.scss'],
})
export class PostPage implements OnInit {
  currentUser: firebase.User;
  spotId: string;
  postId: string;
  profiles: Profile[];
  profile: Profile;
  posts: Post[];
  post: Post;
  spot: Spot;
  constructor(
      private activatedRoute: ActivatedRoute,
      private profileServ: ProfileService,
      private postServ: PostService,
      private destinationServ: DestinationService,
      private authServ: AuthenticationService,
  ) { }

  async ngOnInit() {
    this.currentUser = await this.authServ.getUser();
    await this.activatedRoute.paramMap.subscribe(paramMap => {
      if (paramMap.has('spotId')) {
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
      }else if (paramMap.has('postId')) {
        const postId = paramMap.get('postId');
        this.postId = postId;
        this.postServ.getPost(postId).valueChanges()
            .subscribe(data => {
              this.post = data;
              console.log(data);
              this.destinationServ.getSpot(data.spotid).valueChanges()
                  .subscribe(d => {
                    this.spot = d;
                    console.log(d);
                  });
            });
        this.profileServ.getProfile(this.currentUser.uid).valueChanges()
            .subscribe(data => {
              this.profile = data;
              console.log(data);
            });
      }
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
    if (item){
      return Object.keys(item).length;
    }else{
      return 0;
    }
  }

  likePost(postKey: string, currUid: string, dislike: any[]){
    this.postServ.likePost(postKey, currUid, this.isLikedOrDisliked(dislike, currUid), this.getKey(dislike, currUid));
  }
  unlikePost(postKey: string, like: any[], currUid: string){
    this.postServ.unlikePost(postKey, this.getKey(like, currUid));
  }

  dislikePost(postKey: string, currUid: string, like: any[]){
    this.postServ.dislikePost(postKey, currUid, this.isLikedOrDisliked(like, currUid), this.getKey(like, currUid));
  }
  undislikePost(postKey: string, dislike: any[], currUid: string){
    this.postServ.undislikePost(postKey, this.getKey(dislike, currUid));
  }

  isLikedOrDisliked(item: any[], uid: string) {
    if (item) {
      if (Object.values(item).find(i => i.uid === uid)) {
        return true;
      }
    }
    return false;
  }

  getKey(item: any[], uid: string){
    if (item) {
      // tslint:disable-next-line:prefer-const
      for (let [key, value] of Object.entries(item)) {
        if (Object.values(value)[0] === uid){
          return key;
        }
      }
    }
  }
}

