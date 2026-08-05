package com.example.CollabPM.application.services;

import com.example.CollabPM.api.dto.request.ProjectMemberDto;
import com.example.CollabPM.api.dto.response.ProjectMemberResponse;
import com.example.CollabPM.api.exception.ResourceNotFoundException;
import com.example.CollabPM.api.mapper.ProjectMemberMapper;
import com.example.CollabPM.application.interfaces.IProjectMemberService;
import com.example.CollabPM.domain.entities.Project;
import com.example.CollabPM.domain.entities.ProjectMember;
import com.example.CollabPM.repository.ProjectMemberRepository;
import com.example.CollabPM.repository.ProjectRepository;
import com.example.CollabPM.repository.UserRepository;
import com.example.CollabPM.domain.entities.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ProjectMemberService implements IProjectMemberService {
    private final ProjectMemberRepository projectMemberRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final ProjectMemberMapper ProjectMemberMapper;

    @Override
    public ProjectMemberResponse addMember(ProjectMemberDto dto) {
        Project project = projectRepository.findById(dto.getProjectId())
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + dto.getProjectId()));

        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + dto.getUserId()));

        if (projectMemberRepository.existsByProjectAndUser(project, user))
            throw new RuntimeException("User is already a member of this project");

        ProjectMember member = ProjectMember.builder()
                .project(project)
                .user(user)
                .roleInProject(dto.getRoleInProject())
                .build();

        return ProjectMemberMapper.toResponse(projectMemberRepository.save(member));
    }

    @Override
    public List<ProjectMemberResponse> getMembersByProject(Long projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + projectId));
        return projectMemberRepository.findByProject(project)
                .stream()
                .map(ProjectMemberMapper::toResponse)
                .toList();
    }

    @Override
    public void removeMember(Long memberId) {
        if (!projectMemberRepository.existsById(memberId))
            throw new ResourceNotFoundException("Member not found with id: " + memberId);
        projectMemberRepository.deleteById(memberId);
    }
}

