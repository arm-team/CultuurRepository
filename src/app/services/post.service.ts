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
}
