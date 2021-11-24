import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AI, Post } from 'src/app/interfaces/post';
import { PostService } from 'src/app/services/post/post.service';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.scss']
})
export class PostCreateComponent implements OnInit {

  post: Post = {
    _id: '',
    user: '',
    caption: '',
    ai: {} as AI,
    likes: [],
    comments: []
  };

  file!: File;

  imageChangeEvent!: Event;

  loading: boolean = false;

  constructor(private postService: PostService, private router: Router) { }

  ngOnInit(): void {
  }

  openFileDialog() {
    eval(`document.getElementById("inputfile").click();`);
  }

  fileChange(event: any) {
    this.imageChangeEvent = event;
  }

  imageCropped(event: any) {
    fetch(event.base64)
      .then(res => res.blob())
      .then(blob => {
        this.file = new File([blob], 'picturebai.png', { type: 'image/png' });
      });
  }

  submit() {
    this.loading = true;

    this.postService.postPost(this.post, this.file).subscribe(
      (data) => {
        this.router.navigate(['post', data.postId]);
      },
      (err) => {
        this.loading = false;
      }
    );
  }

}
