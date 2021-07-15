import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthUser } from 'src/app/interfaces/auth';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private httpClient: HttpClient) { }

  public getAuthUser(): Observable<AuthUser> {
    return this.httpClient.get<AuthUser>(`${environment.apiUrl}/user`);
  }

  public getUserId(): Observable<AuthUser> {
    let ls = JSON.parse(localStorage.getItem('userId') || 'null') as AuthUser;

    if(ls)
      return of(ls);

    return this.getAuthUser().pipe(
      tap(
        (data) => {
          localStorage.setItem('userId', JSON.stringify(data));
        }
    ));
  }
}

