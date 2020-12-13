import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProfilePage } from './profile.page';
import {AuthenticationGuard} from '../../services/authentication.guard';

const routes: Routes = [
  {
    path: '',
    component: ProfilePage
  },
  {
    path: 'edit-profile',
    loadChildren: () => import('./edit-profile/edit-profile.module').then(m => m.EditProfilePageModule)
  },
  {
    path: 'post/:postId',
    loadChildren: () => import('../post/post.module').then(m => m.PostPageModule),
    canActivate: [AuthenticationGuard]
  },
  {
    path: 'add-post',
    loadChildren: () => import('../add-post/add-post.module').then(m => m.AddPostPageModule),
    canActivate: [AuthenticationGuard]
  },
  {
    path: 'edit-post/:postId',
    loadChildren: () => import('../edit-post/edit-post.module').then(m => m.EditPostPageModule),
    canActivate: [AuthenticationGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfilePageRoutingModule {}
