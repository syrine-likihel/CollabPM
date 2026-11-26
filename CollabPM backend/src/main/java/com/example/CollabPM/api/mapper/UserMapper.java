package com.example.CollabPM.api.mapper;

import com.example.CollabPM.api.dto.request.UserDto;
import com.example.CollabPM.api.dto.response.UserResponse;
import com.example.CollabPM.domain.entities.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public User toEntity(UserDto dto) {
        return User.builder()
                .fullName(dto.getFullName())
                .email(dto.getEmail())
                .password(dto.getPassword())
                .role(dto.getRole())
                .build();
    }

    public void updateEntity(User user, UserDto dto) {

        user.setFullName(dto.getFullName());
        user.setEmail(dto.getEmail());

        if (dto.getPassword() != null && !dto.getPassword().isEmpty()) {
            user.setPassword(dto.getPassword());
        }

        if (dto.getRole() != null) {
            user.setRole(dto.getRole());
        }
    }

    public UserResponse toResponse(User user) {
        UserResponse response = new UserResponse();

        response.setId(user.getId());
        response.setFullName(user.getFullName());
        response.setEmail(user.getEmail());
        response.setRole(user.getRole());
        response.setCreatedAt(user.getCreatedAt());

        return response;
    }
}