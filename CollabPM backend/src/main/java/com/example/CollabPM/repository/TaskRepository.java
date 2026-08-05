package com.example.CollabPM.repository;

import com.example.CollabPM.domain.entities.Project;
import com.example.CollabPM.domain.entities.Task;
import com.example.CollabPM.domain.entities.User;
import com.example.CollabPM.domain.enums.TaskStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task,Long> {
    List<Task> findByProject(Project project);
    List<Task> findByAssignedTo(User user);
    List<Task> findByProjectAndStatus(Project project , TaskStatus status);
}
