import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PostfeedPage } from './postfeed.page';

const routes: Routes = [
  {
    path: '',
    component: PostfeedPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PostfeedPageRoutingModule {}
