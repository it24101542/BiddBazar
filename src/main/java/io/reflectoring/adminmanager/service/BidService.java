package com.example.adminmanager.service;

import com.example.adminmanager.dto.BidResponse;
import com.example.adminmanager.entity.Bid;
import com.example.adminmanager.repository.BidRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BidService {

    private final BidRepository bidRepository;

    public List<BidResponse> list() {
        return bidRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    private BidResponse toResponse(Bid b) {
        return new BidResponse(
                b.getId(),
                b.getItem() != null ? b.getItem().getId() : null,
                b.getBidder() != null ? b.getBidder().getId() : null,
                b.getAmount(),
                b.getPlacedAt()
        );
    }
}