package com.pos.repository;

import com.pos.entity.SaleInvoice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.UUID;

public interface SaleInvoiceRepository extends JpaRepository<SaleInvoice, UUID> {

    @Query("select distinct si from SaleInvoice si left join fetch si.items i left join fetch si.branch b left join fetch si.cashier c")
    List<SaleInvoice> findAllWithItems();
}
