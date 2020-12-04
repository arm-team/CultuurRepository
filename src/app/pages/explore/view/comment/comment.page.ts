import { Component, OnInit } from '@angular/core';
import {Post} from '../../../../models/post.model';
import {Profile} from '../../../../models/profile.model';
import {ActivatedRoute} from '@angular/router';
import {PostService} from '../../../../services/post.service';
import {ProfileService} from '../../../../services/profile.service';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.page.html',
  styleUrls: ['./comment.page.scss'],
})
export class CommentPage implements OnInit {
  postId: string;
  post: Post;
  profiles: Profile[];
  constructor(
      private activatedRoute: ActivatedRoute,
      private postServ: PostService,
      private profileServ: ProfileService,
  ) { }

  async ngOnInit() {
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

  findProfile(uid: string){
    return this.profiles.find(profile => {
      return profile.key === uid;
    });
  }
}
