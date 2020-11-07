import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './home.page';

const routes: Routes = [
  {
    path: '',
    component: HomePage,
  },
  {
    path: 'postfeed',
    loadChildren: () => import('./postfeed/postfeed.module').then( m => m.PostfeedPageModule)
  },
  {
    path: 'addpost',
    loadChildren: () => import('./addpost/addpost.module').then( m => m.AddpostPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomePageRoutingModule {}
