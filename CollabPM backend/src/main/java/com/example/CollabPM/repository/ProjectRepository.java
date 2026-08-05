package com.example.CollabPM.repository;

import com.example.CollabPM.domain.entities.Project;
import com.example.CollabPM.domain.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
    List<Project> findByOwner(User owner);

    @Query("SELECT p FROM Project p JOIN FETCH p.owner WHERE p.id = :id")
    Optional<Project> findByIdWithOwner(Long id);

    @Query("SELECT p FROM Project p JOIN FETCH p.owner")
    List<Project> findAllWithOwner();
}