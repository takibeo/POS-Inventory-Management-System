package com.pos.controller;

import com.pos.dto.request.SaleInvoiceRequest;
import com.pos.dto.response.SaleInvoiceResponse;
import com.pos.service.SaleInvoiceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/sales")
@Tag(name = "Sales", description = "Quản lý hoá đơn bán hàng")
public class SaleInvoiceController {

    private final SaleInvoiceService saleInvoiceService;

    public SaleInvoiceController(SaleInvoiceService saleInvoiceService) {
        this.saleInvoiceService = saleInvoiceService;
    }

    @GetMapping
    @Operation(summary = "Lấy danh sách hoá đơn bán hàng")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'CASHIER', 'WAREHOUSE')")
    public ResponseEntity<List<SaleInvoiceResponse>> getAll(
            @RequestParam(required = false) java.util.UUID branchId,
            @RequestParam(required = false) String status) {
        return ResponseEntity.ok(saleInvoiceService.getAllSales(branchId, status));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Lấy hoá đơn bán hàng theo ID")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'CASHIER', 'WAREHOUSE')")
    public ResponseEntity<SaleInvoiceResponse> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(saleInvoiceService.getSaleById(id));
    }

    @PostMapping
    @Operation(summary = "Tạo hoá đơn bán hàng")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'CASHIER')")
    public ResponseEntity<SaleInvoiceResponse> create(@Valid @RequestBody SaleInvoiceRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(saleInvoiceService.createSale(request));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Xóa hoá đơn bán hàng")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        saleInvoiceService.deleteSale(id);
        return ResponseEntity.noContent().build();
    }
}
