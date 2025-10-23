package com.example.adminmanager.controller;

import com.example.adminmanager.dto.BidResponse;
import com.example.adminmanager.service.BidService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin")
public class BidController {

    private final BidService bidService;

    @GetMapping("/bids")
    public List<BidResponse> listBids() {
        return bidService.list();
    }
}