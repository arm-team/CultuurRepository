import { Injectable } from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import firebase from 'firebase';
import {first} from 'rxjs/operators';
import {Profile} from '../models/profile.model';
import {AngularFireDatabase, AngularFireList} from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  public userId: string;
  profileRef: AngularFireList<Profile> = null;
  constructor(
    private afAuth: AngularFireAuth,
    private db: AngularFireDatabase,
  ) {}

  getUser(): Promise<firebase.User> {
    return this.afAuth.authState.pipe(first()).toPromise();
  }

  signIn(email: string, password: string): Promise<firebase.auth.UserCredential> {
    return this.afAuth.signInWithEmailAndPassword(email, password);
  }

  async signUp(email: string, password: string, profile: Profile): Promise<firebase.auth.UserCredential> {
    try {
      const newUserCredential: firebase.auth.UserCredential = await this.afAuth.createUserWithEmailAndPassword(
          email,
          password
      );
      // Write Data to Realtime Database
      const path = '/profile/' + newUserCredential.user.uid;
      await this.db.object(path).set(profile);
      return newUserCredential;
    } catch (error) {
      throw error;
    }
  }

  // resetPassword(email: string): Promise<void> {
  //   return this.afAuth.sendPasswordResetEmail(email);
  // }

  signOut(): Promise<void> {
    return this.afAuth.signOut();
  }
}
