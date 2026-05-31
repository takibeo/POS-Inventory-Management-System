package com.pos.repository;

import com.pos.entity.Inventory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface InventoryRepository extends JpaRepository<Inventory, UUID> {
    Optional<Inventory> findByBranchIdAndProductId(UUID branchId, UUID productId);
}
