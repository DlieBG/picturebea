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

  loading: boolean = false;

  constructor(private postService: PostService, private authService: AuthService) { }

  ngOnInit(): void {
    this.getPosts();
    this.getAuthUser();
  }

  getPosts() {
    this.loading = true;

    this.posts$ = this.postService.getPosts();
    this.posts$.subscribe(
      (data) => {
        this.posts = data;
        this.loading = false;
      },
      (err) => {
        this.loading = false;
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
