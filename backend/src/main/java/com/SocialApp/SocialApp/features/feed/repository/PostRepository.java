package com.SocialApp.SocialApp.features.feed.repository;

import com.SocialApp.SocialApp.features.feed.model.Post;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long> {

    List<Post> findByAuthorIdNotOrderByCreationDateDesc(Long userId);

    List<Post> findAllByOrderByCreationDateDesc();

    List<Post> findByAuthorId(Long userId);
}
