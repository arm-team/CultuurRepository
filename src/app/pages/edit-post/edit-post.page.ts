import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {PostService} from '../../services/post.service';
import {Post} from '../../models/post.model';
import firebase from 'firebase';
import {AuthenticationService} from '../../services/authentication.service';
import {map} from 'rxjs/operators';
import {DestinationService} from '../../services/destination.service';
import {Spot} from '../../models/destination.model';
import {NgForm} from '@angular/forms';
import {ComponentService} from '../../services/component.service';
import {NavController} from '@ionic/angular';

@Component({
  selector: 'app-edit-post',
  templateUrl: './edit-post.page.html',
  styleUrls: ['./edit-post.page.scss'],
})
export class EditPostPage implements OnInit {
  postId: string;
  post: Post;
  spots: Spot[];
  currentUser: firebase.User;
  constructor(
      private activatedRoute: ActivatedRoute,
      private postServ: PostService,
      private destinationServ: DestinationService,
      private authServ: AuthenticationService,
      private compServ: ComponentService,
      private navCtrl: NavController,
  ) { }

  async ngOnInit() {
    this.currentUser = await this.authServ.getUser();
    this.activatedRoute.paramMap.subscribe(paramMap => {
      if (!paramMap.has('postId')) { return; }
      const postId = paramMap.get('postId');
      this.postId = postId;
      this.postServ.getPost(postId).valueChanges()
          .subscribe(data => {
            this.post = data;
            console.log(data);
          });
      this.destinationServ.getSpots().snapshotChanges()
          .pipe(
              map(changes => changes.map(c => ({key: c.payload.key, ...c.payload.val()})))
          ).subscribe(data => {
        this.spots = data;
        console.log(data);
      });
    });
  }

  async onSubmit(form: NgForm) {
    // Show loading post
    await this.compServ.showLoading('Editing post');
    const post: any = {
      caption: form.value.caption,
      imageurl: this.post.imageurl,
      regionid: this.findSpot(form.value.location).regionid,
      spotid: form.value.location,
      tag: form.value.tag,
      uid: this.currentUser.uid,
      date: Date.now(),
      like: this.post.like ? this.post.like : null,
      dislike: this.post.dislike ? this.post.dislike : null,
      comment: this.post.comment ? this.post.comment : null,
    };
    this.postServ.editPost(this.postId, post).then(() => {
      form.reset();
      this.compServ.hideLoading();
      this.navCtrl.pop();
      this.compServ.showToast('Post Edited');
    });
  }

  findSpot(key: string){
    return this.spots.find(spot => {
      return spot.key === key;
    });
  }

}
