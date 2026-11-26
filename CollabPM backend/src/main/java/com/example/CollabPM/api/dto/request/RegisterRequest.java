package com.example.CollabPM.api.dto.request;

import com.example.CollabPM.domain.enums.Role;
import lombok.Data;

@Data
public class RegisterRequest {
    private String fullName;
    private  String email;
    private  String password;

}
