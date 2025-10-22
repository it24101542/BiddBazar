package io.reflectoring.adminmanager.dto;

import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record AdminUpdateRequest(
        @Pattern(regexp="SUPER_ADMIN|STAFF", message="role must be SUPER_ADMIN or STAFF")
        String role,
        Boolean enabled,
        @Size(min=6, max=60) String newPassword,
        @Size(max=80) String fullName
) {}
