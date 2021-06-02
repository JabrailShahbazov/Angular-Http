import {Component, OnDestroy, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {PostModule} from './post/post.module';
import {PostService} from './post.service';
import {templateJitUrl} from '@angular/compiler';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  loadedPosts: PostModule[] = [];
  isFetching = false;
  error = null;
  private errorSub: Subscription;

  constructor(private http: HttpClient, private postService: PostService) {
  }

  ngOnInit() {
    this.errorSub = this.postService.error.subscribe(
      errorMessege => {
        this.error = errorMessege;
      }
    );
    this.isFetching = true;
    this.postService.fetchPosts()
      .subscribe(
        posts => {
          this.isFetching = false;
          this.loadedPosts = posts;
        },
        error => {
          this.isFetching = false;
          this.error = error.message;
        }
      );
  }

  onCreatePost(postData: PostModule) {
    // Send Http request
    this.postService.createAndStorePost(postData.title, postData.content);

  }

  onFetchPosts() {
    this.isFetching = true;
    this.postService.fetchPosts()
      .subscribe(
        posts => {
          this.isFetching = false;
          this.loadedPosts = posts;
        },
        error => {
          this.isFetching = false;
          this.error = error.message;
        });
  }

  onClearPosts() {
    this.postService.deletePosts()
      .subscribe(
        () => {
          console.log('Deleted Posts');
          this.loadedPosts = [];
        }
      );
  }

  onErrorHandle() {
    this.error = null;
  }

  ngOnDestroy() {
    this.errorSub.unsubscribe();
  }
}
