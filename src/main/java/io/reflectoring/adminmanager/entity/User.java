package io.reflectoring.adminmanager.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name="users")
public class User {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;

    @Column(nullable=false, unique=true, length=50)
    private String username;

    @Column(nullable=false, length=120)
    private String passwordHash;

    @Column(nullable=false, unique=true, length=120)
    private String email;

    @Column(nullable=false)
    private boolean active = true;

    @Column(nullable=false)
    private boolean suspicious = false;

    @Column(updatable=false)
    private LocalDateTime createdAt;

    @PrePersist
    void prePersist() { createdAt = LocalDateTime.now(); }
}