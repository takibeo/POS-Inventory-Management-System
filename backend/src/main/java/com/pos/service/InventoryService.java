package com.pos.service;

import com.pos.entity.Inventory;
import com.pos.entity.InventoryTransaction;

import java.util.List;
import java.util.UUID;

public interface InventoryService {
    List<Inventory> getAllInventories();
    Inventory getInventoryById(UUID id);
    InventoryTransaction adjustInventory(UUID inventoryId, int quantity, String remark);
    List<InventoryTransaction> getTransactionsByBranch(UUID branchId);
}
