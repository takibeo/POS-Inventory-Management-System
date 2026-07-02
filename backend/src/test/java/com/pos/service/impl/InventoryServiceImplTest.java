package com.pos.service.impl;

import com.pos.entity.Inventory;
import com.pos.entity.InventoryTransaction;
import com.pos.exception.BusinessException;
import com.pos.repository.InventoryRepository;
import com.pos.repository.InventoryTransactionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class InventoryServiceImplTest {

    @Mock private InventoryRepository inventoryRepository;
    @Mock private InventoryTransactionRepository transactionRepository;
    private InventoryServiceImpl inventoryService;

    @BeforeEach
    void setUp() {
        inventoryService = new InventoryServiceImpl(inventoryRepository, transactionRepository);
    }

    @Test
    void adjustInventorySuccess() {
        UUID id = UUID.randomUUID();
        Inventory inv = new Inventory(); inv.setId(id); inv.setQuantity(10); inv.setAvailableQuantity(10);
        when(inventoryRepository.findByIdForUpdate(id)).thenReturn(Optional.of(inv));
        when(inventoryRepository.save(any())).thenAnswer(i -> i.getArgument(0));
        when(transactionRepository.save(any())).thenAnswer(i -> i.getArgument(0));

        InventoryTransaction tx = inventoryService.adjustInventory(id, 5, "test");
        assertNotNull(tx);
        verify(inventoryRepository).save(any());
        verify(transactionRepository).save(any());
    }

    @Test
    void adjustInventoryUsesLockForConcurrentUpdates() {
        UUID id = UUID.randomUUID();
        Inventory inv = new Inventory(); inv.setId(id); inv.setQuantity(10); inv.setAvailableQuantity(10);
        when(inventoryRepository.findByIdForUpdate(id)).thenReturn(Optional.of(inv));
        when(inventoryRepository.save(any())).thenAnswer(i -> i.getArgument(0));
        when(transactionRepository.save(any())).thenAnswer(i -> i.getArgument(0));

        inventoryService.adjustInventory(id, 1, "concurrency-check");

        verify(inventoryRepository).findByIdForUpdate(id);
        verify(inventoryRepository, never()).findById(id);
    }

    @Test
    void adjustInventoryBelowZeroThrows() {
        UUID id = UUID.randomUUID();
        Inventory inv = new Inventory(); inv.setId(id); inv.setQuantity(2); inv.setAvailableQuantity(2);
        when(inventoryRepository.findByIdForUpdate(id)).thenReturn(Optional.of(inv));

        assertThrows(BusinessException.class, () -> inventoryService.adjustInventory(id, -5, "test"));
    }

    @Test
    void getInventoryByIdNotFoundThrows() {
        UUID id = UUID.randomUUID();
        when(inventoryRepository.findById(id)).thenReturn(Optional.empty());
        assertThrows(RuntimeException.class, () -> inventoryService.getInventoryById(id));
    }
}
