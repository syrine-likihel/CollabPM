package com.example.CollabPM.api.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResponse {
    private Long id;
    private String token;
    private String fullname;
    private String email;
    private  String role;
}
