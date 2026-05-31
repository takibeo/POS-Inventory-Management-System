package com.pos.repository;

import com.pos.entity.SaleInvoiceItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface SaleInvoiceItemRepository extends JpaRepository<SaleInvoiceItem, UUID> {
}
