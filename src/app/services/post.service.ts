import { Injectable } from '@angular/core';
import {AngularFireDatabase, AngularFireList} from '@angular/fire/database';
import {Post} from '../models/post.model';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(
      private db: AngularFireDatabase,
  ) { }

  getPost(key?: string, where?: string[]): AngularFireList<Post>{
    if (key === undefined) {
      if (where === undefined){
        return this.db.list(`post/`);
      }else{
        return this.db.list(`post/`, ref => ref.orderByChild(where[0]).equalTo(where[1]));
      }
    }
    else {
      if (where === undefined){
        return this.db.list(`post/${key}`);
      }else{
        return this.db.list(`post/${key}`, ref => ref.orderByChild(where[0]).equalTo(where[1]));
      }
    }
  }
}
