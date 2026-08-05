package com.example.CollabPM.api.mapper;

import com.example.CollabPM.api.dto.response.TaskResponse;
import com.example.CollabPM.domain.entities.Task;
import org.springframework.stereotype.Component;

@Component
public class TaskMapper {
    public TaskResponse toResponse(Task task) {
        TaskResponse response = new TaskResponse();
        response.setId(task.getId());
        response.setTitle(task.getTitle());
        response.setDescription(task.getDescription());
        response.setPriority(task.getPriority());
        response.setStatus(task.getStatus());
        response.setDueDate(task.getDueDate());
        response.setProjectName(task.getProject().getName());
        response.setAssignedToName(task.getAssignedTo() != null ? task.getAssignedTo().getFullName() : "Unassigned");
        response.setCreatedAt(task.getCreatedAt());
        response.setOverdue(task.isOverdue());
        return response;
    }
}
