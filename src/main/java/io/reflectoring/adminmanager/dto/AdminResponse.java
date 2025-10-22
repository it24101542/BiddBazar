package io.reflectoring.adminmanager.dto;

import java.time.LocalDateTime;

public record AdminResponse(
        Long id,
        String username,
        String role,
        String email,
        String fullName,
        boolean enabled,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {}
