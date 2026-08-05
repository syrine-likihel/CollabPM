package com.example.CollabPM.application.services;

import com.example.CollabPM.api.dto.request.UserDto;
import com.example.CollabPM.api.dto.response.UserResponse;
import com.example.CollabPM.api.exception.ResourceNotFoundException;
import com.example.CollabPM.api.mapper.UserMapper;
import com.example.CollabPM.application.interfaces.IUserService;
import com.example.CollabPM.domain.entities.User;
import com.example.CollabPM.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class UserService implements IUserService {
    private final UserRepository userRepository;
    private final UserMapper userMapper;

    @Override
    public UserResponse createUser(UserDto dto) {
        if (userRepository.existsByEmail(dto.getEmail()))
            throw new RuntimeException("Email already exists: " + dto.getEmail());
        User user = userMapper.toEntity(dto);
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
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        userMapper.updateEntity(user, dto);
        return userMapper.toResponse(userRepository.save(user));
    }

    @Override
    public void deleteUser(Long id) {
        if (!userRepository.existsById(id))
            throw new ResourceNotFoundException("User not found with id: " + id);
        userRepository.deleteById(id);
    }
}
