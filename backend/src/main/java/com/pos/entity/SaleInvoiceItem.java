package com.pos.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "sale_invoice_items")
@Data
public class SaleInvoiceItem {

    @Id
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "sale_invoice_id", nullable = false)
    private SaleInvoice saleInvoice;

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(nullable = false)
    private Integer quantity;

    @Column(name = "unit_price", nullable = false)
    private Double unitPrice;

    private Double discount;
    private Double subtotal;

    @Column(name = "created_at")
    private Instant createdAt;

    public SaleInvoiceItem() {
    }
}
