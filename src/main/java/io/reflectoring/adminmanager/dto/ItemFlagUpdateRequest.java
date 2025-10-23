package com.example.adminmanager.dto;

import jakarta.validation.constraints.NotNull;

public record ItemFlagUpdateRequest(
        @NotNull Boolean fraudulent,
        @NotNull Boolean active
) {}
