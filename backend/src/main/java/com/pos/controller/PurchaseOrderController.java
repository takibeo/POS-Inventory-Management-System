package com.pos.controller;

import com.pos.dto.request.PurchaseOrderRequest;
import com.pos.dto.response.PurchaseOrderResponse;
import com.pos.service.PurchaseOrderService;
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
@RequestMapping("/api/purchase-orders")
@Tag(name = "Purchase Orders", description = "Quản lý đơn nhập kho")
public class PurchaseOrderController {

    private final PurchaseOrderService purchaseOrderService;

    public PurchaseOrderController(PurchaseOrderService purchaseOrderService) {
        this.purchaseOrderService = purchaseOrderService;
    }

    @GetMapping
    @Operation(summary = "Lấy danh sách đơn nhập kho", description = "Lấy các đơn nhập kho, có thể lọc theo nhà cung cấp hoặc trạng thái")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Lấy danh sách thành công"),
            @ApiResponse(responseCode = "401", description = "Chưa đăng nhập"),
            @ApiResponse(responseCode = "403", description = "Không có quyền truy cập")
    })
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'WAREHOUSE')")
    public ResponseEntity<List<PurchaseOrderResponse>> getAll(
            @RequestParam(required = false) java.util.UUID supplierId,
            @RequestParam(required = false) String status) {
        return ResponseEntity.ok(purchaseOrderService.getAllPurchaseOrders(supplierId, status));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Lấy đơn nhập kho theo ID")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'WAREHOUSE')")
    public ResponseEntity<PurchaseOrderResponse> getById(
            @Parameter(description = "ID đơn nhập kho", required = true)
            @PathVariable UUID id) {
        return ResponseEntity.ok(purchaseOrderService.getPurchaseOrderById(id));
    }

    @PostMapping
    @Operation(summary = "Tạo đơn nhập kho mới")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'WAREHOUSE')")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Tạo đơn nhập kho thành công"),
            @ApiResponse(responseCode = "400", description = "Dữ liệu đầu vào không hợp lệ")
    })
    public ResponseEntity<PurchaseOrderResponse> create(
            @Parameter(description = "Thông tin đơn nhập kho mới", required = true)
            @Valid @RequestBody PurchaseOrderRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(purchaseOrderService.createPurchaseOrder(request));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Cập nhật đơn nhập kho")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<PurchaseOrderResponse> update(
            @Parameter(description = "ID đơn nhập kho cần cập nhật", required = true)
            @PathVariable UUID id,
            @Parameter(description = "Thông tin đơn nhập kho cần cập nhật", required = true)
            @Valid @RequestBody PurchaseOrderRequest request) {
        return ResponseEntity.ok(purchaseOrderService.updatePurchaseOrder(id, request));
    }

    @PostMapping("/{id}/receive")
    @Operation(summary = "Nhận hàng vào kho từ đơn nhập")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'WAREHOUSE')")
    public ResponseEntity<PurchaseOrderResponse> receive(
            @Parameter(description = "ID đơn nhập kho cần nhận hàng", required = true)
            @PathVariable UUID id) {
        return ResponseEntity.ok(purchaseOrderService.receivePurchaseOrder(id));
    }
}
