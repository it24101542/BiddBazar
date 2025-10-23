package com.example.adminmanager.dto;

public record UserListResponse(
        Long id,
        String username,
        String email,
        boolean active,
        boolean suspicious
) {}
