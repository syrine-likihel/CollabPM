package com.example.CollabPM.repository;

import com.example.CollabPM.domain.entities.Project;
import com.example.CollabPM.domain.entities.Task;
import com.example.CollabPM.domain.entities.User;
import com.example.CollabPM.domain.enums.TaskStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByProject(Project project);

    Optional<Task> findById(Long id);

    List<Task> findByAssignedTo(User user);

    List<Task> findByProjectAndStatus(
            Project project,
            TaskStatus status
    );
    List<Task> findByProjectOwner(User owner);


    @Modifying
    @Query("""
           UPDATE Task t
           SET t.assignedTo = null
           WHERE t.assignedTo = :user
           """)
    void clearAssignedTo(@Param("user") User user);
}