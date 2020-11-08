import { Component, OnInit } from '@angular/core';
import {NgForm} from '@angular/forms';
import {AngularFireAuth} from '@angular/fire/auth';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.page.html',
  styleUrls: ['./signin.page.scss'],
})
export class SigninPage implements OnInit {

  constructor(
    private afAuth: AngularFireAuth
  ) { }

  ngOnInit() {
  }

  onSubmit(form: NgForm){
    const email = form.value.email.toString();
    const password = form.value.password.toString();
    this.afAuth.signInWithEmailAndPassword(email, password)
        .then((res: any) => console.log(res))
        .catch((error: any) => console.error(error));
  }

}
