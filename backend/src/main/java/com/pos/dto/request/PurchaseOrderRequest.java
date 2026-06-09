package com.pos.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class PurchaseOrderRequest {

    @NotNull(message = "Nhà cung cấp không được để trống")
    private UUID supplierId;

    @NotNull(message = "Chi nhánh không được để trống")
    private UUID branchId;

    private String status;
    private UUID approvedById;
    private String notes;

    @NotEmpty(message = "Đơn hàng phải có ít nhất một mặt hàng")
    @Valid
    private List<PurchaseOrderItemRequest> items = new ArrayList<>();

    public PurchaseOrderRequest() {
    }

    public UUID getSupplierId() {
        return supplierId;
    }

    public void setSupplierId(UUID supplierId) {
        this.supplierId = supplierId;
    }

    public UUID getBranchId() {
        return branchId;
    }

    public void setBranchId(UUID branchId) {
        this.branchId = branchId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public UUID getApprovedById() {
        return approvedById;
    }

    public void setApprovedById(UUID approvedById) {
        this.approvedById = approvedById;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public List<PurchaseOrderItemRequest> getItems() {
        return items;
    }

    public void setItems(List<PurchaseOrderItemRequest> items) {
        this.items = items;
    }
}
