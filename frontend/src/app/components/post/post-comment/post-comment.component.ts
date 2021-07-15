import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthUser } from 'src/app/interfaces/auth';
import { AuthService } from 'src/app/services/auth/auth.service';
import { PostService } from 'src/app/services/post/post.service';
import { Comment, Post } from '../../../interfaces/post';

@Component({
  selector: 'app-post-comment',
  templateUrl: './post-comment.component.html',
  styleUrls: ['./post-comment.component.scss']
})
export class PostCommentComponent implements OnInit {

  @Input() post!: Post;
  @Input() comment!: Comment;

  user$!: Observable<AuthUser>;
  user!: AuthUser;

  deleted!: boolean;

  constructor(private postService: PostService, private authService: AuthService) { }

  ngOnInit(): void {
    this.getAuthUser();
  }

  getAuthUser() {
    this.user$ = this.authService.getAuthUser()
    this.user$.subscribe(
      (data) => {
        this.user = data;
      }
    );
  }

  remove() {
    this.postService.removeComment(this.post._id, this.comment._id).subscribe(
      (data) => {
        this.deleted = true;
      },
      (err) => {

      }
    )
  }

}
