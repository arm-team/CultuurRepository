import { Component, OnInit } from '@angular/core';
import {PostService} from '../../../services/post.service';
import {Post} from '../../../models/post.model';
import {ActivatedRoute} from '@angular/router';
import {ProfileService} from '../../../services/profile.service';
import {map} from 'rxjs/operators';
import {Profile} from '../../../models/profile.model';
import {NgForm} from '@angular/forms';
import {AuthenticationService} from '../../../services/authentication.service';
import firebase from 'firebase';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.page.html',
  styleUrls: ['./comment.page.scss'],
})
export class CommentPage implements OnInit {
  postId: string;
  currentUser: firebase.User;
  post: Post;
  profiles: Profile[];
  constructor(
      private activatedRoute: ActivatedRoute,
      private postServ: PostService,
      private profileServ: ProfileService,
      private authServ: AuthenticationService,
  ) { }

  async ngOnInit() {
    this.currentUser = await this.authServ.getUser();
    await this.activatedRoute.paramMap.subscribe(paramMap => {
      if (!paramMap.has('postId')) { return; }
      const postId = paramMap.get('postId');
      this.postId = postId;
      this.postServ.getPost(postId).valueChanges()
          .subscribe(res => {
            this.post = res;
            console.log(res);
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

  onSubmit(form: NgForm){
    this.postServ.commentPost(this.postId, this.currentUser.uid, form.value.comment);
    form.reset();
  }

  findProfile(uid: string){
    return this.profiles.find(profile => {
      return profile.key === uid;
    });
  }

}
