package com.SocialApp.SocialApp.features.feed.repository;

import com.SocialApp.SocialApp.features.feed.model.Comment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CommentRepository extends JpaRepository<Comment, Long> {
}
