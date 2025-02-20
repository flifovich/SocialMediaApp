package com.SocialApp.SocialApp.features.feed.service;

import com.SocialApp.SocialApp.features.authentication.model.User;
import com.SocialApp.SocialApp.features.authentication.repository.AuthenticationUserRepository;
import com.SocialApp.SocialApp.features.feed.dto.PostDto;
import com.SocialApp.SocialApp.features.feed.model.Comment;
import com.SocialApp.SocialApp.features.feed.model.Post;
import com.SocialApp.SocialApp.features.feed.repository.CommentRepository;
import com.SocialApp.SocialApp.features.feed.repository.PostRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;

@Service
public class FeedService {
    private final PostRepository postRepository;
    private final AuthenticationUserRepository userRepository;
    private final CommentRepository commentRepository;

    public FeedService(PostRepository postRepository, AuthenticationUserRepository userRepository, CommentRepository commentRepository) {
        this.postRepository = postRepository;
        this.userRepository = userRepository;
        this.commentRepository = commentRepository;
    }

    public Post createPost (PostDto postDto, Long authorId){
        User author = userRepository.findById(authorId).orElseThrow(() -> new IllegalArgumentException("User not found"));
        Post post = new Post(postDto.getContent(), author);
        post.setPicture(postDto.getPicture());

        return postRepository.save(post);
    }

    public Post editPost(Long postId, Long userId, PostDto postDto) {
        Post post = postRepository.findById(postId).orElseThrow(() -> new IllegalArgumentException("Post not found"));
        User user = userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("User not found"));

        if(!post.getAuthor().equals(user)){
            throw new IllegalArgumentException("User is not the author of the post");
        }

        post.setContent(postDto.getContent());
        post.setPicture(postDto.getPicture());

        return postRepository.save(post);
    }

    public List<Post> getFeedPosts(Long userId) {
        return postRepository.findByAuthorIdNotOrderByCreationDateDesc(userId);
    }

    public List<Post> getAllPosts() {
        return postRepository.findAllByOrderByCreationDateDesc();
    }

    public Post getPost(Long postId) {
        return postRepository.findById(postId).orElseThrow(() -> new IllegalArgumentException("Post not found"));
    }

    public List<Post> getPostsByUserId(Long userId) {
        return postRepository.findByAuthorId(userId);
    }

    public void deletePost(Long postId, Long userId) {
        Post post = postRepository.findById(postId).orElseThrow(() -> new IllegalArgumentException("Post not found"));
        User user = userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("User not found"));
        if(!post.getAuthor().equals(user)){
            throw new IllegalArgumentException("User is not the author of the post");
        }
        postRepository.delete(post);
    }

    public Post likePost(Long postId, Long userId) {
        Post post = postRepository.findById(postId).orElseThrow(() -> new IllegalArgumentException("Post not found"));
        User user = userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("User not found"));

        if(post.getLikes().contains(user)) {
            post.getLikes().remove(user);
        }else {
            post.getLikes().add(user);
        }

        return postRepository.save(post);
    }

    // comments

    public Comment addComment(Long postId, Long userId, String content){
        Post post = postRepository.findById(postId).orElseThrow(() -> new IllegalArgumentException("Post not found"));
        User user = userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("User not found"));

        Comment comment = new Comment(post, user, content);
        return commentRepository.save(comment);
    }

    public Comment editComment(Long commentId, Long userId, String newContent){
        Comment comment = commentRepository.findById(commentId).orElseThrow(() -> new IllegalArgumentException("Comment not found"));
        User user = userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("User not found"));
        if(!comment.getAuthor().equals(user)){
            throw new IllegalArgumentException("User is not the author of the comment");
        }
        comment.setContent(newContent);
        return commentRepository.save(comment);
    }

    public void deleteComment(Long commentId, Long userId){
        Comment comment = commentRepository.findById(commentId).orElseThrow(() -> new IllegalArgumentException("Comment not found"));
        User user = userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("User not found"));
        if(!comment.getAuthor().equals(user)){
            throw new IllegalArgumentException("User is not the author of the comment");
        }
        commentRepository.delete(comment);
    }

    public List<Comment> getPostComments(Long postId) {
        Post post = postRepository.findById(postId).orElseThrow(() -> new IllegalArgumentException("Post not found"));
        return post.getComments();
    }

    public Set<User> getPostLikes(Long postId) {
        Post post = postRepository.findById(postId).orElseThrow(() -> new IllegalArgumentException("Post Not found"));
        return post.getLikes();
    }
}
