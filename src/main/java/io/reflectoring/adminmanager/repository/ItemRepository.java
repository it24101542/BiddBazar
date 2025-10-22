package io.reflectoring.adminmanager.repository;

import io.reflectoring.adminmanager.entity.Item;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ItemRepository extends JpaRepository<Item, Long> {
    List<Item> findByFraudulentTrue();
}