package com.pos.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "purchase_order_items")
@Data
public class PurchaseOrderItem {

    @Id
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "purchase_order_id", nullable = false)
    private PurchaseOrder purchaseOrder;

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(nullable = false)
    private Integer quantity;

    @Column(nullable = false)
    private Double cost;

    private Double subtotal;

    @Column(name = "created_at")
    private Instant createdAt;

    public PurchaseOrderItem() {
    }
}
