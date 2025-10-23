package com.example.adminmanager.service;

import com.example.adminmanager.dto.DashboardSummary;
import com.example.adminmanager.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DashboardService {
    private final AdminRepository adminRepo;
    private final UserRepository userRepo;
    private final ItemRepository itemRepo;
    private final BidRepository bidRepo;

    public DashboardSummary summary() {
        long totalAdmins = adminRepo.count();
        long totalUsers = userRepo.count();
        long suspiciousUsers = userRepo.findBySuspiciousTrue().size();
        long totalItems = itemRepo.count();
        long fraudulentItems = itemRepo.findByFraudulentTrue().size();
        long totalBids = bidRepo.count();
        long activeItems = itemRepo.findAll().stream().filter(i -> i.isActive() && !i.isFraudulent()).count();

        return new DashboardSummary(
                totalAdmins,
                totalUsers,
                suspiciousUsers,
                totalItems,
                fraudulentItems,
                totalBids,
                activeItems
        );
    }
}
