import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PostPage } from './post.page';

const routes: Routes = [
  {
    path: '',
    component: PostPage
  },
  {
    path: 'comment/:postId',
    loadChildren: () => import('./comment/comment.module').then( m => m.CommentPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PostPageRoutingModule {}
