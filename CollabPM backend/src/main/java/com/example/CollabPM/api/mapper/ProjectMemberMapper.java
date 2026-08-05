package com.example.CollabPM.api.mapper;

import com.example.CollabPM.api.dto.response.ProjectMemberResponse;
import com.example.CollabPM.domain.entities.ProjectMember;
import org.springframework.stereotype.Component;

@Component
public class ProjectMemberMapper {
    public ProjectMemberResponse toResponse(ProjectMember member) {
        ProjectMemberResponse response = new ProjectMemberResponse();
        response.setId(member.getId());
        response.setProjectName(member.getProject().getName());
        response.setUserName(member.getUser().getFullName());
        response.setUserEmail(member.getUser().getEmail());
        response.setRoleInProject(member.getRoleInProject());
        response.setJoinedAt(member.getJoinedAt());
        return response;
    }
}
