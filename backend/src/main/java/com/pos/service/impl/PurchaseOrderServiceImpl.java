package com.pos.service.impl;

import com.pos.entity.PurchaseOrder;
import com.pos.repository.PurchaseOrderRepository;
import com.pos.service.PurchaseOrderService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class PurchaseOrderServiceImpl implements PurchaseOrderService {

    private final PurchaseOrderRepository purchaseOrderRepository;

    public PurchaseOrderServiceImpl(PurchaseOrderRepository purchaseOrderRepository) {
        this.purchaseOrderRepository = purchaseOrderRepository;
    }

    @Override
    public List<PurchaseOrder> getAllPurchaseOrders() {
        return purchaseOrderRepository.findAll();
    }

    @Override
    public PurchaseOrder getPurchaseOrderById(UUID id) {
        return purchaseOrderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Purchase order not found"));
    }

    @Override
    public PurchaseOrder createPurchaseOrder(PurchaseOrder purchaseOrder) {
        return purchaseOrderRepository.save(purchaseOrder);
    }

    @Override
    public PurchaseOrder updatePurchaseOrder(UUID id, PurchaseOrder purchaseOrder) {
        PurchaseOrder existing = getPurchaseOrderById(id);
        existing.setStatus(purchaseOrder.getStatus());
        existing.setNotes(purchaseOrder.getNotes());
        return purchaseOrderRepository.save(existing);
    }

    @Override
    public PurchaseOrder receivePurchaseOrder(UUID id) {
        PurchaseOrder existing = getPurchaseOrderById(id);
        existing.setStatus("RECEIVED");
        return purchaseOrderRepository.save(existing);
    }
}
