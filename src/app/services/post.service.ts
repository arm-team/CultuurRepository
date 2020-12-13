import { Injectable } from '@angular/core';
import {AngularFireDatabase, AngularFireList, AngularFireObject} from '@angular/fire/database';
import {Post} from '../models/post.model';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(
      private db: AngularFireDatabase,
  ) { }

  getPost(key: string): AngularFireObject<Post>{
    return this.db.object(`post/${key}`);
  }
  getPosts(where?: string[]): AngularFireList<Post>{
    if (where === undefined){
      return this.db.list(`post/`);
    }
    return this.db.list(`post/`, ref => ref.orderByChild(where[0]).equalTo(where[1]));
  }

  createPost(post: Post){
    return this.db.list('post/').push(post);
  }

  likePost(key: string, userId: string, disliked: boolean, itemKey: string){
    if (disliked){
      this.undislikePost(key, itemKey);
    }
    const uid = {uid: userId};
    this.db.list(`post/${key}/like/`).push(uid);
  }
  unlikePost(key: string, itemKey: string){
    this.db.list(`post/${key}/like/`).remove(itemKey);
  }

  dislikePost(key: string, userId: string, liked: boolean, itemKey: string){
    if (liked){
      this.unlikePost(key, itemKey);
    }
    const uid = {uid: userId};
    this.db.list(`post/${key}/dislike/`).push(uid);
  }
  undislikePost(key: string, itemKey: string){
    this.db.list(`post/${key}/dislike/`).remove(itemKey);
  }

  commentPost(key: string, userId: string, msg: string){
    const comment = {
      content: msg,
      date: Date.now(),
      uid: userId
    };
    this.db.list(`post/${key}/comment/`).push(comment);
  }
}
