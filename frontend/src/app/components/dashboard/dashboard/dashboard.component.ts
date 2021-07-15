import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthUser } from 'src/app/interfaces/auth';
import { Post } from 'src/app/interfaces/post';
import { AuthService } from 'src/app/services/auth/auth.service';
import { PostService } from 'src/app/services/post/post.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  posts$!: Observable<Post[]>;
  posts!: Post[];

  user$!: Observable<AuthUser>;
  user!: AuthUser;

  constructor(private postService: PostService, private authService: AuthService) { }

  ngOnInit(): void {
    this.getPosts();
    this.getAuthUser();
  }

  getPosts() {
    this.posts$ = this.postService.getPosts();
    this.posts$.subscribe(
      (data) => {
        this.posts = data;
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

}
