package com.pos.service.impl;

import lombok.extern.slf4j.Slf4j;

import com.pos.entity.Inventory;
import com.pos.entity.InventoryTransaction;
import com.pos.repository.InventoryRepository;
import com.pos.repository.InventoryTransactionRepository;
import com.pos.service.InventoryService;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
@Slf4j
public class InventoryServiceImpl implements InventoryService {

    private final InventoryRepository inventoryRepository;
    private final InventoryTransactionRepository transactionRepository;

    public InventoryServiceImpl(InventoryRepository inventoryRepository,
                                InventoryTransactionRepository transactionRepository) {
        this.inventoryRepository = inventoryRepository;
        this.transactionRepository = transactionRepository;
    }

    @Override
    public List<Inventory> getAllInventories() {
        log.info("InventoryService.getAllInventories called");
        return inventoryRepository.findAll();
    }

    @Override
    public Inventory getInventoryById(UUID id) {
        log.info("InventoryService.getInventoryById id={}", id);
        return inventoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Inventory record not found"));
    }

    @Override
    public InventoryTransaction adjustInventory(UUID inventoryId, int quantity, String remark) {
        log.info("InventoryService.adjustInventory inventoryId={} quantity={}", inventoryId, quantity);
        Inventory inventory = getInventoryById(inventoryId);
        inventory.setQuantity(inventory.getQuantity() + quantity);
        inventory.setAvailableQuantity(inventory.getAvailableQuantity() + quantity);
        inventory.setLastUpdated(Instant.now());
        inventoryRepository.save(inventory);

        InventoryTransaction transaction = new InventoryTransaction();
        transaction.setInventory(inventory);
        transaction.setTransactionType("ADJUSTMENT");
        transaction.setQuantity(quantity);
        transaction.setRemark(remark);
        transaction.setCreatedAt(Instant.now());
        return transactionRepository.save(transaction);
    }

    @Override
    public List<InventoryTransaction> getTransactionsByBranch(UUID branchId) {
        log.info("InventoryService.getTransactionsByBranch branchId={}", branchId);
        return transactionRepository.findAll();
    }
}
