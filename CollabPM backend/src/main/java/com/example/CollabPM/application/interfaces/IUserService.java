package com.example.CollabPM.application.interfaces;

import com.example.CollabPM.api.dto.request.UserDto;
import com.example.CollabPM.api.dto.response.UserResponse;
import com.example.CollabPM.domain.enums.Role;

import java.util.List;

public interface IUserService {

    UserResponse createUser(UserDto dto);

    List<UserResponse> getAllUsers();

    UserResponse getUserById(Long id);

    UserResponse updateUser(Long id, UserDto dto);

    UserResponse updateUserRole(Long id, Role role);

    void deleteUser(Long id);
}