import { Component, OnInit } from '@angular/core';
import {NgForm} from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/auth';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

  constructor(
    private afAuth: AngularFireAuth
  ) { }

  ngOnInit() {
  }

  onSubmit(form: NgForm){
    const email = form.value.email.toString();
    const password = form.value.password.toString();
    this.afAuth.createUserWithEmailAndPassword(email, password)
        .then((res: any) => console.log(res))
        .catch((error: any) => console.error(error));
  }

}
