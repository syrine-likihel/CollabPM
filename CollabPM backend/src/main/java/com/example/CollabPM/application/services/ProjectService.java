package com.example.CollabPM.application.services;

import com.example.CollabPM.api.dto.request.ProjectDto;
import com.example.CollabPM.api.dto.response.ProjectResponse;
import com.example.CollabPM.api.exception.ResourceNotFoundException;
import com.example.CollabPM.api.mapper.ProjectMapper;
import com.example.CollabPM.application.interfaces.IProjectService;
import com.example.CollabPM.domain.entities.Project;
import com.example.CollabPM.domain.entities.User;
import com.example.CollabPM.repository.ProjectRepository;
import com.example.CollabPM.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProjectService implements IProjectService {

    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final ProjectMapper projectMapper;

    @Override
    public ProjectResponse createProject(ProjectDto dto, Long ownerId) {
        User owner = userRepository.findById(ownerId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + ownerId));

        Project project = projectMapper.toEntity(dto, owner);
        return projectMapper.toResponse(projectRepository.save(project));
    }

    @Override
    public List<ProjectResponse> getAllProjects() {
        return projectRepository.findAllWithOwner()
                .stream()
                .map(projectMapper::toResponse)
                .toList();
    }

    @Override
    public ProjectResponse getProjectById(Long id) {
        Project project = projectRepository.findByIdWithOwner(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + id));
        return projectMapper.toResponse(project);
    }

    @Override
    public ProjectResponse updateProject(Long id, ProjectDto dto) {
        Project project = projectRepository.findByIdWithOwner(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + id));

        projectMapper.updateEntity(project, dto);
        return projectMapper.toResponse(projectRepository.save(project));
    }

    @Override
    public void deleteProject(Long id) {
        if (!projectRepository.existsById(id)) {
            throw new ResourceNotFoundException("Project not found with id: " + id);
        }
        projectRepository.deleteById(id);
    }
}




