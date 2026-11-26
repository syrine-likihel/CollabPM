package com.example.CollabPM.api.controller;

import com.example.CollabPM.api.dto.request.UserDto;
import com.example.CollabPM.api.dto.response.UserResponse;
import com.example.CollabPM.application.interfaces.IUserService;
import com.example.CollabPM.domain.enums.Role;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final IUserService userService;

    @PostMapping
    public ResponseEntity<UserResponse> create(
            @Valid @RequestBody UserDto dto
    ) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(userService.createUser(dto));
    }

    @GetMapping("/available")
    public ResponseEntity<List<UserResponse>> getAvailableUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping
    public ResponseEntity<List<UserResponse>> getAll() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getById(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(
                userService.getUserById(id)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody UserDto dto
    ) {
        return ResponseEntity.ok(
                userService.updateUser(id, dto)
        );
    }

    @PutMapping("/{id}/role")
    public ResponseEntity<UserResponse> updateUserRole(
            @PathVariable Long id,
            @RequestParam Role role
    ) {
        return ResponseEntity.ok(
                userService.updateUserRole(id, role)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable Long id
    ) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}