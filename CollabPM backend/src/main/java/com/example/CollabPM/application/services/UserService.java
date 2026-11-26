package com.example.CollabPM.application.services;

import com.example.CollabPM.api.dto.request.RoleUpdateDto;
import com.example.CollabPM.api.dto.request.UserDto;
import com.example.CollabPM.api.dto.response.UserResponse;
import com.example.CollabPM.api.exception.ResourceNotFoundException;
import com.example.CollabPM.api.mapper.UserMapper;
import com.example.CollabPM.application.interfaces.IUserService;
import com.example.CollabPM.domain.entities.User;
import com.example.CollabPM.domain.enums.Role;
import com.example.CollabPM.repository.ProjectMemberRepository;
import com.example.CollabPM.repository.ProjectRepository;
import com.example.CollabPM.repository.TaskRepository;
import com.example.CollabPM.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class UserService implements IUserService {
    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;
    private final ProjectMemberRepository projectMemberRepository;
    private final TaskRepository taskRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    @Override
    public UserResponse createUser(UserDto dto) {
        if (userRepository.existsByEmail(dto.getEmail()))
            throw new RuntimeException("Email already exists: " + dto.getEmail());
        User user = userMapper.toEntity(dto);
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        return userMapper.toResponse(userRepository.save(user));
    }

    @Override
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(userMapper::toResponse)
                .toList();
    }

    @Override
    public UserResponse getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        return userMapper.toResponse(user);
    }

    @Override
    public UserResponse updateUser(Long id, UserDto dto) {

        User user = userRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found with id: " + id
                        )
                );

        userMapper.updateEntity(user, dto);

        if (dto.getPassword() != null && !dto.getPassword().isEmpty()) {
            user.setPassword(
                    passwordEncoder.encode(dto.getPassword())
            );
        }

        return userMapper.toResponse(
                userRepository.save(user)
        );
    }

    public UserResponse updateRole(Long id, RoleUpdateDto dto) {

        User user = userRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found with id: " + id
                        )
                );

        user.setRole(dto.getRole());

        User updatedUser = userRepository.save(user);

        return userMapper.toResponse(updatedUser);
    }

    public UserResponse updateUserRole(Long id, Role role) {

        User user = userRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found with id: " + id
                        )
                );

        user.setRole(role);

        return userMapper.toResponse(
                userRepository.save(user)
        );
    }


    @Override
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found with id: " + id));

        // User owns projects → don't allow deletion
        if (!projectRepository.findByOwner(user).isEmpty()) {
            throw new RuntimeException(
                    "Cannot delete this user because they own one or more projects."
            );
        }

        // Remove project memberships
        projectMemberRepository.deleteByUser(user);

        // Unassign user's tasks
        taskRepository.clearAssignedTo(user);

        // delete the user
        userRepository.delete(user);
    }
}

