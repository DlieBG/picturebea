import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthUser } from 'src/app/interfaces/auth';
import { Post } from 'src/app/interfaces/post';
import { AuthService } from 'src/app/services/auth/auth.service';
import { PostService } from 'src/app/services/post/post.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-dashboard-post',
  templateUrl: './dashboard-post.component.html',
  styleUrls: ['./dashboard-post.component.scss']
})
export class DashboardPostComponent implements OnInit {

  @Input() post!: Post;
  @Input() user!: AuthUser;

  imgUrl!: string;

  constructor(private postService: PostService, private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.imgUrl = `${environment.apiUrl}/post/${this.post._id}/img`;
  }

  getPost(postId: string) {
    this.postService.getPost(postId).subscribe(
      (data) => {
        this.post = data;
      },
      (err) => {

      }
    );
  }

  openPost() {
    this.router.navigate(['post', this.post._id]);
  }

  like() {
    if(this.post.likes.includes(this.user.userId))
      this.post.likes.splice(this.post.likes.indexOf(this.user.userId), 1);
    else
      this.post.likes.push(this.user.userId);

    this.postService.postLike(this.post._id).subscribe(
      (data) => {
        this.getPost(this.post._id);
      }, (err) => {

      }
    );
  }

}
