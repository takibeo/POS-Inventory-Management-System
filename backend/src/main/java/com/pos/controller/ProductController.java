package com.pos.controller;

import com.pos.dto.request.ProductRequest;
import com.pos.dto.response.ProductResponse;
import com.pos.service.ProductService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/products")
@Tag(name = "Products", description = "Quản lý sản phẩm")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    @Operation(summary = "Lấy danh sách sản phẩm (có phân trang, lọc)")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'CASHIER', 'WAREHOUSE')")
    public ResponseEntity<Page<ProductResponse>> getAll(
            @Parameter(description = "Lọc theo ID danh mục")
            @RequestParam(required = false) UUID categoryId,

            @Parameter(description = "Lọc theo trạng thái hoạt động")
            @RequestParam(required = false) Boolean isActive,

            @PageableDefault(size = 20, sort = "name",
                    direction = Sort.Direction.ASC)
            Pageable pageable) {

        return ResponseEntity.ok(
                productService.getAllProducts(categoryId, isActive, pageable));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Lấy chi tiết sản phẩm theo ID")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'CASHIER', 'WAREHOUSE')")
    public ResponseEntity<ProductResponse> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }

    @GetMapping("/search")
    @Operation(summary = "Tìm kiếm sản phẩm theo tên hoặc SKU")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'CASHIER', 'WAREHOUSE')")
    public ResponseEntity<Page<ProductResponse>> search(
            @RequestParam(required = false) String q,
            @PageableDefault(size = 20, sort = "name") Pageable pageable) {
        return ResponseEntity.ok(productService.searchProducts(q, pageable));
    }

    @PostMapping
    @Operation(summary = "Tạo sản phẩm mới")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<ProductResponse> create(
            @Valid @RequestBody ProductRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(productService.createProduct(request));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Cập nhật sản phẩm")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<ProductResponse> update(
            @PathVariable UUID id,
            @Valid @RequestBody ProductRequest request) {
        return ResponseEntity.ok(productService.updateProduct(id, request));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Xóa sản phẩm")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }
}