package com.pos.repository;

import com.pos.entity.SaleInvoice;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface SaleInvoiceRepository extends JpaRepository<SaleInvoice, UUID> {
}
