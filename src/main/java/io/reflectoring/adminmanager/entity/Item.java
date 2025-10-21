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
@Table(name="items")
public class Item {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;

    @Column(nullable=false, length=120)
    private String title;

    @Column(length=1000)
    private String description;

    @Column(nullable=false, precision=18, scale=2)
    private BigDecimal startingPrice;

    @Column(precision=18, scale=2)
    private BigDecimal currentPrice;

    @Column(nullable=false)
    private LocalDateTime startTime;

    @Column(nullable=false)
    private LocalDateTime endTime;

    private boolean fraudulent = false;
    private boolean active = true;

    @PrePersist
    void prePersist() {
        if (currentPrice == null) {
            currentPrice = startingPrice;
        }
    }
}