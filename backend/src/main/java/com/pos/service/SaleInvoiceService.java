package com.pos.service;

import com.pos.entity.SaleInvoice;

import java.util.List;
import java.util.UUID;

public interface SaleInvoiceService {
    List<SaleInvoice> getAllSales();
    SaleInvoice getSaleById(UUID id);
    SaleInvoice createSale(SaleInvoice saleInvoice);
    void deleteSale(UUID id);
}
