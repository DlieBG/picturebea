import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard/dashboard.component';
import { PostCreateComponent } from './components/post/post-create/post-create.component';
import { PostEditComponent } from './components/post/post-edit/post-edit.component';
import { PostComponent } from './components/post/post/post.component';

const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'post/new', component: PostCreateComponent },
  { path: 'post/:postId', component: PostComponent },
  { path: 'post/:postId/edit', component: PostEditComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
