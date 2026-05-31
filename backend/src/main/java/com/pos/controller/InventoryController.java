package com.pos.controller;

import com.pos.entity.Inventory;
import com.pos.entity.InventoryTransaction;
import com.pos.service.InventoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/inventories")
public class InventoryController {

    private final InventoryService inventoryService;

    public InventoryController(InventoryService inventoryService) {
        this.inventoryService = inventoryService;
    }

    @GetMapping
    public ResponseEntity<List<Inventory>> getAll() {
        return ResponseEntity.ok(inventoryService.getAllInventories());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Inventory> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(inventoryService.getInventoryById(id));
    }

    @PostMapping("/adjust")
    public ResponseEntity<InventoryTransaction> adjust(@RequestParam UUID inventoryId,
                                                       @RequestParam int quantity,
                                                       @RequestParam(required = false) String remark) {
        return ResponseEntity.ok(inventoryService.adjustInventory(inventoryId, quantity, remark));
    }

    @GetMapping("/{branchId}/transactions")
    public ResponseEntity<List<InventoryTransaction>> getTransactions(@PathVariable UUID branchId) {
        return ResponseEntity.ok(inventoryService.getTransactionsByBranch(branchId));
    }
}
