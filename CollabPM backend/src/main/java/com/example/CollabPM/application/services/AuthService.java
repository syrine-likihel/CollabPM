package com.example.CollabPM.application.services;

import com.example.CollabPM.api.dto.request.LoginRequest;
import com.example.CollabPM.api.dto.request.RegisterRequest;
import com.example.CollabPM.api.dto.response.AuthResponse;
import com.example.CollabPM.api.exception.ResourceNotFoundException;
import com.example.CollabPM.domain.entities.User;
import com.example.CollabPM.domain.enums.Role;
import com.example.CollabPM.repository.UserRepository;
import com.example.CollabPM.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists: " + request.getEmail());
        }

        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.MEMBER)
                .build();

        userRepository.save(user);

        String token = jwtService.generateToken(
                user.getEmail(),
                user.getRole().name()
        );

        return new AuthResponse(
                user.getId(),
                token,
                user.getFullName(),
                user.getEmail(),
                user.getRole().name()
        );
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "User not found with email: " + request.getEmail()));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        String token = jwtService.generateToken(
                user.getEmail(),
                user.getRole().name()
        );

        return new AuthResponse(
                user.getId(), 
                token,
                user.getFullName(),
                user.getEmail(),
                user.getRole().name()
        );
    }
}

