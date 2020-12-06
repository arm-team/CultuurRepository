import {Component, OnInit, ViewChild} from '@angular/core';
import {Profile} from '../../../models/profile.model';
import firebase from 'firebase';
import {ProfileService} from '../../../services/profile.service';
import {AuthenticationService} from '../../../services/authentication.service';
import {Router} from '@angular/router';
import {NgForm} from '@angular/forms';
import {AngularFireDatabase} from '@angular/fire/database';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage implements OnInit {
  loadProfile: Profile;
  currentUser: firebase.User;

  @ViewChild('form', null) form: NgForm;
  constructor(
      private profileServ: ProfileService,
      private authService: AuthenticationService,
      private db: AngularFireDatabase,
      private router: Router,
  ) { }

  ngOnInit() {
  }

  async ionViewWillEnter(){
    this.currentUser = await this.authService.getUser();
    this.profileServ.getProfile(this.currentUser.uid).valueChanges()
        .subscribe(data => {
          this.loadProfile = data;
          console.log(data);
          console.log('profile Key: ' + this.currentUser.uid);
        });
  }

  onSubmit(form: NgForm){
    console.log(form);
    this.profileServ.update(this.currentUser.uid, form.value).then(res => {
      console.log(res);
      this.router.navigateByUrl('tabs/profile');
    }).catch(error => console.log(error));

    form.reset();
    this.router.navigateByUrl('tabs/profile');
  }


}
