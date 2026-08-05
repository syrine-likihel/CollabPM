package com.example.CollabPM.api.dto.response;

import com.example.CollabPM.domain.enums.Priority;
import com.example.CollabPM.domain.enums.TaskStatus;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class TaskResponse {
    private Long id;
    private String title;
    private String description;
    private Priority priority;
    private TaskStatus status;
    private LocalDate dueDate;
    private String projectName;
    private String assignedToName;
    private LocalDateTime createdAt;
    private boolean overdue;
}
