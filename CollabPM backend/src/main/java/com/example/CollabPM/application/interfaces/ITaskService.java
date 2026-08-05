package com.example.CollabPM.application.interfaces;

import com.example.CollabPM.api.dto.request.TaskDto;
import com.example.CollabPM.api.dto.response.KanbanResponse;
import com.example.CollabPM.api.dto.response.TaskResponse;
import com.example.CollabPM.domain.enums.TaskStatus;

import java.util.List;

public interface ITaskService {
    TaskResponse createTask(TaskDto dto);
    List<TaskResponse> getAllTasks();
    List<TaskResponse> getTasksByProject(Long projectId);
    TaskResponse getTaskById(Long id);
    TaskResponse updateTask(Long id, TaskDto dto);
    TaskResponse changeStatus(Long id, TaskStatus status);
    KanbanResponse getKanbanByProject(Long projectId);
    void deleteTask(Long id);
}
