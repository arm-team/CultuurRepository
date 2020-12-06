import { Component, OnInit } from '@angular/core';
import {PostService} from '../../services/post.service';
import {NgForm} from '@angular/forms';
import {DestinationService} from '../../services/destination.service';
import {finalize, map} from 'rxjs/operators';
import {Spot} from '../../models/destination.model';
import firebase from 'firebase';
import {AuthenticationService} from '../../services/authentication.service';
import {NavController} from '@ionic/angular';
import {ComponentService} from '../../services/component.service';
import {Camera, CameraPhoto, CameraResultType, CameraSource} from '@capacitor/core';
import {AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask} from '@angular/fire/storage';
import {Observable} from 'rxjs';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';

@Component({
  selector: 'app-add-post',
  templateUrl: './add-post.page.html',
  styleUrls: ['./add-post.page.scss'],
})
export class AddPostPage implements OnInit {
  spots: Spot[];
  currentUser: firebase.User;

  // Variable upload function
  photo: SafeResourceUrl;
  image: CameraPhoto;
  ref: AngularFireStorageReference;
  task: AngularFireUploadTask;
  uploadProgress: Observable<number>;
  downloadURL: Observable<string>;
  uploadState: Observable<string>;
  imageUrl: string;
  constructor(
      private postServ: PostService,
      private destinationServ: DestinationService,
      private authServ: AuthenticationService,
      private navCtrl: NavController,
      private compServ: ComponentService,
      private afStorage: AngularFireStorage,
      private sanitizer: DomSanitizer,
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
    this.uploadImage(this.image.dataUrl);
    this.uploadState.subscribe(state => {
      if (state === 'success'){
        this.downloadURL.subscribe(imageUrl => {
          if (imageUrl !== undefined){
            const post: any = {
              caption: form.value.caption,
              imageurl: imageUrl,
              regionid: this.findSpot(form.value.location).regionid,
              spotid: form.value.location,
              tag: form.value.tag,
              uid: this.currentUser.uid,
              date: Date.now(),
            };
            this.postServ.createPost(post).then(() => {
              form.reset();
              this.navCtrl.pop();
              this.compServ.showToast('Post Created');
            });
          }
        });
      }
    });
  }

  findSpot(key: string){
    return this.spots.find(spot => {
      return spot.key === key;
    });
  }

  async getPicture() {
    const image = await Camera.getPhoto({
      quality: 100,
      width: 400,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Prompt,
    });
    this.image = image;

    this.photo = this.sanitizer.bypassSecurityTrustResourceUrl(image && (image.dataUrl));
  }

  // function to upload file
  uploadImage(file: string){
    // create a random id
    const randomId = Math.random().toString(36).substring(2);
    // create a reference to the storage bucket location
    this.ref = this.afStorage.ref('/images/' + randomId);
    // the put method creates an AngularFireUploadTask
    // and kicks off the upload
    this.task = this.ref.putString(file, 'data_url');
    // AngularFireUploadTask provides observable
    // to get uploadProgress value
    this.uploadProgress = this.task.snapshotChanges()
        .pipe(map(s => (s.bytesTransferred / s.totalBytes) * 100));

    // observe upload progress
    this.uploadProgress = this.task.percentageChanges();
    // get notified when the download URL is available
    this.task.snapshotChanges()
        .pipe(finalize(() => {
          this.downloadURL = this.ref.getDownloadURL();
        }))
        .subscribe();
    this.uploadState = this.task.snapshotChanges().pipe(map(s => s.state));
    this.uploadState.subscribe(res => console.log(res));
  }
}
