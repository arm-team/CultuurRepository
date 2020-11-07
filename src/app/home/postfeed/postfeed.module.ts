import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PostfeedPageRoutingModule } from './postfeed-routing.module';

import { PostfeedPage } from './postfeed.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PostfeedPageRoutingModule
  ],
  declarations: [PostfeedPage]
})
export class PostfeedPageModule {}
