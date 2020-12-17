import { Injectable } from '@angular/core';
// import {AngularFireDatabase, AngularFireList, AngularFireObject} from '@angular/fire/database';
import {Profile} from '../models/profile.model';
import {AngularFireDatabase, AngularFireList, AngularFireObject} from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private dbPath = '/profile';
  profileRef: AngularFireList<Profile> = null;
  constructor(
      private db: AngularFireDatabase,
  ) {
    this.profileRef = db.list(this.dbPath);
  }

  getProfile(key: string): AngularFireObject<Profile>{
    return this.db.object(`profile/${key}`);
  }
  getProfiles(where?: string): AngularFireList<Profile>{
    if (where === undefined){
      return this.db.list(`profile/`);
    }
    return this.db.list(`profile/`, ref => ref.orderByChild(where[0]).equalTo(where[1]));
  }

  update(key: string, value: any): Promise<void> {
    return this.profileRef.update(key, value);
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
