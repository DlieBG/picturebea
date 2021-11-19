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

  constructor(private postService: PostService, private router: Router) { }

  ngOnInit(): void {
  }

  openFileDialog() {
    eval(`document.getElementById("inputfile").click();`);
  }

  fileChange(event: any) {
    this.file = event.target.files[0];

    var reader = new FileReader();
  
    reader.onload = (event) => {
      eval(`document.getElementById("preview").src = event.target.result;`);
    };
  
    reader.readAsDataURL(this.file);
  }

  submit() {
    this.postService.postPost(this.post, this.file).subscribe(
      (data) => {
        this.router.navigate(['post', data.postId]);
      },
      (err) => {

      }
    );
  }

}
