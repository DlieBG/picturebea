import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Comment, Post } from 'src/app/interfaces/post';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(private httpClient: HttpClient) { }

  public getPosts(): Observable<Post[]> {
    return this.httpClient.get<Post[]>(`${environment.apiUrl}/post/all`);
  }

  public getPost(postId: string): Observable<Post> {
    return this.httpClient.get<Post>(`${environment.apiUrl}/post/${postId}`);
  }

  public postPost(post: Post, picture: File): Observable<any> {
    let formData = new FormData();
    formData.append('picture', picture, picture.name);
    formData.append('caption', post.caption);

    let headers = new HttpHeaders();
    headers.append('Conent-Type', 'multipart/form-data');


    return this.httpClient.post<any>(`${environment.apiUrl}/post`, formData, { headers: headers });
  }

  public removePost(postId: string): Observable<any> {
    return this.httpClient.delete(`${environment.apiUrl}/post/${postId}`, {});
  }

  public postLike(postId: string): Observable<any> {
    return this.httpClient.post<any>(`${environment.apiUrl}/post/${postId}/like`, {});
  }

  public postComment(postId: string, comment: Comment): Observable<any> {
    return this.httpClient.post<any>(`${environment.apiUrl}/post/${postId}/comment`, comment);
  }

  public removeComment(postId: string, commentId: string): Observable<any> {
    return this.httpClient.delete<any>(`${environment.apiUrl}/post/${postId}/comment/${commentId}`, {});
  }
  
}
