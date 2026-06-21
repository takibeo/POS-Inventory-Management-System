package com.pos.service;

import com.pos.dto.request.SaleInvoiceRequest;
import com.pos.dto.response.SaleInvoiceResponse;

import java.util.List;
import java.util.UUID;

public interface SaleInvoiceService {
    List<SaleInvoiceResponse> getAllSales(java.util.UUID branchId, String status);
    SaleInvoiceResponse getSaleById(UUID id);
    SaleInvoiceResponse createSale(SaleInvoiceRequest saleInvoiceRequest);
    void deleteSale(UUID id);
}
