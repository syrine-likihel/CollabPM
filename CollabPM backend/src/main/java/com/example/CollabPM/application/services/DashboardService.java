package com.example.CollabPM.application.services;

import com.example.CollabPM.api.dto.response.DashboardResponse;
import com.example.CollabPM.application.interfaces.IDashboardService;
import com.example.CollabPM.domain.entities.Project;
import com.example.CollabPM.domain.enums.ProjectStatus;
import com.example.CollabPM.domain.enums.TaskStatus;
import com.example.CollabPM.repository.ProjectMemberRepository;
import com.example.CollabPM.repository.ProjectRepository;
import com.example.CollabPM.repository.TaskRepository;
import com.example.CollabPM.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import com.example.CollabPM.domain.entities.Task;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class DashboardService implements IDashboardService {
    private final ProjectRepository projectRepository;
    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final ProjectMemberRepository projectMemberRepository;

    @Override
    public DashboardResponse getStats() {
        List<Project> projects = projectRepository.findAll();
        List<Task> tasks = taskRepository.findAll();

        return DashboardResponse.builder()
                .totalProjects(projects.size())
                .activeProjects(projects.stream()
                        .filter(p -> p.getStatus() == ProjectStatus.PLANNED.IN_PROGRESS).count())
                .completedProjects(projects.stream()
                        .filter(p -> p.getStatus() == ProjectStatus.COMPLETED).count())
                .lateProjects(projects.stream()
                        .filter(Project::isLate).count())
                .totalTasks(tasks.size())
                .todoTasks(tasks.stream()
                        .filter(t -> t.getStatus() == TaskStatus.TO_DO).count())
                .inProgressTasks(tasks.stream()
                        .filter(t -> t.getStatus() == TaskStatus.IN_PROGRESS).count())
                .doneTasks(tasks.stream()
                        .filter(t -> t.getStatus() == TaskStatus.DONE).count())
                .overdueTasks(tasks.stream()
                        .filter(Task::isOverdue).count())
                .totalUsers(userRepository.count())
                .totalMembers(projectMemberRepository.count())
                .build();
    }

}
