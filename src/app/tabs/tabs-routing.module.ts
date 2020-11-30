import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabsPage } from './tabs.page';
import {AuthenticationGuard} from '../services/authentication.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/tabs/home',
    pathMatch: 'full'
  },
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'home',
        loadChildren: () => import('../home/home.module').then(m => m.HomePageModule),
        canActivate: [AuthenticationGuard]
      },
      {
        path: 'profile',
        loadChildren: () => import('../profile/profile.module').then(m => m.ProfilePageModule),
        canActivate: [AuthenticationGuard]
      },
      {
        path: 'explore',
        loadChildren: () => import('../explore/explore.module').then(m => m.ExplorePageModule),
        canActivate: [AuthenticationGuard]
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
