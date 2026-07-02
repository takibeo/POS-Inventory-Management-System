package com.pos.controller;

import com.pos.dto.request.SupplierRequest;
import com.pos.dto.response.SupplierResponse;
import com.pos.service.SupplierService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/suppliers")
@Tag(name = "Suppliers", description = "Quản lý nhà cung cấp")
public class SupplierController {

    private final SupplierService supplierService;

    public SupplierController(SupplierService supplierService) {
        this.supplierService = supplierService;
    }

    @GetMapping
    @Operation(summary = "Lấy danh sách nhà cung cấp", description = "Trả về danh sách nhà cung cấp có phân trang")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Lấy danh sách thành công"),
            @ApiResponse(responseCode = "401", description = "Chưa đăng nhập")
    })
    public ResponseEntity<Page<SupplierResponse>> getAll(
            @PageableDefault(size = 50, sort = "name", direction = Sort.Direction.ASC) Pageable pageable) {
        return ResponseEntity.ok(supplierService.getAllSuppliers(pageable));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Lấy nhà cung cấp theo ID")
    public ResponseEntity<SupplierResponse> getById(
            @Parameter(description = "ID nhà cung cấp", required = true)
            @PathVariable("id") UUID id) {
        return ResponseEntity.ok(supplierService.getSupplierById(id));
    }

    @PostMapping
    @Operation(summary = "Tạo nhà cung cấp mới")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Tạo nhà cung cấp thành công"),
            @ApiResponse(responseCode = "400", description = "Dữ liệu đầu vào không hợp lệ")
    })
    public ResponseEntity<SupplierResponse> create(
            @Parameter(description = "Thông tin nhà cung cấp mới", required = true)
            @Valid @RequestBody SupplierRequest request) {
        return ResponseEntity.ok(supplierService.createSupplier(request));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Cập nhật nhà cung cấp")
    public ResponseEntity<SupplierResponse> update(
            @Parameter(description = "ID nhà cung cấp cần cập nhật", required = true)
            @PathVariable("id") UUID id,
            @Parameter(description = "Thông tin cập nhật nhà cung cấp", required = true)
            @Valid @RequestBody SupplierRequest request) {
        return ResponseEntity.ok(supplierService.updateSupplier(id, request));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Xóa nhà cung cấp")
    public ResponseEntity<Void> delete(
            @Parameter(description = "ID nhà cung cấp cần xóa", required = true)
            @PathVariable("id") UUID id) {
        supplierService.deleteSupplier(id);
        return ResponseEntity.noContent().build();
    }
}
