package com.example.adminmanager.dto;

public record DashboardSummary(
        long totalAdmins,
        long totalUsers,
        long suspiciousUsers,
        long totalItems,
        long fraudulentItems,
        long totalBids,
        long activeItems
) {}
