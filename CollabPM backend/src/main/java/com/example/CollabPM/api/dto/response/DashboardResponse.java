package com.example.CollabPM.api.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DashboardResponse {
    private long totalProjects;
    private long activeProjects;
    private long completedProjects;
    private long lateProjects;
    private long totalTasks;
    private long todoTasks;
    private long inProgressTasks;
    private long doneTasks;
    private long overdueTasks;
    private long totalUsers;
    private long totalMembers;
    
}
