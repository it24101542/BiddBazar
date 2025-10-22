package io.reflectoring.adminmanager.service;

import io.reflectoring.adminmanager.dto.*;
import io.reflectoring.adminmanager.entity.Admin;
import io.reflectoring.adminmanager.mapper.AdminMapper;
import io.reflectoring.adminmanager.repository.AdminRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;

import java.util.List;

@Service
@RequiredArgsConstructor
@Validated
public class AdminService {

    private final AdminRepository adminRepo;
    private final PasswordEncoder encoder;

    public AdminResponse create(@Valid AdminCreateRequest req) {
        if (adminRepo.existsByUsername(req.username())) {
            throw new IllegalArgumentException("Username already exists");
        }
        if (adminRepo.existsByEmail(req.email())) {
            throw new IllegalArgumentException("Email already exists");
        }
        Admin admin = Admin.builder()
                .username(req.username())
                .passwordHash(encoder.encode(req.password()))
                .role(req.role())
                .email(req.email())
                .fullName(req.fullName())
                .enabled(true)
                .build();
        return AdminMapper.toResponse(adminRepo.save(admin));
    }

    public List<AdminResponse> list() {
        return adminRepo.findAll().stream().map(AdminMapper::toResponse).toList();
    }

    public AdminResponse update(Long id, @Valid AdminUpdateRequest req) {
        Admin admin = adminRepo.findById(id).orElseThrow(() -> new IllegalArgumentException("Admin not found"));
        if (req.role() != null) admin.setRole(req.role());
        if (req.enabled() != null) admin.setEnabled(req.enabled());
        if (req.newPassword() != null) admin.setPasswordHash(encoder.encode(req.newPassword()));
        if (req.fullName() != null) admin.setFullName(req.fullName());
        return AdminMapper.toResponse(adminRepo.save(admin));
    }

    public void delete(Long id) {
        if (!adminRepo.existsById(id)) {
            throw new IllegalArgumentException("Admin not found");
        }
        adminRepo.deleteById(id);
    }
}