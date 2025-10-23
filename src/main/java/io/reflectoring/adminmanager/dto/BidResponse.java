package com.example.adminmanager.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record BidResponse(
        Long id,
        Long itemId,
        Long bidderId,
        BigDecimal amount,
        LocalDateTime placedAt
) {}