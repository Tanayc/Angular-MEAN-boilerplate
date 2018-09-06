import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { PageEvent } from '@angular/material';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  isUserAuthenticated: boolean;
  userId: string;
  // posts = [
  //   { title: "First Post", content: "This is the first post's content" },
  //   { title: "Second Post", content: "This is the second post's content" },
  //   { title: "Third Post", content: "This is the third post's content" }
  // ];
  posts: Post[] = [];
  isLoading = false;
  private postsSub: Subscription;
  totalposts = 0;
  postsPerPage = 10;
  currentPage = 1;
  pageSizeOptions  = [1, 2 , 5 , 10 ];
  private authStatusSub: Subscription; // to monitor the logged in state of the user
  constructor(public postsService: PostsService, private authService: AuthService) {}

  ngOnInit() {
    this.isLoading = true;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
    this.postsSub = this.postsService.getPostUpdateListener()
      .subscribe((postData: {post: Post[], postCount: number} ) => {
        this.isLoading = false;
        this.totalposts = postData.postCount;
        this.posts = postData.post;
      });
      this.isUserAuthenticated = this.authService.getIsAuthenticated();
      this.userId = this.authService.getUserId();
      this.authStatusSub = this.authService.getAuthStatusListener()
      .subscribe( isUserAuthenticated => {
        this.isUserAuthenticated = isUserAuthenticated;
        this.userId = this.authService.getUserId();
      });
  }

  onDelete(postId: string) {
    this.isLoading = true;
    this.postsService.deletePost(postId).subscribe(() => {
      this.postsService.getPosts(this.postsPerPage, this.currentPage);
    });
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }

  onPageChanged(pageData: PageEvent) {
    console.log(pageData);
    this.postsPerPage = pageData.pageSize;
    this.currentPage = pageData.pageIndex + 1;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
  }
}
