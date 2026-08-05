package com.example.CollabPM.api.controller;

import com.example.CollabPM.api.dto.request.ProjectDto;
import com.example.CollabPM.api.dto.response.ProjectResponse;
import com.example.CollabPM.application.interfaces.IProjectService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/projects")
public class ProjectController {
    private final IProjectService projectService;
    @PostMapping
    public ResponseEntity<ProjectResponse> create(
            @Valid
            @RequestBody ProjectDto dto,
            @RequestParam Long ownerId
            ){
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(projectService.createProject(dto, ownerId));

    }

    @GetMapping
    public ResponseEntity<List<ProjectResponse>> getAll() {
        return ResponseEntity.ok(projectService.getAllProjects());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProjectResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(projectService.getProjectById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProjectResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody ProjectDto dto) {
        return ResponseEntity.ok(projectService.updateProject(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        projectService.deleteProject(id);
        return ResponseEntity.noContent().build();
    }
}
