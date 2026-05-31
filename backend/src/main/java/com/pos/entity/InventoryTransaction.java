package com.pos.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "inventory_transactions")
@Data
public class InventoryTransaction {

    @Id
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "inventory_id", nullable = false)
    private Inventory inventory;

    @Column(name = "transaction_type", nullable = false)
    private String transactionType;

    @Column(nullable = false)
    private Integer quantity;

    private String remark;

    @Column(name = "reference_id")
    private UUID referenceId;

    @ManyToOne
    @JoinColumn(name = "created_by")
    private User createdBy;

    @Column(name = "created_at")
    private Instant createdAt;

    public InventoryTransaction() {
    }
}
