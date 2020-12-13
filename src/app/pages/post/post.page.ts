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
  profiles: Profile[];
  posts: Post[];
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
    if (item){
      return Object.keys(item).length;
    }else{
      return 0;
    }
  }

  makeHashtag(str: string){
    const wordArray = str.split(' ').filter(char => char !== '');
    let result = '#';

    if (wordArray.length === 0) {
      return false;
    }

    result = result + wordArray.map(word => {
      return word.charAt(0).toUpperCase() + word.slice(1);
    }).join('');

    if (result.length > 140) {
      return false;
    } else{
      return result;
    }
  }

  likePost(postKey: string, postUid: string, currUid: string, like: any[], dislike: any[]){
    this.postServ.likePost(postKey, currUid, this.isLikedOrDisliked(dislike, currUid), this.getKey(like, postUid));
  }
  unlikePost(postKey: string, like: any[], postUid: string){
    this.postServ.unlikePost(postKey, this.getKey(like, postUid));
  }

  dislikePost(postKey: string, postUid: string, currUid: string, like: any[], dislike: any[]){
    this.postServ.dislikePost(postKey, currUid, this.isLikedOrDisliked(like, currUid), this.getKey(dislike, postUid));
  }
  undislikePost(postKey: string, dislike: any[], postUid: string){
    this.postServ.undislikePost(postKey, this.getKey(dislike, postUid));
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

