package io.reflectoring.adminmanager.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "bids")
public class Bid {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "item_id")
    private Item item;

    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id")
    private User bidder;

    @Column(nullable = false, precision = 18, scale = 2)
    private BigDecimal amount;

    @Column(name = "placed_at")
    private LocalDateTime placedAt;

    @PrePersist
    void prePersist() {
        if (placedAt == null) {
            placedAt = LocalDateTime.now();
        }
    }

    // Remove getBidTime() (it caused null values)
    // If legacy code expects it, implement as:
    // public LocalDateTime getBidTime() { return placedAt; }
}