import { Component, OnInit } from '@angular/core';
import {PostService} from '../../services/post.service';
import {NgForm} from '@angular/forms';
import {Comment, Dislike, Like, Post} from '../../models/post.model';
import {DestinationService} from '../../services/destination.service';
import {map} from 'rxjs/operators';
import {Spot} from '../../models/destination.model';
import firebase from 'firebase';
import {AuthenticationService} from '../../services/authentication.service';
import {NavController} from '@ionic/angular';
import {ComponentService} from '../../services/component.service';

@Component({
  selector: 'app-add-post',
  templateUrl: './add-post.page.html',
  styleUrls: ['./add-post.page.scss'],
})
export class AddPostPage implements OnInit {
  spots: Spot[];
  currentUser: firebase.User;
  constructor(
      private postServ: PostService,
      private destinationServ: DestinationService,
      private authServ: AuthenticationService,
      private navCtrl: NavController,
      private compServ: ComponentService,
  ) { }

  async ngOnInit() {
    this.currentUser = await this.authServ.getUser();
    await this.destinationServ.getSpots().snapshotChanges()
        .pipe(
            map(changes => changes.map(c => ({key: c.payload.key, ...c.payload.val()})))
        ).subscribe(data => {
      this.spots = data;
      console.log(data);
    });
  }

  onSubmit(form: NgForm) {
    const post: any = {
      caption: form.value.caption,
      imageurl: '',
      regionid: this.findSpot(form.value.location).regionid,
      spotid: form.value.location,
      tag: form.value.tag,
      uid: this.currentUser.uid,
      date: Date.now(),
    };
    this.postServ.createPost(post);
    form.reset();
    this.navCtrl.pop();
    this.compServ.showToast('Post Created').then(r => console.log(r));
  }

  findSpot(key: string){
    return this.spots.find(spot => {
      return spot.key === key;
    });
  }

}
