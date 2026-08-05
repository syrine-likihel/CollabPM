package com.example.CollabPM.api.controller;

import com.example.CollabPM.api.dto.response.DashboardResponse;
import com.example.CollabPM.application.interfaces.IDashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final IDashboardService dashboardService;
    @GetMapping
    public ResponseEntity<DashboardResponse>getStats(){
        return ResponseEntity.ok(dashboardService.getStats());
    }
}
