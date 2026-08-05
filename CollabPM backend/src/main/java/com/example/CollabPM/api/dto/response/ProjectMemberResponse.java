package com.example.CollabPM.api.dto.response;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ProjectMemberResponse {
    private Long id;
    private String projectName;
    private String userName;
    private String userEmail;
    private String roleInProject;
    private LocalDateTime joinedAt;
}
