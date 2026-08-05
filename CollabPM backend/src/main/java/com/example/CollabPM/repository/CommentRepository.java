package com.example.CollabPM.repository;

import com.example.CollabPM.domain.entities.Comment;
import com.example.CollabPM.domain.entities.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment , Long> {
    List<Comment> findByTask(Task task);
    List<Comment> findByTaskOrderByCreatedAtDesc(Task task);
}
