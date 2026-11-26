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
import com.example.CollabPM.domain.enums.Role;
import com.example.CollabPM.domain.enums.TaskStatus;
import com.example.CollabPM.repository.ProjectMemberRepository;
import com.example.CollabPM.repository.ProjectRepository;
import com.example.CollabPM.repository.TaskRepository;
import com.example.CollabPM.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class TaskService implements ITaskService {

    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;
    private final ProjectMemberRepository projectMemberRepository;
    private final UserRepository userRepository;
    private final TaskMapper taskMapper;

    @Override
    public TaskResponse createTask(TaskDto dto) {
        Project project = projectRepository.findById(dto.getProjectId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Project not found with id: "
                                        + dto.getProjectId()
                        ));

        User currentUser = getCurrentUser();

        Role role = currentUser.getRole();
        // Check who can create a task
        if (role == Role.ADMIN) {

            // ADMIN can create any task

        } else if (role == Role.PROJECT_MANAGER) {

            boolean isProjectMember =
                    projectMemberRepository.existsByProjectIdAndUserId(
                            project.getId(),
                            currentUser.getId()
                    );

            if (!isProjectMember) {
                throw new AccessDeniedException(
                        "You are not a member of this project."
                );
            }

        } else {

            // MEMBER cannot create tasks
            throw new AccessDeniedException(
                    "You are not allowed to create tasks."
            );
        }
        // Assigned user
        User assignedTo = null;

        if (dto.getAssignedToId() != null) {

            assignedTo = userRepository.findById(
                    dto.getAssignedToId()
            ).orElseThrow(() ->
                    new ResourceNotFoundException(
                            "User not found with id: "
                                    + dto.getAssignedToId()
                    ));


            // Assigned user must be a member of this project
            boolean assignedUserIsMember =
                    projectMemberRepository.existsByProjectIdAndUserId(
                            project.getId(),
                            assignedTo.getId()
                    );

            if (!assignedUserIsMember) {
                throw new AccessDeniedException(
                        "The assigned user must be a member of this project."
                );
            }
        }
        // Create task
        Task task = Task.builder()
                .title(dto.getTitle())
                .description(dto.getDescription())
                .priority(dto.getPriority())
                .status(
                        dto.getStatus() != null
                                ? dto.getStatus()
                                : TaskStatus.TO_DO
                )
                .dueDate(dto.getDueDate())
                .project(project)
                .assignedTo(assignedTo)
                .build();


        return taskMapper.toResponse(
                taskRepository.save(task)
        );
    }

    @Override
    public List<TaskResponse> getAllTasks() {

        User currentUser = getCurrentUser();
        Role role = currentUser.getRole();
        List<Task> tasks;
        if (role == Role.ADMIN) {

            tasks = taskRepository.findAll();

        } else if (role == Role.PROJECT_MANAGER) {

            // PM can consult all tasks
            tasks = taskRepository.findAll();

        } else if (role == Role.MEMBER) {

            // MEMBER can consult all tasks
            tasks = taskRepository.findAll();

        } else {

            throw new AccessDeniedException(
                    "You are not allowed to view tasks."
            );
        }


        return tasks.stream()
                .map(taskMapper::toResponse)
                .toList();
    }
    @Override
    public List<TaskResponse> getTasksByProject(Long projectId) {

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Project not found with id: "
                                        + projectId
                        ));

        User currentUser = getCurrentUser();

        Role role = currentUser.getRole();


        // ADMIN can access every project
        if (role == Role.ADMIN) {

            // allowed

        }

        // PM can consult tasks
        else if (role == Role.PROJECT_MANAGER) {

            // PM can view tasks of all projects

        }

        // MEMBER can consult tasks
        else if (role == Role.MEMBER) {

            // MEMBER can view tasks of all projects

        }

        else {

            throw new AccessDeniedException(
                    "You are not allowed to view these tasks."
            );
        }


        return taskRepository.findByProject(project)
                .stream()
                .map(taskMapper::toResponse)
                .toList();
    }
    @Override
    public TaskResponse getTaskById(Long id) {

        Task task = taskRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Task not found with id: "
                                        + id
                        ));

        User currentUser = getCurrentUser();

        Role role = currentUser.getRole();


        if (role == Role.ADMIN) {

            // allowed

        } else if (role == Role.PROJECT_MANAGER) {

            // PM can view all tasks

        } else if (role == Role.MEMBER) {

            // MEMBER can view all tasks

        } else {

            throw new AccessDeniedException(
                    "You are not allowed to view this task."
            );
        }


        return taskMapper.toResponse(task);
    }
    @Override
    public TaskResponse updateTask(Long id, TaskDto dto) {

        // Find existing task
        Task task = taskRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Task not found with id: "
                                        + id
                        ));

        User currentUser = getCurrentUser();

        Role role = currentUser.getRole();
        // Check permission to update the task

        if (role == Role.ADMIN) {

            // ADMIN can update any task

        } else if (role == Role.PROJECT_MANAGER) {

            boolean isProjectMember =
                    projectMemberRepository.existsByProjectIdAndUserId(
                            task.getProject().getId(),
                            currentUser.getId()
                    );

            if (!isProjectMember) {
                throw new AccessDeniedException(
                        "You are not a member of this project."
                );
            }

        } else if (role == Role.MEMBER) {

            throw new AccessDeniedException(
                    "Members are not allowed to update tasks."
            );

        } else {

            throw new AccessDeniedException(
                    "You are not allowed to update tasks."
            );
        }

        Project project = projectRepository.findById(
                dto.getProjectId()
        ).orElseThrow(() ->
                new ResourceNotFoundException(
                        "Project not found with id: "
                                + dto.getProjectId()
                ));
        // PM must be member of the new project
        if (role == Role.PROJECT_MANAGER) {

            boolean isProjectMember =
                    projectMemberRepository.existsByProjectIdAndUserId(
                            project.getId(),
                            currentUser.getId()
                    );

            if (!isProjectMember) {
                throw new AccessDeniedException(
                        "You are not a member of this project."
                );
            }
        }
        // Assigned user

        User assignedTo = null;

        if (dto.getAssignedToId() != null) {

            assignedTo = userRepository.findById(
                    dto.getAssignedToId()
            ).orElseThrow(() ->
                    new ResourceNotFoundException(
                            "User not found with id: "
                                    + dto.getAssignedToId()
                    ));


            // Assigned user must be member of the project
            boolean assignedUserIsMember =
                    projectMemberRepository.existsByProjectIdAndUserId(
                            project.getId(),
                            assignedTo.getId()
                    );

            if (!assignedUserIsMember) {
                throw new AccessDeniedException(
                        "The assigned user must be a member of this project."
                );
            }
        }
        //Update task fields
        task.setTitle(dto.getTitle());
        task.setDescription(dto.getDescription());
        task.setPriority(dto.getPriority());
        task.setDueDate(dto.getDueDate());
        task.setProject(project);
        task.setAssignedTo(assignedTo);


        // Update status only if provided
        if (dto.getStatus() != null) {
            task.setStatus(dto.getStatus());
        }
        Task savedTask = taskRepository.save(task);
        return taskMapper.toResponse(savedTask);
    }

    @Override
    public TaskResponse changeStatus(
            Long id,
            TaskStatus status
    ) {

        Task task = taskRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Task not found with id: "
                                        + id
                        ));

        User currentUser = getCurrentUser();
        Role role = currentUser.getRole();

        if (role == Role.ADMIN) {

            // ADMIN can change any task status
        }
        else if (role == Role.PROJECT_MANAGER) {

            boolean isProjectMember =
                    projectMemberRepository.existsByProjectIdAndUserId(
                            task.getProject().getId(),
                            currentUser.getId()
                    );

            if (!isProjectMember) {
                throw new AccessDeniedException(
                        "You are not allowed to change the status of this task."
                );
            }
        }
        else if (role == Role.MEMBER) {

            // Member can change status ONLY
            // if the task is assigned to him
            if (task.getAssignedTo() == null ||
                            !task.getAssignedTo()
                                    .getId()
                                    .equals(currentUser.getId())
            ) {

                throw new AccessDeniedException(
                        "You are not allowed to change the status of this task."
                );
            }
        }

        // Unknown role
        else {

            throw new AccessDeniedException(
                    "You are not allowed to change task status."
            );
        }
        task.setStatus(status);
        Task savedTask = taskRepository.save(task);
        return taskMapper.toResponse(savedTask);
    }


    @Override
    public void deleteTask(Long id) {

        Task task = taskRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Task not found with id: " + id
                        ));

        User currentUser = getCurrentUser();

        Role role = currentUser.getRole();


        // Only ADMIN can delete tasks
        if (role != Role.ADMIN) {

            throw new AccessDeniedException(
                    "Only administrators can delete tasks."
            );
        }
        taskRepository.delete(task);
    }



    @Override
    public KanbanResponse getKanbanByProject(
            Long projectId ){
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Project not found with id: "
                                        + projectId
                        ));


        List<Task> tasks = taskRepository.findByProject(project);


        return KanbanResponse.builder()

                .todo(tasks.stream()
                                .filter(
                                        task -> task.getStatus() == TaskStatus.TO_DO
                                )
                                .map(taskMapper::toResponse)
                                .toList()
                )

                .inProgress(tasks.stream()
                                .filter(
                                        task -> task.getStatus() == TaskStatus.IN_PROGRESS)
                                .map(taskMapper::toResponse)
                                .toList()
                )

                .done(tasks.stream()
                                .filter(task -> task.getStatus()== TaskStatus.DONE)
                                .map(taskMapper::toResponse)
                                .toList()
                )

                .build();
    }

    private User getCurrentUser() {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();


        String currentUserEmail =
                authentication.getName();


        return userRepository
                .findByEmail(currentUserEmail)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Current user not found"
                        ));
    }
}