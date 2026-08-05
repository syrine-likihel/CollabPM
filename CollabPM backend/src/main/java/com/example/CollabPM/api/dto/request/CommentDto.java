package com.example.CollabPM.api.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CommentDto {
    @NotBlank(message = "content is required")
    private  String content;

    @NotNull(message = "task ID is required")
    private long taskId;

    @NotNull(message = "author Id is required")
    private long authorId;

}
