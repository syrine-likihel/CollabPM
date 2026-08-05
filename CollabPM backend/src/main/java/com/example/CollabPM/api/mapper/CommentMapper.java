package com.example.CollabPM.api.mapper;
import com.example.CollabPM.domain.entities.Comment;
import com.example.CollabPM.api.dto.response.CommentResponse;
import lombok.Getter;
import org.springframework.stereotype.Component;

@Component

public class CommentMapper {
    public CommentResponse toResponse(Comment comment){
        CommentResponse response = new CommentResponse();
        response.setId(comment.getId());
        response.setContent(comment.getContent());
        response.setAuthorName(comment.getAuthor().getFullName());
        response.setTaskTitle(comment.getTask().getTitle());
        response.setCreatedAt(comment.getCreatedAt());
        return response;
    }
}
