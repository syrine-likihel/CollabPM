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

        // Project
        response.setProjectId(task.getProject().getId());
        response.setProjectName(task.getProject().getName());

        // Assigned user
        if (task.getAssignedTo() != null) {
            response.setAssignedToId(task.getAssignedTo().getId());
            response.setAssignedToName(
                    task.getAssignedTo().getFullName()
            );
        } else {
            response.setAssignedToId(null);
            response.setAssignedToName("Unassigned");
        }

        response.setCreatedAt(task.getCreatedAt());
        response.setOverdue(task.isOverdue());

        return response;
    }
}
