import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddpostPage } from './addpost.page';

const routes: Routes = [
  {
    path: '',
    component: AddpostPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddpostPageRoutingModule {}
