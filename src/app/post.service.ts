import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {PostModule} from './post/post.module';
import {catchError, map} from 'rxjs/operators';
import {Subject, Subscription, throwError} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  error = new Subject<string>();

  constructor(private http: HttpClient) {
  }

  createAndStorePost(title: string, content: string) {
    const postData: PostModule = {title, content};
    this.http
      .post<{ name: string }>(
        'https://ng-comlete-guide-c94a2-default-rtdb.firebaseio.com/posts.json',
        postData
      )
      .subscribe(responseData => {
        console.log(responseData);
      }, error => {
        this.error.next(error.message);
      });
  }

  fetchPosts() {

    return this.http.get<{ [key: string]: PostModule }>(
      'https://ng-comlete-guide-c94a2-default-rtdb.firebaseio.com/posts.json',
      {
        headers: new HttpHeaders(
          {
            'custom-header': 'Hello'
          }
        )
      })
      .pipe(map(responseData => {
          const postsArray: PostModule[] = [];
          for (const key in responseData) {
            if (responseData.hasOwnProperty(key)) {
              postsArray.push({...responseData[key], id: key});
            }
          }
          return postsArray;
        }),
        catchError(errorRes => {
          return throwError(errorRes);
        })
      )
      ;
  }

  deletePosts() {
    return this.http.delete('https://ng-comlete-guide-c94a2-default-rtdb.firebaseio.com/posts.json');
  }
}
