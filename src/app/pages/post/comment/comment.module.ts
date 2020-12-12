import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CommentPageRoutingModule } from './comment-routing.module';

import { CommentPage } from './comment.page';

// Time Ago Library
// pastikan sebelumnya telah menjalankan npm install time-ago-pipe --save
import {TimeAgoPipe} from 'time-ago-pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CommentPageRoutingModule
  ],
  declarations: [CommentPage, TimeAgoPipe]
})
export class CommentPageModule {}
