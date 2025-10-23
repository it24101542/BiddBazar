package com.example.adminmanager.controller;

import com.example.adminmanager.dto.UserListResponse;
import com.example.adminmanager.repository.UserRepository;
import com.example.adminmanager.service.UserPermissionService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class UserListingController {

    private final UserRepository userRepository;
    private final UserPermissionService userPermissionService;

    @GetMapping("/users")
    public List<UserListResponse> listUsers() {
        return userRepository.findAll().stream().map(u -> new UserListResponse(
                        u.getId(),
                        u.getUsername(),
                        u.getEmail(),
                        u.isActive(),
                        u.isSuspicious()
                ))
                .toList();
    }

    @DeleteMapping("/users/{id}")
    public void deleteUser(@PathVariable Long id) {
        userPermissionService.deleteUserAndRelated(id);
    }
}
