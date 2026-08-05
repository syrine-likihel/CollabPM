package com.example.CollabPM.application.interfaces;

import com.example.CollabPM.api.dto.request.CommentDto;
import com.example.CollabPM.api.dto.response.CommentResponse;

import java.util.List;

public interface ICommentService {
    CommentResponse addComment(CommentDto dto);
    List<CommentResponse> getCommentsByTask(Long taskId);
    void deleteComment(Long id);
}
