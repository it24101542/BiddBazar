package com.example.adminmanager.service;

import com.example.adminmanager.dto.ItemFlagUpdateRequest;
import com.example.adminmanager.entity.Item;
import com.example.adminmanager.repository.BidRepository;
import com.example.adminmanager.repository.ItemRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ItemFlagService {

    private final ItemRepository itemRepo;
    private final BidRepository bidRepo;

    public void updateItemFlags(Long id, @Valid ItemFlagUpdateRequest req) {
        Item item = itemRepo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Item not found"));
        item.setFraudulent(req.fraudulent());
        item.setActive(req.active());
        itemRepo.save(item);
    }

    @Transactional
    public void deleteItemAndRelated(Long id) {
        // Delete all bids for this item first
        bidRepo.deleteAllByItem_Id(id);
        // Now delete the item
        itemRepo.deleteById(id);
    }
}

