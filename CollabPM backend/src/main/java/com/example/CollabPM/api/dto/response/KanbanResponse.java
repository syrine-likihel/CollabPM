package com.example.CollabPM.api.dto.response;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class KanbanResponse {
    private List<TaskResponse>todo;
    private List<TaskResponse>inProgress;
    private List<TaskResponse>done;
}
