import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewPage } from './view.page';
import {AuthenticationGuard} from '../../../services/authentication.guard';

const routes: Routes = [
  {
    path: '',
    component: ViewPage
  },
  {
    path: 'post/:spotId',
    loadChildren: () => import('../../post/post.module').then(m => m.PostPageModule),
    canActivate: [AuthenticationGuard]
  },
  {
    path: 'add-post',
    loadChildren: () => import('../../add-post/add-post.module').then(m => m.AddPostPageModule),
    canActivate: [AuthenticationGuard]
  },
  {
    path: 'edit-post',
    loadChildren: () => import('../../edit-post/edit-post.module').then(m => m.EditPostPageModule),
    canActivate: [AuthenticationGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewPageRoutingModule {}
