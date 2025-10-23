package com.example.adminmanager.dto;

import jakarta.validation.constraints.NotNull;

public record UserPermissionUpdateRequest(
        @NotNull Boolean active,
        @NotNull Boolean suspicious
) {}
