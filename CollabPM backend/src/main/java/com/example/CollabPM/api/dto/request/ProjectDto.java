package com.example.CollabPM.api.dto.request;

import com.example.CollabPM.domain.enums.ProjectStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class ProjectDto {
    @NotBlank(message = "Name is required")
    private   String name;

    private String description;

    @NotNull(message = "Strat date is required")
    private LocalDate startDate;

    @NotNull(message = "end date is required")
    private LocalDate endDate;

    private ProjectStatus status;
}
