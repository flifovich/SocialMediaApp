package com.SocialApp.SocialApp.features.feed.controller;

import com.SocialApp.SocialApp.features.authentication.model.User;
import com.SocialApp.SocialApp.features.feed.dto.CommentDto;
import com.SocialApp.SocialApp.features.feed.dto.PostDto;
import com.SocialApp.SocialApp.features.feed.model.Comment;
import com.SocialApp.SocialApp.features.feed.model.Post;
import com.SocialApp.SocialApp.features.feed.service.FeedService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/feed")
public class FeedController {
    private final FeedService feedService;

    public FeedController(FeedService feedService) {
        this.feedService = feedService;
    }

    @GetMapping
    public ResponseEntity<List<Post>> getFeedPosts(@RequestAttribute("authenticatedUser") User user) {
        List<Post> posts = feedService.getFeedPosts(user.getId());
        return ResponseEntity.ok(posts);
    }
    @GetMapping("/posts")
    public ResponseEntity<List<Post>> getAllPosts() {
        List<Post> posts = feedService.getAllPosts();
        return ResponseEntity.ok(posts);
    }

    @PostMapping("/posts")
    public ResponseEntity<Post> createPost(@RequestBody PostDto postDto, @RequestAttribute("authenticatedUser") User user){
        Post post = feedService.createPost(postDto, user.getId());
        return ResponseEntity.ok(post);
    }

    @GetMapping("/posts/{postId}")
    public ResponseEntity<Post> getPost(@PathVariable Long postId) {
        Post post = feedService.getPost(postId);
        return ResponseEntity.ok(post);
    }

    @GetMapping("/posts/user/{userId}")
    public ResponseEntity<List<Post>> getPostsByUserId(@PathVariable Long userId) {
        List<Post> posts = feedService.getPostsByUserId(userId);
        return ResponseEntity.ok(posts);
    }

    @DeleteMapping("/posts/{postId}")
    public ResponseEntity<Void> deletePost(@PathVariable Long postId, @RequestAttribute("authenticatedUser") User user) {
        feedService.deletePost(postId, user.getId());
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/posts/{postId}")
    public ResponseEntity<Post> editPost(@PathVariable Long postId, @RequestBody PostDto postDto, @RequestAttribute("authenticatedUser") User user){
        Post post = feedService.editPost(postId, user.getId(), postDto);
        return ResponseEntity.ok(post);
    }
    // like
    @PutMapping("/posts/{postId}/like")
    public ResponseEntity<Post> likePost(@PathVariable Long postId, @RequestAttribute("authenticatedUser") User user) {
        Post post = feedService.likePost(postId, user.getId());
        return ResponseEntity.ok(post);
    }
    // comments

    @PostMapping("/posts/{postId}/comments")
    public ResponseEntity<Comment> addComment(@PathVariable Long postId, @RequestBody CommentDto commentDto, @RequestAttribute("authenticatedUser") User user){
        Comment comment = feedService.addComment(postId, user.getId(), commentDto.getContent());
        return ResponseEntity.ok(comment);
    }

    @DeleteMapping("/comments/{commentId}")
    public ResponseEntity<Void> deleteComment(@PathVariable Long commentId, @RequestAttribute("authenticatedUser") User user){
        feedService.deleteComment(commentId, user.getId());
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/comments/{commentId}")
    public ResponseEntity<Comment> editComment(@PathVariable Long commentId, @RequestBody CommentDto commentDto, @RequestAttribute("authenticatedUser") User user){
        Comment comment = feedService.editComment(commentId, user.getId(), commentDto.getContent());
        return ResponseEntity.ok(comment);
    }
}
