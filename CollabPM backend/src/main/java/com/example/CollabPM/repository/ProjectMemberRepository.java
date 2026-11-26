package com.example.CollabPM.repository;

import com.example.CollabPM.domain.entities.Project;
import com.example.CollabPM.domain.entities.ProjectMember;
import com.example.CollabPM.domain.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProjectMemberRepository extends JpaRepository<ProjectMember, Long> {
    List<ProjectMember> findByProject(Project project);
    Optional<ProjectMember>findByProjectAndUser(Project project ,User user);
    boolean existsByProjectAndUser(Project project , User user);
    boolean existsByProjectIdAndUserId(Long projectId, Long userId);
    void deleteByUser(User user);
}
