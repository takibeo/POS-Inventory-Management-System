package com.pos.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class InventoryResponse {
    private UUID id;
    private UUID branchId;
    private UUID productId;
    private Integer quantity;
    private Integer reservedQuantity;
    private Integer availableQuantity;
}
