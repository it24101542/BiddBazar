package com.example.adminmanager.service;

import com.example.adminmanager.dto.UserPermissionUpdateRequest;
import com.example.adminmanager.entity.User;
import com.example.adminmanager.repository.BidRepository;
import com.example.adminmanager.repository.UserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserPermissionService {

    private final UserRepository userRepo;
    private final BidRepository bidRepo;

    public void updateUserFlags(Long id, @Valid UserPermissionUpdateRequest req) {
        User u = userRepo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found" + id));
        u.setActive(req.active());
        u.setSuspicious(req.suspicious());
        userRepo.save(u);
    }

    @Transactional
    public void deleteUserAndRelated(Long id) {
        // Delete all bids by this user first
        bidRepo.deleteAllByBidder_Id(id);
        // Now delete the user
        userRepo.deleteById(id);
    }
}

