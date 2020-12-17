import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Profile} from '../../../models/profile.model';
import firebase from 'firebase';
import {ProfileService} from '../../../services/profile.service';
import {AuthenticationService} from '../../../services/authentication.service';
import {NgForm} from '@angular/forms';
import {ComponentService} from '../../../services/component.service';
import {Camera, CameraPhoto, CameraResultType, CameraSource} from '@capacitor/core';
import {finalize, map} from 'rxjs/operators';
import {AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask} from '@angular/fire/storage';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {Observable} from 'rxjs';


@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage implements OnInit {
  loadProfile: Profile;
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

  @ViewChild('form', null) form: NgForm;
  constructor(
      private profileServ: ProfileService,
      private authService: AuthenticationService,
      private compService: ComponentService,
      private afStorage: AngularFireStorage,
      private sanitizer: DomSanitizer,
  ) { }

  async ngOnInit() {
    this.currentUser = await this.authService.getUser();
    this.profileServ.getProfile(this.currentUser.uid).valueChanges()
      .subscribe(data => {
        this.loadProfile = data;
        console.log(data);
      });
  }

  async onSubmit(form: NgForm) {
    console.log(form);
    this.loadProfile.username = form.value.username;
    this.loadProfile.name = form.value.name;
    await this.compService.showLoading();
    this.profileServ.update(this.currentUser.uid, form.value).then(() => {
      this.compService.hideLoading();
      this.compService.showToast('Profile Updated');
    }).catch(error => console.log(error));
  }

  async getPicture(type: string) {
    const image = await Camera.getPhoto({
      quality: 100,
      width: 400,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Prompt,
    });
    this.image = image;
    this.photo = this.sanitizer.bypassSecurityTrustResourceUrl(image && (image.dataUrl));
    this.uploadImage(type, image.dataUrl);
  }

  // function to upload file
  uploadImage(type: string, file: string){
    this.compService.showLoading('Uploading Picture...');
    // create a random id
    const randomId = Math.random().toString(36).substring(2);
    // create a reference to the storage bucket location
    if (type === 'cover'){
      this.ref = this.afStorage.ref(`/profile/cover/${randomId}`);
    }else if (type === 'image'){
      this.ref = this.afStorage.ref(`/profile/image/${randomId}`);
    }
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
    this.uploadState = this.task.snapshotChanges().pipe(map(s => s.state));
    this.uploadState.subscribe(res => console.log(res));
    this.task.snapshotChanges()
        .pipe(finalize(() => {
          this.ref.getDownloadURL().subscribe(res => {
            if (res !== undefined){
              if (type === 'cover'){
                this.profileServ.update(this.currentUser.uid, {coverurl: res}).then(() => this.compService.hideLoading());
              }else if (type === 'image'){
                this.profileServ.update(this.currentUser.uid, {imageurl: res}).then(() => this.compService.hideLoading());
              }
            }
          });
        }))
        .subscribe();
  }

}
