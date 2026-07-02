package com.pos.controller;

import com.pos.dto.request.BranchRequest;
import com.pos.dto.response.BranchResponse;
import com.pos.service.BranchService;
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
@RequestMapping("/api/branches")
@Tag(name = "Branches", description = "Quản lý chi nhánh")
public class BranchController {

    private final BranchService branchService;

    public BranchController(BranchService branchService) {
        this.branchService = branchService;
    }

    @GetMapping
    @Operation(summary = "Lấy danh sách chi nhánh", description = "Trả về danh sách chi nhánh có phân trang")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Lấy danh sách thành công"),
            @ApiResponse(responseCode = "401", description = "Chưa đăng nhập"),
            @ApiResponse(responseCode = "403", description = "Không có quyền truy cập")
    })
    public ResponseEntity<Page<BranchResponse>> getAll(
            @PageableDefault(size = 50, sort = "name", direction = Sort.Direction.ASC) Pageable pageable) {
        return ResponseEntity.ok(branchService.getAllBranches(pageable));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Lấy chi nhánh theo ID")
    public ResponseEntity<BranchResponse> getById(
            @Parameter(description = "ID chi nhánh", required = true)
            @PathVariable("id") UUID id) {
        return ResponseEntity.ok(branchService.getBranchById(id));
    }

    @PostMapping
    @Operation(summary = "Tạo chi nhánh mới")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Tạo chi nhánh thành công"),
            @ApiResponse(responseCode = "400", description = "Dữ liệu đầu vào không hợp lệ")
    })
    public ResponseEntity<BranchResponse> create(
            @Parameter(description = "Thông tin chi nhánh mới", required = true)
            @Valid @RequestBody BranchRequest request) {
        return ResponseEntity.ok(branchService.createBranch(request));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Cập nhật chi nhánh")
    public ResponseEntity<BranchResponse> update(
            @Parameter(description = "ID chi nhánh cần cập nhật", required = true)
            @PathVariable("id") UUID id,
            @Parameter(description = "Thông tin chi nhánh cần cập nhật", required = true)
            @Valid @RequestBody BranchRequest request) {
        return ResponseEntity.ok(branchService.updateBranch(id, request));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Xóa chi nhánh")
    public ResponseEntity<Void> delete(
            @Parameter(description = "ID chi nhánh cần xóa", required = true)
            @PathVariable("id") UUID id) {
        branchService.deleteBranch(id);
        return ResponseEntity.noContent().build();
    }
}
