package com.example.adminmanager.repository;

import com.example.adminmanager.entity.Bid;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BidRepository extends JpaRepository<Bid, Long> {
    void deleteAllByBidder_Id(Long userId);
    void deleteAllByItem_Id(Long itemId);
}