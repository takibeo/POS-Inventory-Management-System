package com.pos.mapper;

import com.pos.dto.response.InventoryResponse;
import com.pos.entity.Inventory;

public class InventoryMapper {
    public static InventoryResponse toResponse(Inventory inventory) {
        if (inventory == null) {
            return null;
        }
        return new InventoryResponse(
                inventory.getId(),
                inventory.getBranch() != null ? inventory.getBranch().getId() : null,
                inventory.getProduct() != null ? inventory.getProduct().getId() : null,
                inventory.getQuantity(),
                inventory.getReservedQuantity(),
                inventory.getAvailableQuantity()
        );
    }
}
