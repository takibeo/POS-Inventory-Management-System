package com.pos.service.impl;

import com.pos.entity.SaleInvoice;
import com.pos.repository.SaleInvoiceRepository;
import com.pos.service.SaleInvoiceService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class SaleInvoiceServiceImpl implements SaleInvoiceService {

    private final SaleInvoiceRepository saleInvoiceRepository;

    public SaleInvoiceServiceImpl(SaleInvoiceRepository saleInvoiceRepository) {
        this.saleInvoiceRepository = saleInvoiceRepository;
    }

    @Override
    public List<SaleInvoice> getAllSales() {
        return saleInvoiceRepository.findAll();
    }

    @Override
    public SaleInvoice getSaleById(UUID id) {
        return saleInvoiceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sale invoice not found"));
    }

    @Override
    public SaleInvoice createSale(SaleInvoice saleInvoice) {
        return saleInvoiceRepository.save(saleInvoice);
    }

    @Override
    public void deleteSale(UUID id) {
        saleInvoiceRepository.deleteById(id);
    }
}
