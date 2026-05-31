package com.pos.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Entity
@Table(name = "sale_invoices")
@Data
public class SaleInvoice {

    @Id
    private UUID id;

    @Column(name = "invoice_number", nullable = false, unique = true)
    private String invoiceNumber;

    @ManyToOne
    @JoinColumn(name = "branch_id", nullable = false)
    private Branch branch;

    @ManyToOne
    @JoinColumn(name = "cashier_id", nullable = false)
    private User cashier;

    @Column(name = "customer_name")
    private String customerName;

    @Column(nullable = false)
    private String status;

    @Column(name = "created_at")
    private Instant createdAt;

    @Column(name = "total_amount")
    private Double totalAmount;

    private Double tax;
    private Double discount;
    private String paymentMethod;

    @Column(name = "amount_paid")
    private Double amountPaid;

    @Column(name = "change_amount")
    private Double changeAmount;

    @OneToMany(mappedBy = "saleInvoice", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<SaleInvoiceItem> items = new HashSet<>();

    public SaleInvoice() {
    }
}
