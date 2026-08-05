package com.example.CollabPM.api.dto.response;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class CommentResponse {
    private long id;
    private String content;
    private String authorName;
    private String taskTitle;
    private LocalDateTime createdAt;
}
