package com.pos.service;

import com.pos.entity.PurchaseOrder;

import java.util.List;
import java.util.UUID;

public interface PurchaseOrderService {
    List<PurchaseOrder> getAllPurchaseOrders();
    PurchaseOrder getPurchaseOrderById(UUID id);
    PurchaseOrder createPurchaseOrder(PurchaseOrder purchaseOrder);
    PurchaseOrder updatePurchaseOrder(UUID id, PurchaseOrder purchaseOrder);
    PurchaseOrder receivePurchaseOrder(UUID id);
}
