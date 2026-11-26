package com.example.CollabPM.api.dto.request;

import com.example.CollabPM.domain.enums.Role;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class RoleUpdateDto {
    @NotNull(message = "Role is required")
    private Role role;
}
