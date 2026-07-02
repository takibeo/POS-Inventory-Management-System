package com.pos.controller;

import com.pos.dto.request.CategoryRequest;
import com.pos.dto.response.CategoryResponse;
import com.pos.service.CategoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
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
    @Operation(summary = "Lấy danh sách danh mục (có phân trang)", description = "Trả về danh sách danh mục có phân trang, dùng cho màn hình quản lý sản phẩm")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Lấy danh sách thành công"),
            @ApiResponse(responseCode = "401", description = "Chưa đăng nhập"),
            @ApiResponse(responseCode = "403", description = "Không có quyền truy cập")
    })
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
            @Parameter(description = "ID danh mục", required = true)
            @PathVariable UUID id) {
        return ResponseEntity.ok(categoryService.getCategoryById(id));
    }

    @PostMapping
    @Operation(summary = "Tạo danh mục mới")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Tạo danh mục thành công"),
            @ApiResponse(responseCode = "400", description = "Dữ liệu đầu vào không hợp lệ"),
            @ApiResponse(responseCode = "422", description = "Tên danh mục bị trùng")
    })
    public ResponseEntity<CategoryResponse> create(
            @Parameter(description = "Thông tin danh mục mới", required = true)
            @Valid @RequestBody CategoryRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(categoryService.createCategory(request));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Cập nhật danh mục")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Cập nhật danh mục thành công"),
            @ApiResponse(responseCode = "400", description = "Dữ liệu đầu vào không hợp lệ"),
            @ApiResponse(responseCode = "404", description = "Không tìm thấy danh mục")
    })
    public ResponseEntity<CategoryResponse> update(
            @Parameter(description = "ID danh mục cần cập nhật", required = true)
            @PathVariable UUID id,
            @Parameter(description = "Thông tin cập nhật danh mục", required = true)
            @Valid @RequestBody CategoryRequest request) {
        return ResponseEntity.ok(
                categoryService.updateCategory(id, request));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Xóa danh mục")
    @PreAuthorize("hasRole('ADMIN')")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Xóa danh mục thành công"),
            @ApiResponse(responseCode = "404", description = "Không tìm thấy danh mục")
    })
    public ResponseEntity<Void> delete(
            @Parameter(description = "ID danh mục cần xóa", required = true)
            @PathVariable UUID id) {
        categoryService.deleteCategory(id);
        return ResponseEntity.noContent().build();
    }
}