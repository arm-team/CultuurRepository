import { Injectable } from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {AngularFireAuth} from '@angular/fire/auth';
import firebase from 'firebase';
import {first} from 'rxjs/operators';
import {Profile} from '../models/profile.model';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  public userId: string;
  constructor(
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore
  ) { }

  getUser(): Promise<firebase.User> {
    return this.afAuth.authState.pipe(first()).toPromise();
  }

  signin(email: string, password: string): Promise<firebase.auth.UserCredential> {
    return this.afAuth.signInWithEmailAndPassword(email, password);
  }

  async signup(email: string, password: string, profile: Profile): Promise<firebase.auth.UserCredential> {
    try {
      const newUserCredential: firebase.auth.UserCredential = await this.afAuth.createUserWithEmailAndPassword(
          email,
          password
      );
      await this.firestore
          .doc(`profile/${newUserCredential.user.uid}`)
          .set({ profile });
      return newUserCredential;
    } catch (error) {
      throw error;
    }
  }

  // resetPassword(email: string): Promise<void> {
  //   return this.afAuth.sendPasswordResetEmail(email);
  // }

  signout(): Promise<void> {
    return this.afAuth.signOut();
  }
}
