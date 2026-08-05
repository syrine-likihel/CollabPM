package com.example.CollabPM.api.dto.response;

import com.example.CollabPM.domain.enums.ProjectStatus;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class ProjectResponse {
    private Long id;
    private String name;
    private String description;
    private LocalDate startDate;
    private LocalDate endDate;
    private ProjectStatus status;
    private String ownerName;
    private LocalDateTime createdAt;
    private double progress;
    private boolean late;

}
