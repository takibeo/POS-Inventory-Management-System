package com.pos.service.impl;

import lombok.extern.slf4j.Slf4j;

import com.pos.dto.request.PurchaseOrderItemRequest;
import com.pos.dto.request.PurchaseOrderRequest;
import com.pos.dto.response.PurchaseOrderResponse;
import com.pos.entity.*;
import com.pos.exception.BusinessException;
import com.pos.exception.ResourceNotFoundException;
import com.pos.mapper.PurchaseOrderMapper;
import com.pos.repository.*;
import com.pos.service.PurchaseOrderService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
@Transactional
@Slf4j
public class PurchaseOrderServiceImpl implements PurchaseOrderService {

    private final PurchaseOrderRepository purchaseOrderRepository;
    private final SupplierRepository supplierRepository;
    private final BranchRepository branchRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final InventoryRepository inventoryRepository;
    private final InventoryTransactionRepository transactionRepository;

    public PurchaseOrderServiceImpl(PurchaseOrderRepository purchaseOrderRepository,
                                    SupplierRepository supplierRepository,
                                    BranchRepository branchRepository,
                                    UserRepository userRepository,
                                    ProductRepository productRepository,
                                    InventoryRepository inventoryRepository,
                                    InventoryTransactionRepository transactionRepository) {
        this.purchaseOrderRepository = purchaseOrderRepository;
        this.supplierRepository = supplierRepository;
        this.branchRepository = branchRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
        this.inventoryRepository = inventoryRepository;
        this.transactionRepository = transactionRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<PurchaseOrderResponse> getAllPurchaseOrders(java.util.UUID supplierId, String status) {
        log.info("PurchaseOrderService.getAllPurchaseOrders called supplierId={} status={}", supplierId, status);
        return purchaseOrderRepository.findAll().stream()
                .filter(po -> supplierId == null || (po.getSupplier() != null && supplierId.equals(po.getSupplier().getId())))
                .filter(po -> status == null || status.isBlank() || status.equalsIgnoreCase(po.getStatus()))
                .map(PurchaseOrderMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public PurchaseOrderResponse getPurchaseOrderById(UUID id) {
        log.info("PurchaseOrderService.getPurchaseOrderById id={}", id);
        return PurchaseOrderMapper.toResponse(purchaseOrderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Purchase order not found")));
    }

    @Override
    public PurchaseOrderResponse createPurchaseOrder(PurchaseOrderRequest request) {
        log.info("PurchaseOrderService.createPurchaseOrder supplierId={} branchId={}", request.getSupplierId(), request.getBranchId());
        Supplier supplier = supplierRepository.findById(request.getSupplierId())
                .orElseThrow(() -> new ResourceNotFoundException("Supplier not found"));
        Branch branch = branchRepository.findById(request.getBranchId())
                .orElseThrow(() -> new ResourceNotFoundException("Branch not found"));

        PurchaseOrder purchaseOrder = new PurchaseOrder();
        purchaseOrder.setId(UUID.randomUUID());
        purchaseOrder.setOrderNumber(generateOrderNumber());
        purchaseOrder.setSupplier(supplier);
        purchaseOrder.setBranch(branch);
        purchaseOrder.setStatus(request.getStatus() != null ? request.getStatus().toUpperCase() : "DRAFT");
        purchaseOrder.setNotes(request.getNotes());
        purchaseOrder.setOrderedDate(LocalDate.now());
        purchaseOrder.setCreatedAt(Instant.now());
        purchaseOrder.setUpdatedAt(Instant.now());

        if (request.getApprovedById() != null) {
            User approvedBy = userRepository.findById(request.getApprovedById())
                    .orElseThrow(() -> new ResourceNotFoundException("Approved by user not found"));
            purchaseOrder.setApprovedBy(approvedBy);
        }

        double totalAmount = 0.0;
        for (PurchaseOrderItemRequest itemRequest : request.getItems()) {
            Product product = productRepository.findById(itemRequest.getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

            PurchaseOrderItem item = new PurchaseOrderItem();
            item.setId(UUID.randomUUID());
            item.setPurchaseOrder(purchaseOrder);
            item.setProduct(product);
            item.setQuantity(itemRequest.getQuantity());
            item.setCost(itemRequest.getCost());
            item.setSubtotal(itemRequest.getQuantity() * itemRequest.getCost());
            item.setCreatedAt(Instant.now());
            purchaseOrder.getItems().add(item);
            totalAmount += item.getSubtotal();
        }

        purchaseOrder.setTotalAmount(totalAmount);

        return PurchaseOrderMapper.toResponse(purchaseOrderRepository.save(purchaseOrder));
    }

    @Override
    public PurchaseOrderResponse updatePurchaseOrder(UUID id, PurchaseOrderRequest request) {
        log.info("PurchaseOrderService.updatePurchaseOrder id={}", id);
        PurchaseOrder existing = purchaseOrderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Purchase order not found"));

        if (request.getStatus() != null) {
            existing.setStatus(request.getStatus().toUpperCase());
        }
        if (request.getNotes() != null) {
            existing.setNotes(request.getNotes());
        }
        if (request.getApprovedById() != null) {
            User approvedBy = userRepository.findById(request.getApprovedById())
                    .orElseThrow(() -> new ResourceNotFoundException("Approved by user not found"));
            existing.setApprovedBy(approvedBy);
        }

        if (!existing.getItems().isEmpty() && !request.getItems().isEmpty()) {
            existing.getItems().clear();
            double totalAmount = 0.0;
            for (PurchaseOrderItemRequest itemRequest : request.getItems()) {
                Product product = productRepository.findById(itemRequest.getProductId())
                        .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

                PurchaseOrderItem item = new PurchaseOrderItem();
                item.setId(UUID.randomUUID());
                item.setPurchaseOrder(existing);
                item.setProduct(product);
                item.setQuantity(itemRequest.getQuantity());
                item.setCost(itemRequest.getCost());
                item.setSubtotal(itemRequest.getQuantity() * itemRequest.getCost());
                item.setCreatedAt(Instant.now());
                existing.getItems().add(item);
                totalAmount += item.getSubtotal();
            }
            existing.setTotalAmount(totalAmount);
        }

        existing.setUpdatedAt(Instant.now());
        return PurchaseOrderMapper.toResponse(purchaseOrderRepository.save(existing));
    }

    @Override
    public PurchaseOrderResponse receivePurchaseOrder(UUID id) {
        log.info("PurchaseOrderService.receivePurchaseOrder id={}", id);
        PurchaseOrder existing = purchaseOrderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Purchase order not found"));

        if (!"SUBMITTED".equalsIgnoreCase(existing.getStatus())) {
            throw new BusinessException("INVALID_ORDER_STATUS", "Chỉ đơn đã gửi mới được nhận hàng");
        }

        existing.setStatus("RECEIVED");
        existing.setReceivedDate(LocalDate.now());
        existing.setUpdatedAt(Instant.now());

        for (PurchaseOrderItem item : existing.getItems()) {
            Inventory inventory = inventoryRepository.findByBranchIdAndProductId(existing.getBranch().getId(), item.getProduct().getId())
                    .orElseGet(() -> createInventoryForBranchProduct(existing.getBranch(), item.getProduct()));

            inventory.setQuantity((inventory.getQuantity() != null ? inventory.getQuantity() : 0) + item.getQuantity());
            inventory.setAvailableQuantity((inventory.getAvailableQuantity() != null ? inventory.getAvailableQuantity() : 0) + item.getQuantity());
            inventory.setLastUpdated(Instant.now());
            inventoryRepository.save(inventory);

            InventoryTransaction transaction = new InventoryTransaction();
            transaction.setId(UUID.randomUUID());
            transaction.setInventory(inventory);
            transaction.setTransactionType("PURCHASE_RECEIPT");
            transaction.setQuantity(item.getQuantity());
            transaction.setRemark("Nhận hàng từ đơn nhập kho " + existing.getOrderNumber());
            transaction.setReferenceId(existing.getId());
            transaction.setCreatedAt(Instant.now());
            transactionRepository.save(transaction);
        }

        return PurchaseOrderMapper.toResponse(purchaseOrderRepository.save(existing));
    }

    private Inventory createInventoryForBranchProduct(Branch branch, Product product) {
        Inventory inventory = new Inventory();
        inventory.setId(UUID.randomUUID());
        inventory.setBranch(branch);
        inventory.setProduct(product);
        inventory.setQuantity(0);
        inventory.setAvailableQuantity(0);
        inventory.setLastUpdated(Instant.now());
        return inventory;
    }

    private String generateOrderNumber() {
        return "PO-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
}
