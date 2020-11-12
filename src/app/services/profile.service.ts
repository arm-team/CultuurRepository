import { Injectable } from '@angular/core';
import {AuthenticationService} from './authentication.service';
import {Observable} from 'rxjs';
import firebase from 'firebase';
import {Profile} from '../models/profile.model';
import {AngularFireDatabase, AngularFireList} from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private currentUser: firebase.User;
  private listRef: AngularFireList<Profile> = null;
  private dbPath = '/profile/';
  private profile: Observable<any>;
  constructor(
      private db: AngularFireDatabase,
      private authService: AuthenticationService
  ) { this.listRef = db.list(this.dbPath); }

  async getProfile(key?: string){
    const user: firebase.User = await this.authService.getUser();
    this.currentUser = user;
    if (key === undefined){
      key = user.uid;
      console.log('key nya undefined');
    }
    this.profile = await this.db.object(`profile/${key}`).valueChanges();
    return this.profile;
  }

  // updateName(fullName: string): Promise<void> {
  //   return this.userProfile.update({ fullName });
  // }

  // async updateEmail(newEmail: string, password: string): Promise<void> {
  //   const credential: firebase.auth.AuthCredential = firebase.auth.EmailAuthProvider.credential(
  //       this.currentUser.email,
  //       password
  //   );
  //   try {
  //     await this.currentUser.reauthenticateWithCredential(credential);
  //     await this.currentUser.updateEmail(newEmail);
  //     return this.userProfile.update({ email: newEmail });
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }

  // async updatePassword(
  //     newPassword: string,
  //     oldPassword: string
  // ): Promise<void> {
  //   const credential: firebase.auth.AuthCredential = firebase.auth.EmailAuthProvider.credential(
  //       this.currentUser.email,
  //       oldPassword
  //   );
  //   try {
  //     await this.currentUser.reauthenticateWithCredential(credential);
  //     return this.currentUser.updatePassword(newPassword);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }
}
