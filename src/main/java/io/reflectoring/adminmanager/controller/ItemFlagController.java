package io.reflectoring.adminmanager.controller;

import io.reflectoring.adminmanager.dto.ItemFlagUpdateRequest;
import io.reflectoring.adminmanager.service.ItemFlagService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/items")
public class ItemFlagController {

    private final ItemFlagService itemFlagService;

    @PatchMapping("/api/admin/item-flags/{id}")
    public ResponseEntity<Void> updateFlags(@PathVariable Long id,
                                            @Valid @RequestBody ItemFlagUpdateRequest req) {
        itemFlagService.updateItemFlags(id, req);
        return ResponseEntity.ok().build();
    }
}
