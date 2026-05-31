package com.pos.controller;

import com.pos.entity.SaleInvoice;
import com.pos.service.SaleInvoiceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/sales")
public class SaleInvoiceController {

    private final SaleInvoiceService saleInvoiceService;

    public SaleInvoiceController(SaleInvoiceService saleInvoiceService) {
        this.saleInvoiceService = saleInvoiceService;
    }

    @GetMapping
    public ResponseEntity<List<SaleInvoice>> getAll() {
        return ResponseEntity.ok(saleInvoiceService.getAllSales());
    }

    @GetMapping("/{id}")
    public ResponseEntity<SaleInvoice> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(saleInvoiceService.getSaleById(id));
    }

    @PostMapping
    public ResponseEntity<SaleInvoice> create(@RequestBody SaleInvoice saleInvoice) {
        return ResponseEntity.ok(saleInvoiceService.createSale(saleInvoice));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        saleInvoiceService.deleteSale(id);
        return ResponseEntity.noContent().build();
    }
}
