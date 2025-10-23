package com.example.adminmanager.dto;

public record ItemListResponse(
        Long id,
        String title,
        boolean active,
        boolean fraudulent,
        String imageUrl
) {}
