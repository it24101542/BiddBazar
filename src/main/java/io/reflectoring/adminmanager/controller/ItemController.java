package io.reflectoring.adminmanager.controller;

import io.reflectoring.adminmanager.dto.ItemListResponse;
import io.reflectoring.adminmanager.entity.Item;
import io.reflectoring.adminmanager.repository.ItemRepository;
import io.reflectoring.adminmanager.service.ItemFlagService;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class ItemController {

    private final ItemRepository itemRepository;
    private final ItemFlagService itemFlagService;

    // List items for UI display
    @GetMapping("/items")
    public List<ItemListResponse> listItems() {
        return itemRepository.findAll().stream()
                .map(i -> new ItemListResponse( //convert to DTO
                        i.getId(),
                        i.getTitle(),
                        i.isActive(),
                        i.isFraudulent()
                ))
                .toList();
    }

    // update flags
    @PatchMapping("/admin/items/{id}/flags")
    public void updateFlags(@PathVariable Long id,
                            @RequestBody ItemFlagsUpdateRequest req) {
        Item item = itemRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Item not found: " + id));
        if (req.active() != null)      item.setActive(req.active());
        if (req.fraudulent() != null)  item.setFraudulent(req.fraudulent());
        itemRepository.save(item);
    }

    // DELETE
    @DeleteMapping("/items/{id}")
    public void deleteItem(@PathVariable Long id) {
        itemFlagService.deleteItemAndRelated(id);
    }

    // DTO for patch body
    public record ItemFlagsUpdateRequest(
            @NotNull Boolean active,
            @NotNull Boolean fraudulent
    ) {}
}