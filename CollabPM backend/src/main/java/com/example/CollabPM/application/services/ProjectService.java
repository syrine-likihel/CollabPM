package com.example.CollabPM.application.services;

import com.example.CollabPM.api.dto.request.ProjectDto;
import com.example.CollabPM.api.dto.response.ProjectResponse;
import com.example.CollabPM.api.exception.ResourceNotFoundException;
import com.example.CollabPM.api.mapper.ProjectMapper;
import com.example.CollabPM.application.interfaces.IProjectService;
import com.example.CollabPM.domain.entities.Project;
import com.example.CollabPM.domain.entities.User;
import com.example.CollabPM.repository.ProjectMemberRepository;
import com.example.CollabPM.repository.ProjectRepository;
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
public class ProjectService implements IProjectService {

    private final ProjectRepository projectRepository;
    private final ProjectMemberRepository projectMemberRepository;
    private final UserRepository userRepository;
    private final ProjectMapper projectMapper;

    @Override
    //ADmin onely
    public ProjectResponse createProject(ProjectDto dto, Long ownerId) {
        User owner = userRepository.findById(ownerId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + ownerId));

        Project project = projectMapper.toEntity(dto, owner);
        return projectMapper.toResponse(projectRepository.save(project));
    }

    @Override
    //ADMIN+PM+MEMBER
    public List<ProjectResponse> getAllProjects() {
        return projectRepository.findAllWithOwner()
                .stream()
                .map(projectMapper::toResponse)
                .toList();
    }

    @Override
    //ADMIN+PM+MEMBER
    public ProjectResponse getProjectById(Long id) {

        Project project = projectRepository.findByIdWithOwner(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Project not found with id: " + id
                        ));

        return projectMapper.toResponse(project);
    }


    @Override
    //ADMIN ONELY
    public ProjectResponse updateProject(Long id, ProjectDto dto) {
        Project project = projectRepository.findByIdWithOwner(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Project not found with id: " + id
                        ));

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String currentUserEmail = authentication.getName();

        User currentUser = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Current user not found"
                        ));

        //onely admin can update project
        if (!currentUser.getRole().name().equals("ADMIN")) {

            throw new AccessDeniedException(
                    "Only ADMIN can modify projects."
            );
        }

        projectMapper.updateEntity(project, dto);

        return projectMapper.toResponse(
                projectRepository.save(project)
        );
    }

    @Override
    public void deleteProject(Long id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Project not found with id: " + id
                        ));

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String currentUserEmail = authentication.getName();

        User currentUser = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Current user not found"
                        ));

       //onely admin can delete a project
        if (!currentUser.getRole().name().equals("ADMIN")) {

            throw new AccessDeniedException(
                    "Only ADMIN can delete projects."
            );
        }

        //if project have members can't delete it
        if (!projectMemberRepository.findByProject(project).isEmpty()) {

            throw new RuntimeException(
                    "Cannot delete this project because it still has members."
            );
        }

        projectRepository.delete(project);
    }
}





