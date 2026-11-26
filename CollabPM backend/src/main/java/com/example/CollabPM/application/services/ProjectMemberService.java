package com.example.CollabPM.application.services;

import com.example.CollabPM.api.dto.request.ProjectMemberDto;
import com.example.CollabPM.api.dto.response.ProjectMemberResponse;
import com.example.CollabPM.api.exception.ResourceNotFoundException;
import com.example.CollabPM.api.mapper.ProjectMemberMapper;
import com.example.CollabPM.application.interfaces.IProjectMemberService;
import com.example.CollabPM.domain.entities.Project;
import com.example.CollabPM.domain.entities.ProjectMember;
import com.example.CollabPM.domain.entities.User;
import com.example.CollabPM.repository.ProjectMemberRepository;
import com.example.CollabPM.repository.ProjectRepository;
import com.example.CollabPM.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
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
    private final ProjectMemberMapper projectMemberMapper;


    // =========================================================
    // ADD MEMBER / INVITE
    // =========================================================

    @Override
    public ProjectMemberResponse addMember(ProjectMemberDto dto) {

        // -----------------------------------------
        // Find project
        // -----------------------------------------

        Project project = projectRepository.findById(dto.getProjectId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Project not found with id: "
                                        + dto.getProjectId()
                        )
                );


        // -----------------------------------------
        // Current authenticated user
        // -----------------------------------------

        User currentUser = getCurrentUser();

        String role = currentUser.getRole().name();


        // =====================================================
        // PERMISSIONS
        // =====================================================

        // ADMIN
        // → can invite members to any project
        if ("ADMIN".equals(role)) {

            // Allowed

        }

        // PROJECT_MANAGER
        // → can invite only if he is a member
        //   of the selected project
        else if ("PROJECT_MANAGER".equals(role)) {

            boolean isMember =
                    projectMemberRepository.existsByProjectIdAndUserId(
                            project.getId(),
                            currentUser.getId()
                    );

            if (!isMember) {

                throw new RuntimeException(
                        "You can only invite members to projects you belong to."
                );
            }
        }

        // MEMBER
        // → cannot invite
        else {

            throw new RuntimeException(
                    "You are not allowed to invite members."
            );
        }


        // -----------------------------------------
        // User to add
        // -----------------------------------------

        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found with id: "
                                        + dto.getUserId()
                        )
                );


        // -----------------------------------------
        // Check duplicate member
        // -----------------------------------------

        if (projectMemberRepository.existsByProjectAndUser(
                project,
                user
        )) {

            throw new RuntimeException(
                    "User is already a member of this project."
            );
        }


        // -----------------------------------------
        // Create ProjectMember
        // -----------------------------------------

        ProjectMember member = ProjectMember.builder()
                .project(project)
                .user(user)
                .roleInProject(dto.getRoleInProject())
                .build();


        return projectMemberMapper.toResponse(
                projectMemberRepository.save(member)
        );
    }


    // =========================================================
    // GET MEMBERS BY PROJECT
    // =========================================================

    @Override
    public List<ProjectMemberResponse> getMembersByProject(
            Long projectId
    ) {

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Project not found with id: "
                                        + projectId
                        )
                );


        return projectMemberRepository
                .findByProject(project)
                .stream()
                .map(projectMemberMapper::toResponse)
                .toList();
    }


    // =========================================================
    // REMOVE MEMBER
    // =========================================================

    @Override
    public void removeMember(Long memberId) {

        // -----------------------------------------
        // Current authenticated user
        // -----------------------------------------

        User currentUser = getCurrentUser();


        // -----------------------------------------
        // ADMIN ONLY
        // -----------------------------------------

        if (!"ADMIN".equals(
                currentUser.getRole().name()
        )) {

            throw new RuntimeException(
                    "Only administrators can remove members."
            );
        }


        // -----------------------------------------
        // Find member
        // -----------------------------------------

        ProjectMember member =
                projectMemberRepository.findById(memberId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Member not found with id: "
                                                + memberId
                                )
                        );


        // -----------------------------------------
        // Delete
        // -----------------------------------------

        projectMemberRepository.delete(member);
    }


    // =========================================================
    // CURRENT USER
    // =========================================================

    private User getCurrentUser() {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();


        if (authentication == null
                || !authentication.isAuthenticated()) {

            throw new RuntimeException(
                    "User is not authenticated."
            );
        }


        String email = authentication.getName();


        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Current user not found."
                        )
                );
    }
}