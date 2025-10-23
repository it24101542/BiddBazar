package com.example.adminmanager.controller;

import com.example.adminmanager.dto.DashboardSummary;
import com.example.adminmanager.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/summary")
    public ResponseEntity<DashboardSummary> summary() {
        return ResponseEntity.ok(dashboardService.summary());
    }
}
