package com.pos.mapper;

import com.pos.dto.response.PurchaseOrderItemResponse;
import com.pos.dto.response.PurchaseOrderResponse;
import com.pos.entity.PurchaseOrder;
import com.pos.entity.PurchaseOrderItem;

import java.util.stream.Collectors;

public class PurchaseOrderMapper {

    public static PurchaseOrderResponse toResponse(PurchaseOrder order) {
        if (order == null) {
            return null;
        }

        PurchaseOrderResponse response = new PurchaseOrderResponse();
        response.setId(order.getId());
        response.setOrderNumber(order.getOrderNumber());
        response.setSupplierId(order.getSupplier() != null ? order.getSupplier().getId() : null);
        response.setSupplierName(order.getSupplier() != null ? order.getSupplier().getName() : null);
        response.setBranchId(order.getBranch() != null ? order.getBranch().getId() : null);
        response.setBranchName(order.getBranch() != null ? order.getBranch().getName() : null);
        response.setStatus(order.getStatus());
        response.setOrderedDate(order.getOrderedDate());
        response.setReceivedDate(order.getReceivedDate());
        response.setTotalAmount(order.getTotalAmount());
        response.setCreatedById(order.getCreatedBy() != null ? order.getCreatedBy().getId() : null);
        response.setCreatedByName(order.getCreatedBy() != null ? order.getCreatedBy().getFullName() : null);
        response.setApprovedById(order.getApprovedBy() != null ? order.getApprovedBy().getId() : null);
        response.setApprovedByName(order.getApprovedBy() != null ? order.getApprovedBy().getFullName() : null);
        response.setNotes(order.getNotes());
        response.setCreatedAt(order.getCreatedAt());
        response.setUpdatedAt(order.getUpdatedAt());
        response.setItems(order.getItems().stream()
                .map(PurchaseOrderMapper::toItemResponse)
                .collect(Collectors.toList()));
        return response;
    }

    public static PurchaseOrderItemResponse toItemResponse(PurchaseOrderItem item) {
        if (item == null) {
            return null;
        }

        PurchaseOrderItemResponse response = new PurchaseOrderItemResponse();
        response.setProductId(item.getProduct() != null ? item.getProduct().getId() : null);
        response.setProductName(item.getProduct() != null ? item.getProduct().getName() : null);
        response.setQuantity(item.getQuantity());
        response.setCost(item.getCost());
        response.setSubtotal(item.getSubtotal());
        return response;
    }
}
