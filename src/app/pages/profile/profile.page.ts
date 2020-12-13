import { Component, OnInit } from '@angular/core';
import {ProfileService} from '../../services/profile.service';
import {Profile} from '../../models/profile.model';
import {AuthenticationService} from '../../services/authentication.service';
import {Router} from '@angular/router';
import firebase from 'firebase';
import {PostService} from '../../services/post.service';
import {map} from 'rxjs/operators';
import {Post} from '../../models/post.model';
import {AlertController} from '@ionic/angular';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  profile: Profile;
  currentUser: firebase.User;
  posts: Post[];
  constructor(
      private profileServ: ProfileService,
      private authService: AuthenticationService,
      private postServ: PostService,
      private alertCtrl: AlertController,
      private router: Router,
  ) { }

  ngOnInit() {
  }

  async ionViewWillEnter(){
    this.currentUser = await this.authService.getUser();
    this.profileServ.getProfile(this.currentUser.uid).valueChanges()
        .subscribe(data => {
          this.profile = data;
          console.log(data);
        });
    this.postServ.getPosts(['uid', this.currentUser.uid]).snapshotChanges()
        .pipe(
            map(changes => changes.map(c => ({key: c.payload.key, ...c.payload.val()})))
        ).subscribe(data => {
      this.posts = data;
      console.log(data);
    });
  }

  countItem(item: any[]): number{
    if (item){
      return Object.keys(item).length;
    }else{
      return 0;
    }
  }

  async presentAlert(key: string){
    const alert = await this.alertCtrl
        .create({
          header: 'Are you sure?',
          message: 'Do you really want to delete this post?',
          buttons: [
            {
              text: 'Cancel',
              role: 'cancel'
            },
            {
              text: 'Delete',
              handler: () => {
                this.deletePost(key);
              }
            }
          ]
        });
    await alert.present();
  }

  deletePost(key: string){
    this.postServ.deletePost(key);
  }

  async signOut(){
    await this.authService.signOut();
    await this.router.navigateByUrl('/signin');
  }
}
