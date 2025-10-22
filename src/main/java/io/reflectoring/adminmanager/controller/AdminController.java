package io.reflectoring.adminmanager.controller;

import io.reflectoring.adminmanager.dto.*;
import io.reflectoring.adminmanager.service.AdminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admins")
public class AdminController {

    private final AdminService adminService;

    // CREATE
    @PostMapping
    public ResponseEntity<AdminResponse> create(@Valid @RequestBody AdminCreateRequest req) {
        return ResponseEntity.ok(adminService.create(req));
    }

    // READ (list admins)
    @GetMapping
    public ResponseEntity<List<AdminResponse>> list() {
        return ResponseEntity.ok(adminService.list());
    }

    // UPDATE (it can be role / enabled / password / fullName)
    @PatchMapping("/{id}")
    public ResponseEntity<AdminResponse> update(@PathVariable Long id,
                                                @Valid @RequestBody AdminUpdateRequest req) {
        return ResponseEntity.ok(adminService.update(id, req));
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        adminService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
