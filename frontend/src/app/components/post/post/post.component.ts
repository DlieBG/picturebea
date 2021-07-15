import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthUser } from 'src/app/interfaces/auth';
import { Post, Comment } from 'src/app/interfaces/post';
import { AuthService } from 'src/app/services/auth/auth.service';
import { PostService } from 'src/app/services/post/post.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {

  post$!: Observable<Post>;
  post!: Post;

  user$!: Observable<AuthUser>;
  user!: AuthUser;

  imgUrl!: string;

  newComment: Comment = { _id: '', text: '', user: '' };

  constructor(private postService: PostService, private authService: AuthService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {   
    this.route.params.subscribe(
      (params) => {
        this.getPost(params['postId']);
      }
    );

    this.getAuthUser();
  }

  getPost(postId: string) {
    this.post$ = this.postService.getPost(postId);
    this.post$.subscribe(
      (data) => {
        this.post = data;
        this.imgUrl = `${environment.apiUrl}/post/${this.post._id}/img`;
      },
      (err) => {

      }
    );
  }

  getAuthUser() {
    this.user$ = this.authService.getAuthUser()
    this.user$.subscribe(
      (data) => {
        this.user = data;
      }
    );
  }

  edit() {
    this.router.navigate(['post', this.post._id, 'edit']);
  }

  remove() {
    this.postService.removePost(this.post._id).subscribe(
      (data) => {
        this.router.navigate(['']);
      },
      (err) => {

      }
    );
  }

  like() {
    if(this.post.likes.includes(this.user.userId))
      this.post.likes.splice(this.post.likes.indexOf(this.user.userId), 1);
    else
      this.post.likes.push(this.user.userId);
    
    this.postService.postLike(this.post._id).subscribe(
      (data) => {
        this.getPost(this.post._id);
      },
      (err) => {

      }
    );
  }

  comment() {
    this.postService.postComment(this.post._id, this.newComment).subscribe(
      (data) => {
        this.newComment.text = '';
        this.getPost(this.post._id);
      },
      (err) => {

      }
    );
  }

}
