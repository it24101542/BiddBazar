package io.reflectoring.adminmanager.mapper;

import io.reflectoring.adminmanager.dto.AdminResponse;
import io.reflectoring.adminmanager.entity.Admin;

public class AdminMapper {
    public static AdminResponse toResponse(Admin a) {
        return new AdminResponse(
                a.getId(),
                a.getUsername(),
                a.getRole(),
                a.getEmail(),
                a.getFullName(),
                a.isEnabled(),
                a.getCreatedAt(),
                a.getUpdatedAt()
        );
    }
}