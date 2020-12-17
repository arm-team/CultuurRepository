import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Profile} from '../../../models/profile.model';
import firebase from 'firebase';
import {ProfileService} from '../../../services/profile.service';
import {AuthenticationService} from '../../../services/authentication.service';
import {Router} from '@angular/router';
import {NgForm} from '@angular/forms';
import {AngularFireDatabase} from '@angular/fire/database';
import {ActionSheetController, LoadingController, Platform} from '@ionic/angular';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {AngularFireStorage} from '@angular/fire/storage';
import {Camera, CameraResultType, CameraSource, Capacitor} from '@capacitor/core';
import {finalize} from 'rxjs/operators';


@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage implements OnInit {
  loadProfile: Profile;
  currentUser: firebase.User;

  currentUserId: string;
  profileData: any;
  private isDesktop: boolean;
  private downloadURL: any;
  private imageFile: any;
  private base64Image: any;
  private boolCamera: boolean = null;
  private photo: SafeResourceUrl;
  private banner: SafeResourceUrl;
  private bannerFile: any;

  @ViewChild('form', null) form: NgForm;
  @ViewChild('filePicker', {static: false}) filePickerRef: ElementRef<HTMLInputElement>;
  constructor(

      private profileServ: ProfileService,
      private authService: AuthenticationService,
      private db: AngularFireDatabase,
      private router: Router,
      private actionSheetCtrl: ActionSheetController,
      private platform: Platform,
      private sanitizer: DomSanitizer,
      private storage: AngularFireStorage,
      private loadingCtrl: LoadingController
  ) { }

  ngOnInit() {
    if (this.platform.is('mobile') && this.platform.is('hybrid') || this.platform.is('desktop')){
      this.isDesktop = true;
    }
    this.getIdUser();
  }

  getIdUser(){
    this.authService.userDetails().subscribe(res => {
      if (res !== null){
        this.currentUserId = res.uid;
        this.getProfileData();
      }
    }, err => {
      console.log(err);
    });
  }

  getProfileData(){
    this.profileServ.getProfile(this.currentUserId).valueChanges().subscribe( data => {
      this.profileData = data;
      console.log(data);
      if (this.profileData.foto){
        this.photo = this.profileData.foto;
      }
      if (this.profileData.fbanner){
        this.banner = this.profileData.fbanner;
      }
    });
  }

  // new get id user dan profile, mark for backup

  /*async ionViewWillEnter(){

    this.currentUser = await this.authService.getUser();
    this.profileServ.getProfile(this.currentUser.uid).valueChanges()
        .subscribe(data => {
          this.loadProfile = data;
          console.log(data);
          console.log('profile Key: ' + this.currentUser.uid);
        });
  }*/

  onSubmit(form: NgForm){
    console.log(form);
    this.profileServ.update(this.currentUserId, form.value).then(res => {
      console.log(res);
      this.router.navigateByUrl('tabs/profile');
    }).catch(error => console.log(error));

    form.reset();
    this.router.navigateByUrl('tabs/profile');
  }

  async getPicture(type: string){
    if (!Capacitor.isPluginAvailable('Camera') || (this.isDesktop && type === 'gallery')){
      this.filePickerRef.nativeElement.click();
      return;
    }

    const image = await Camera.getPhoto({
      quality: 100,
      width: 500,
      height: 500,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source: CameraSource.Prompt
    });

    this.photo = this.sanitizer.bypassSecurityTrustResourceUrl(image && ('data: image/png;base64,' + image.base64String));
    this.boolCamera = true;
    this.base64Image = image.base64String;

    this.uploadImage();
  }

  async getBanner(type: string){
    if (!Capacitor.isPluginAvailable('Camera') || (this.isDesktop && type === 'gallery')){
      this.filePickerRef.nativeElement.click();
      return;
    }

    const banner = await Camera.getPhoto({
      quality: 100,
      width: 500,
      height: 250,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source: CameraSource.Prompt
    });

    this.banner = this.sanitizer.bypassSecurityTrustResourceUrl(banner && ('data: banner/png;base64,' + banner.base64String));
    this.boolCamera = true;
    this.base64Image = banner.base64String;

    this.uploadBanner();
  }

  uploadBanner(){
    this.presentLoading().then(() => {
      const n = Date.now();
      const filePath = `banner/${n}`;
      const fileRef = this.storage.ref(filePath);
      let taskb;
      if (this.boolCamera){
        taskb  = fileRef.putString(this.base64Image, 'base64', { contentType: 'image/png' });
      }
      else{
        taskb = this.storage.upload(`Banner/${n}`, this.bannerFile);
      }
      taskb.snapshotChanges()
          .pipe(
              finalize(() => {
                fileRef.getDownloadURL().subscribe(url => {
                  if (url) {
                    this.downloadURL = url;
                    this.profileData.fbanner = this.downloadURL;
                    this.profileServ.update(this.currentUserId, this.profileData);
                  }
                });
              })
          ).subscribe();
    });
  }

  uploadImage(){
    this.presentLoading().then(() => {
      const n = Date.now();
      const filePath = `profile/${n}`;
      const fileRef = this.storage.ref(filePath);
      let task;
      if (this.boolCamera){
        task  = fileRef.putString(this.base64Image, 'base64', { contentType: 'image/png' });
      }
      else{
        task = this.storage.upload(`profile/${n}`, this.imageFile);
      }
      task.snapshotChanges()
          .pipe(
              finalize(() => {
                fileRef.getDownloadURL().subscribe(url => {
                  if (url) {
                    this.downloadURL = url;
                    this.profileData.foto = this.downloadURL;
                    this.profileServ.update(this.currentUserId, this.profileData);
                  }
                });
              })
          ).subscribe();
    });
  }

  bannerLoaded(){
    setTimeout(() => {
      const bannerWidth = document.getElementById('bannerPicture').offsetWidth;
      document.getElementById('bannerPicture').style.height = bannerWidth + 'px';
    }, 10);
  }

  imageLoaded(){
      setTimeout(() => {
          const profileWidth = document.getElementById('profilePicture').offsetWidth;
          document.getElementById('profilePicture').style.height = profileWidth + 'px';
      }, 10);
  }

  onFileChoose(event){
      const file = event.target.files[0];
      const pattern = /image-*/;
      const reader = new FileReader();

      if (!file.type.match(pattern)){
          console.log('File format not supported');
          this.imageFile = null;
          return;
      }

      reader.onload = () => {
          this.photo = reader.result.toString();
      };
      reader.readAsDataURL(file);
      this.boolCamera = false;
      this.imageFile = file;

      this.uploadImage();
  }

  onFileChooseBanner(event){
    const file = event.target.files[0];
    const pattern = /banner-*/;
    const reader = new FileReader();

    if (!file.type.match(pattern)){
      console.log('File format not supported');
      this.bannerFile = null;
      return;
    }

    reader.onload = () => {
      this.banner = reader.result.toString();
    };
    reader.readAsDataURL(file);
    this.boolCamera = false;
    this.bannerFile = file;

    this.uploadBanner();
  }

  async presentLoading(){
    const loading = await this.loadingCtrl.create({
      message: 'Memperbaharui profile picture...',
      duration: 2000
    });
    await loading.present();

    const {role, data} = await loading.onDidDismiss();
    console.log('Loading dismissed!');
  }

  async presentFotoActionSheet(){
    const actionSheet = await this.actionSheetCtrl.create({
      animated: true,
      mode: 'ios',
      buttons: [
        {
          text: 'Camera',
          icon: 'camera-outline',
          handler: () => {
            this.getPicture('camera');
          }
        },
        {
          text: 'Gallery',
          icon: 'image-outline',
          handler: () => {
            this.getPicture('gallery');
          }
        }]
    });

    await actionSheet.present();
  }

  async presentBannerActionSheet(){
    const actionSheet = await this.actionSheetCtrl.create({
      animated: true,
      mode: 'ios',
      buttons: [
        {
          text: 'Camera',
          icon: 'camera-outline',
          handler: () => {
            this.getBanner('camera');
          }
        },
        {
          text: 'Gallery',
          icon: 'image-outline',
          handler: () => {
            this.getBanner('gallery');
          }
        }]
    });

    await actionSheet.present();
  }

}
