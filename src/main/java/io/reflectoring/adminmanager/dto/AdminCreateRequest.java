package io.reflectoring.adminmanager.dto;

import jakarta.validation.constraints.*;

public record AdminCreateRequest(
        @NotBlank @Size(min=3, max=50) String username,
        @NotBlank @Size(min=6, max=60) String password,
        @NotBlank @Email String email,
        @NotBlank @Pattern(regexp="SUPER_ADMIN|STAFF", message="role must be SUPER_ADMIN or STAFF") String role,
        @Size(max=80) String fullName
) {}