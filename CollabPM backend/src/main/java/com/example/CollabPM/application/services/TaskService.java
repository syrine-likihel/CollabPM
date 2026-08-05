package com.example.CollabPM.application.services;

import com.example.CollabPM.api.dto.request.TaskDto;
import com.example.CollabPM.api.dto.response.KanbanResponse;
import com.example.CollabPM.api.dto.response.TaskResponse;
import com.example.CollabPM.api.exception.ResourceNotFoundException;
import com.example.CollabPM.api.mapper.TaskMapper;
import com.example.CollabPM.application.interfaces.ITaskService;
import com.example.CollabPM.domain.entities.Project;
import com.example.CollabPM.domain.entities.Task;
import com.example.CollabPM.domain.entities.User;
import com.example.CollabPM.domain.enums.TaskStatus;
import com.example.CollabPM.repository.ProjectRepository;
import com.example.CollabPM.repository.TaskRepository;
import com.example.CollabPM.repository.UserRepository;
import com.example.CollabPM.api.dto.response.KanbanResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class TaskService implements ITaskService {
    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final TaskMapper taskMapper;

    @Override
    public TaskResponse createTask(TaskDto dto) {
        Project project = projectRepository.findById(dto.getProjectId())
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + dto.getProjectId()));

        User assignedTo = null;
        if (dto.getAssignedToId() != null) {
            assignedTo = userRepository.findById(dto.getAssignedToId())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + dto.getAssignedToId()));
        }

        Task task = Task.builder()
                .title(dto.getTitle())
                .description(dto.getDescription())
                .priority(dto.getPriority())
                .status(dto.getStatus() != null ? dto.getStatus() : TaskStatus.TO_DO)
                .dueDate(dto.getDueDate())
                .project(project)
                .assignedTo(assignedTo)
                .build();

        return taskMapper.toResponse(taskRepository.save(task));
    }

    @Override
    public List<TaskResponse> getAllTasks() {
        return taskRepository.findAll()
                .stream()
                .map(taskMapper::toResponse)
                .toList();
    }

    @Override
    public List<TaskResponse> getTasksByProject(Long projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + projectId));
        return taskRepository.findByProject(project)
                .stream()
                .map(taskMapper::toResponse)
                .toList();
    }

    @Override
    public TaskResponse getTaskById(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));
        return taskMapper.toResponse(task);
    }

    @Override
    public TaskResponse updateTask(Long id, TaskDto dto) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));

        Project project = projectRepository.findById(dto.getProjectId())
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + dto.getProjectId()));

        User assignedTo = null;
        if (dto.getAssignedToId() != null) {
            assignedTo = userRepository.findById(dto.getAssignedToId())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + dto.getAssignedToId()));
        }

        task.setTitle(dto.getTitle());
        task.setDescription(dto.getDescription());
        task.setPriority(dto.getPriority());
        task.setDueDate(dto.getDueDate());
        task.setProject(project);
        task.setAssignedTo(assignedTo);
        if (dto.getStatus() != null) task.setStatus(dto.getStatus());

        return taskMapper.toResponse(taskRepository.save(task));
    }

    @Override
    public TaskResponse changeStatus(Long id, TaskStatus status) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));
        task.setStatus(status);
        return taskMapper.toResponse(taskRepository.save(task));
    }

    @Override
    public void deleteTask(Long id) {
        if (!taskRepository.existsById(id))
            throw new ResourceNotFoundException("Task not found with id: " + id);
        taskRepository.deleteById(id);
    }

    @Override
    public KanbanResponse getKanbanByProject(Long projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + projectId));

        List<Task> tasks = taskRepository.findByProject(project);

        return KanbanResponse.builder()
                .todo(tasks.stream()
                        .filter(t -> t.getStatus() == TaskStatus.TO_DO)
                        .map(taskMapper::toResponse)
                        .toList())
                .inProgress(tasks.stream()
                        .filter(t -> t.getStatus() == TaskStatus.IN_PROGRESS)
                        .map(taskMapper::toResponse)
                        .toList())
                .done(tasks.stream()
                        .filter(t -> t.getStatus() == TaskStatus.DONE)
                        .map(taskMapper::toResponse)
                        .toList())
                .build();
    }
}
