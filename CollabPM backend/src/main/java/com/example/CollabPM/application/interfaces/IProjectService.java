package com.example.CollabPM.application.interfaces;

import com.example.CollabPM.api.dto.request.ProjectDto;
import com.example.CollabPM.api.dto.response.ProjectResponse;

import java.util.List;

public interface IProjectService {
    ProjectResponse createProject(ProjectDto dto, Long ownerId);
    List<ProjectResponse>getAllProjects();
    ProjectResponse getProjectById(Long id);
    ProjectResponse updateProject(Long id, ProjectDto dto);
    void deleteProject(Long id);
}


