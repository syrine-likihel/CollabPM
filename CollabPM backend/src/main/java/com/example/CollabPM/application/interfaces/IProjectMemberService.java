package com.example.CollabPM.application.interfaces;

import com.example.CollabPM.api.dto.request.ProjectMemberDto;
import com.example.CollabPM.api.dto.response.ProjectMemberResponse;

import java.util.List;

public interface IProjectMemberService {
    ProjectMemberResponse addMember(ProjectMemberDto dto);
    List<ProjectMemberResponse> getMembersByProject(Long projectId);
    void removeMember(Long memberId);
}
