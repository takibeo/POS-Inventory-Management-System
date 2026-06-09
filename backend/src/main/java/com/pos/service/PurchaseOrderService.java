package com.pos.service;

import com.pos.dto.request.PurchaseOrderRequest;
import com.pos.dto.response.PurchaseOrderResponse;

import java.util.List;
import java.util.UUID;

public interface PurchaseOrderService {
    List<PurchaseOrderResponse> getAllPurchaseOrders();
    PurchaseOrderResponse getPurchaseOrderById(UUID id);
    PurchaseOrderResponse createPurchaseOrder(PurchaseOrderRequest purchaseOrderRequest);
    PurchaseOrderResponse updatePurchaseOrder(UUID id, PurchaseOrderRequest purchaseOrderRequest);
    PurchaseOrderResponse receivePurchaseOrder(UUID id);
}
