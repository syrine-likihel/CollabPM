package com.example.CollabPM.api.controller;

import com.example.CollabPM.api.dto.request.ProjectMemberDto;
import com.example.CollabPM.api.dto.response.ProjectMemberResponse;
import com.example.CollabPM.application.interfaces.IProjectMemberService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/members")
@RequiredArgsConstructor
public class ProjectMemberController {
    private final IProjectMemberService projectMemberService;

    @PostMapping
    public ResponseEntity<ProjectMemberResponse> addMember(@Valid @RequestBody ProjectMemberDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(projectMemberService.addMember(dto));
    }

    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<ProjectMemberResponse>> getByProject(@PathVariable Long projectId) {
        return ResponseEntity.ok(projectMemberService.getMembersByProject(projectId));
    }

    @DeleteMapping("/{memberId}")
    public ResponseEntity<Void> removeMember(@PathVariable Long memberId) {
        projectMemberService.removeMember(memberId);
        return ResponseEntity.noContent().build();
    }
}
