package com.pos.controller;

import com.pos.dto.response.InventoryResponse;
import com.pos.entity.InventoryTransaction;
import com.pos.service.InventoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/inventories")
@Tag(name = "Inventory", description = "Quản lý tồn kho và lịch sử giao dịch")
public class InventoryController {

    private final InventoryService inventoryService;

    public InventoryController(InventoryService inventoryService) {
        this.inventoryService = inventoryService;
    }

    @GetMapping
    @Operation(summary = "Lấy danh sách tồn kho", description = "Trả về các bản ghi tồn kho hiện có")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Lấy danh sách thành công"),
            @ApiResponse(responseCode = "401", description = "Chưa đăng nhập")
    })
    public ResponseEntity<List<InventoryResponse>> getAll() {
        return ResponseEntity.ok(inventoryService.getAllInventories());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Lấy tồn kho theo ID")
    public ResponseEntity<InventoryResponse> getById(
            @Parameter(description = "ID bản ghi tồn kho", required = true)
            @PathVariable UUID id) {
        return ResponseEntity.ok(inventoryService.getInventoryById(id));
    }

    @PostMapping("/adjust")
    @Operation(summary = "Điều chỉnh tồn kho", description = "Điều chỉnh số lượng tồn kho và tạo giao dịch điều chỉnh")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Điều chỉnh tồn kho thành công"),
            @ApiResponse(responseCode = "400", description = "Tham số không hợp lệ")
    })
    public ResponseEntity<InventoryTransaction> adjust(
            @Parameter(description = "ID bản ghi tồn kho cần điều chỉnh", required = true)
            @RequestParam UUID inventoryId,
            @Parameter(description = "Số lượng thay đổi, có thể âm hoặc dương", required = true)
            @RequestParam int quantity,
            @Parameter(description = "Ghi chú điều chỉnh")
            @RequestParam(required = false) String remark) {
        return ResponseEntity.ok(inventoryService.adjustInventory(inventoryId, quantity, remark));
    }

    @GetMapping("/{branchId}/transactions")
    @Operation(summary = "Lấy lịch sử giao dịch theo chi nhánh")
    public ResponseEntity<List<InventoryTransaction>> getTransactions(
            @Parameter(description = "ID chi nhánh", required = true)
            @PathVariable UUID branchId) {
        return ResponseEntity.ok(inventoryService.getTransactionsByBranch(branchId));
    }
}
