package com.example.adminmanager.controller;

import com.example.adminmanager.dto.UserPermissionUpdateRequest;
import com.example.adminmanager.service.UserPermissionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/users")
public class UserPermissionController {

    private final UserPermissionService userPermissionService;

    @PatchMapping("/{id}/flags")
    public ResponseEntity<Void> updateFlags(@PathVariable Long id,
                                            @Valid @RequestBody UserPermissionUpdateRequest req) {
        userPermissionService.updateUserFlags(id, req);
        return ResponseEntity.ok().build();
    }
}


