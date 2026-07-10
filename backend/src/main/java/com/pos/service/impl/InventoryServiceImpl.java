package com.pos.service.impl;

import lombok.extern.slf4j.Slf4j;

import com.pos.dto.response.InventoryResponse;
import com.pos.entity.Inventory;
import com.pos.entity.InventoryTransaction;
import com.pos.exception.BusinessException;
import com.pos.mapper.InventoryMapper;
import com.pos.repository.InventoryRepository;
import com.pos.repository.InventoryTransactionRepository;
import com.pos.service.InventoryService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
    public List<InventoryResponse> getAllInventories() {
        log.info("InventoryService.getAllInventories called");
        return inventoryRepository.findAll().stream()
                .map(InventoryMapper::toResponse)
                .toList();
    }

    @Override
    public InventoryResponse getInventoryById(UUID id) {
        log.info("InventoryService.getInventoryById id={}", id);
        return inventoryRepository.findById(id)
                .map(InventoryMapper::toResponse)
                .orElseThrow(() -> new RuntimeException("Inventory record not found"));
    }

    @Override
    @Transactional
    public InventoryTransaction adjustInventory(UUID inventoryId, int quantity, String remark) {
        log.info("InventoryService.adjustInventory inventoryId={} quantity={}", inventoryId, quantity);
        Inventory inventory = inventoryRepository.findByIdForUpdate(inventoryId)
                .orElseThrow(() -> new RuntimeException("Inventory record not found"));

        int newQuantity = inventory.getQuantity() + quantity;
        int newAvailableQuantity = inventory.getAvailableQuantity() + quantity;
        if (newQuantity < 0 || newAvailableQuantity < 0) {
            throw new BusinessException("INVENTORY_NEGATIVE", "Số lượng tồn kho không thể nhỏ hơn 0");
        }
        inventory.setQuantity(newQuantity);
        inventory.setAvailableQuantity(newAvailableQuantity);
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
        return transactionRepository.findByInventoryBranchIdOrderByCreatedAtDesc(branchId);
    }
}
