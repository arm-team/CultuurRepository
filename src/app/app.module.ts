import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

// firebase
// pastikan sebelumnya telah menjalankan npm install firebase @angular/fire --save
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFirestoreModule } from '@angular/fire/firestore';
export const firebaseConfig = {
  apiKey: 'AIzaSyCqcgsj0m84BhMkoPQRPfMQd3rsoV2AnsY',
  authDomain: 'cultuur-732ec.firebaseapp.com',
  databaseURL: 'https://cultuur-732ec.firebaseio.com',
  projectId: 'cultuur-732ec',
  storageBucket: 'cultuur-732ec.appspot.com',
  messagingSenderId: '524925815102',
  appId: '1:524925815102:web:69e6b959dcd190a326846f'
};

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
