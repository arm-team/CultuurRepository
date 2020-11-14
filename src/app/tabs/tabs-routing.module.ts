import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabsPage } from './tabs.page';
import {AuthenticationGuard} from '../services/authentication.guard';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'home',
        children: [
          {
            path: '',
            loadChildren: () =>
                import('../home/home.module').then(m => m.HomePageModule),
            canActivate: [AuthenticationGuard]
          }
        ]
      },
      {
        path: 'profile',
        children: [
          {
            path: '',
            loadChildren: () =>
                import('../profile/profile.module').then(m => m.ProfilePageModule),
            canActivate: [AuthenticationGuard]
          }
        ]
      },
      {
        path: 'explore',
        children: [
          {
            path: '',
            loadChildren: () =>
                import('../explore/explore.module').then(m => m.ExplorePageModule),
            canActivate: [AuthenticationGuard]
          }
        ]
      },
      {
        path: 'post',
        children: [
          {
            path: '',
            loadChildren: () =>
                import('../post/post.module').then(m => m.PostPageModule),
            canActivate: [AuthenticationGuard]
          }
        ]
      },
      {
        path: 'add-post',
        children: [
          {
            path: '',
            loadChildren: () =>
                import('../add-post/add-post.module').then(m => m.AddPostPageModule),
            canActivate: [AuthenticationGuard]
          }
        ]
      },
      {
        path: 'edit-post',
        children: [
          {
            path: '',
            loadChildren: () =>
                import('../edit-post/edit-post.module').then(m => m.EditPostPageModule),
            canActivate: [AuthenticationGuard]
          }
        ]
      },
      {
        path: '',
        redirectTo: '/tabs/home',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/home',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
