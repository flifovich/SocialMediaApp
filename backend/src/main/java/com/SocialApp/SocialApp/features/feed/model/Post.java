package com.SocialApp.SocialApp.features.feed.model;

import com.SocialApp.SocialApp.features.authentication.model.User;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotEmpty;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Entity(name = "posts")
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotEmpty
    private String content;
    private String picture;

    @ManyToOne
    @JoinColumn(name = "author_id", nullable = false)
    private User author;

    @CreationTimestamp
    private LocalDateTime creationDate;

    private LocalDateTime updatedDate;

    @OneToMany (
            mappedBy = "post",
            cascade = CascadeType.ALL, orphanRemoval = true
    )
    private List<Comment> comments;

    @ManyToMany
    @JoinTable(
            name = "posts_likes",
            joinColumns = @JoinColumn(name = "post_id"),
            inverseJoinColumns = @JoinColumn (name = "user_id")
    )
    private Set<User> likes;

    @PreUpdate
    public void preUpdate(){
        this.updatedDate = LocalDateTime.now();
    }

    public Post(){

    }

    public Post(String content, User author) {
        this.content = content;
        this.author = author;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getId() {
        return id;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getPicture() {
        return picture;
    }

    public void setPicture(String picture) {
        this.picture = picture;
    }

    public User getAuthor() {
        return author;
    }

    public void setAuthor(User author) {
        this.author = author;
    }

    public LocalDateTime getCreationDate() {
        return creationDate;
    }

    public void setCreationDate(LocalDateTime creationDate) {
        this.creationDate = creationDate;
    }

    public LocalDateTime getUpdatedDate() {
        return updatedDate;
    }

    public void setUpdatedDate(LocalDateTime updatedDate) {
        this.updatedDate = updatedDate;
    }

    public Set<User> getLikes() {
        return likes;
    }

    public void setLikes(Set<User> likes) {
        this.likes = likes;
    }
}
