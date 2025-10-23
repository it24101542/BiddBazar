package com.example.adminmanager.repository;

import com.example.adminmanager.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserRepository extends JpaRepository<User, Long> {
    List<User> findBySuspiciousTrue();
}