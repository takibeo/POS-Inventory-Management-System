package com.pos.controller;

import com.pos.dto.request.SaleInvoiceRequest;
import com.pos.dto.response.SaleInvoiceResponse;
import com.pos.service.SaleInvoiceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
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
    @Operation(summary = "Lấy danh sách hoá đơn bán hàng", description = "Lấy các hóa đơn bán hàng, có thể lọc theo chi nhánh hoặc trạng thái")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Lấy danh sách thành công"),
            @ApiResponse(responseCode = "401", description = "Chưa đăng nhập"),
            @ApiResponse(responseCode = "403", description = "Không có quyền truy cập")
    })
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'CASHIER', 'WAREHOUSE')")
    public ResponseEntity<List<SaleInvoiceResponse>> getAll(
            @RequestParam(required = false) java.util.UUID branchId,
            @RequestParam(required = false) String status) {
        return ResponseEntity.ok(saleInvoiceService.getAllSales(branchId, status));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Lấy hoá đơn bán hàng theo ID")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'CASHIER', 'WAREHOUSE')")
    public ResponseEntity<SaleInvoiceResponse> getById(
            @Parameter(description = "ID hóa đơn bán hàng", required = true)
            @PathVariable UUID id) {
        return ResponseEntity.ok(saleInvoiceService.getSaleById(id));
    }

    @PostMapping
    @Operation(summary = "Tạo hoá đơn bán hàng")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'CASHIER')")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Tạo hóa đơn bán hàng thành công"),
            @ApiResponse(responseCode = "400", description = "Dữ liệu đầu vào không hợp lệ")
    })
    public ResponseEntity<SaleInvoiceResponse> create(
            @Parameter(description = "Thông tin hóa đơn bán hàng mới", required = true)
            @Valid @RequestBody SaleInvoiceRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(saleInvoiceService.createSale(request));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Xóa hoá đơn bán hàng")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Xóa hóa đơn thành công"),
            @ApiResponse(responseCode = "404", description = "Không tìm thấy hóa đơn")
    })
    public ResponseEntity<Void> delete(
            @Parameter(description = "ID hóa đơn cần xóa", required = true)
            @PathVariable UUID id) {
        saleInvoiceService.deleteSale(id);
        return ResponseEntity.noContent().build();
    }
}
