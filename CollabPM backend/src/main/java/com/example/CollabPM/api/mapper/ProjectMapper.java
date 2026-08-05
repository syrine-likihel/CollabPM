package com.example.CollabPM.api.mapper;

import com.example.CollabPM.api.dto.request.ProjectDto;
import com.example.CollabPM.api.dto.response.ProjectResponse;
import com.example.CollabPM.domain.entities.Project;
import com.example.CollabPM.domain.entities.User;
import com.example.CollabPM.domain.enums.ProjectStatus;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@Transactional
public class ProjectMapper {

    public Project toEntity(ProjectDto dto, User owner) {
        return Project.builder()
                .name(dto.getName())
                .description(dto.getDescription())
                .startDate(dto.getStartDate())
                .endDate(dto.getEndDate())
                .status(dto.getStatus() != null ? dto.getStatus() : ProjectStatus.PLANNED)
                .owner(owner)
                .build();
    }


    public void updateEntity(Project project, ProjectDto dto) {
        project.setName(dto.getName());
        project.setDescription(dto.getDescription());
        project.setStartDate(dto.getStartDate());
        project.setEndDate(dto.getEndDate());
        if (dto.getStatus() != null) project.setStatus(dto.getStatus());
    }

    public ProjectResponse toResponse(Project project) {
        ProjectResponse response = new ProjectResponse();
        response.setId(project.getId());
        response.setName(project.getName());
        response.setDescription(project.getDescription());
        response.setStartDate(project.getStartDate());
        response.setEndDate(project.getEndDate());
        response.setStatus(project.getStatus());
        response.setOwnerName(project.getOwner().getFullName());
        response.setCreatedAt(project.getCreatedAt());
        response.setProgress(project.calculateProgress());
        response.setLate(project.isLate());
        return response;

    }

}