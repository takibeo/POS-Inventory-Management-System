package com.pos.controller;

import com.pos.dto.request.CategoryRequest;
import com.pos.dto.response.CategoryResponse;
import com.pos.service.CategoryService;
import io.swagger.v3.oas.annotations.Operation;
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
@RequestMapping("/api/categories")
@Tag(name = "Categories", description = "Quản lý danh mục sản phẩm")
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @GetMapping
    @Operation(summary = "Lấy danh sách danh mục (có phân trang)")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'CASHIER', 'WAREHOUSE')")
    public ResponseEntity<Page<CategoryResponse>> getAll(
            @PageableDefault(size = 50, sort = "name",
                    direction = Sort.Direction.ASC)
            Pageable pageable) {
        return ResponseEntity.ok(
                categoryService.getAllCategories(pageable));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Lấy danh mục theo ID")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'CASHIER', 'WAREHOUSE')")
    public ResponseEntity<CategoryResponse> getById(
            @PathVariable UUID id) {
        return ResponseEntity.ok(categoryService.getCategoryById(id));
    }

    @PostMapping
    @Operation(summary = "Tạo danh mục mới")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<CategoryResponse> create(
            @Valid @RequestBody CategoryRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(categoryService.createCategory(request));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Cập nhật danh mục")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<CategoryResponse> update(
            @PathVariable UUID id,
            @Valid @RequestBody CategoryRequest request) {
        return ResponseEntity.ok(
                categoryService.updateCategory(id, request));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Xóa danh mục")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        categoryService.deleteCategory(id);
        return ResponseEntity.noContent().build();
    }
}