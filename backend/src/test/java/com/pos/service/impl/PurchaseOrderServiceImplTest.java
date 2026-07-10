package com.pos.service.impl;

import com.pos.dto.request.PurchaseOrderItemRequest;
import com.pos.dto.request.PurchaseOrderRequest;
import com.pos.entity.*;
import com.pos.exception.BusinessException;
import com.pos.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PurchaseOrderServiceImplTest {

    @Mock private PurchaseOrderRepository purchaseOrderRepository;
    @Mock private SupplierRepository supplierRepository;
    @Mock private BranchRepository branchRepository;
    @Mock private UserRepository userRepository;
    @Mock private ProductRepository productRepository;
    @Mock private InventoryRepository inventoryRepository;
    @Mock private InventoryTransactionRepository transactionRepository;

    private PurchaseOrderServiceImpl poService;

    @BeforeEach
    void setUp() {
        poService = new PurchaseOrderServiceImpl(purchaseOrderRepository, supplierRepository, branchRepository,
                userRepository, productRepository, inventoryRepository, transactionRepository);
    }

    @Test
    void createPurchaseOrderSuccess() {
        UUID supId = UUID.randomUUID(); UUID branchId = UUID.randomUUID(); UUID prodId = UUID.randomUUID();
        Supplier sup = new Supplier(); sup.setId(supId);
        Branch branch = new Branch(); branch.setId(branchId);
        Product product = new Product(); product.setId(prodId);

        when(supplierRepository.findById(supId)).thenReturn(Optional.of(sup));
        when(branchRepository.findById(branchId)).thenReturn(Optional.of(branch));
        when(productRepository.findById(prodId)).thenReturn(Optional.of(product));
        when(purchaseOrderRepository.save(any())).thenAnswer(i -> i.getArgument(0));

        PurchaseOrderItemRequest item = new PurchaseOrderItemRequest(); item.setProductId(prodId); item.setQuantity(3); item.setCost(10.0);
        PurchaseOrderRequest req = new PurchaseOrderRequest(); req.setSupplierId(supId); req.setBranchId(branchId); req.setItems(List.of(item));

        var resp = poService.createPurchaseOrder(req);
        assertNotNull(resp);
        assertEquals("SUBMITTED", resp.getStatus());
        verify(purchaseOrderRepository).save(any());
    }

    @Test
    void receivePurchaseOrderReceivedStatusStillThrows() {
        UUID poId = UUID.randomUUID();
        PurchaseOrder existing = new PurchaseOrder(); existing.setId(poId); existing.setStatus("RECEIVED");
        when(purchaseOrderRepository.findById(poId)).thenReturn(Optional.of(existing));
        assertThrows(BusinessException.class, () -> poService.receivePurchaseOrder(poId));
    }

    @Test
    void receivePurchaseOrderDraftStatusCanBeReceived() {
        UUID poId = UUID.randomUUID();
        UUID branchId = UUID.randomUUID();
        UUID productId = UUID.randomUUID();

        PurchaseOrder existing = new PurchaseOrder();
        existing.setId(poId);
        existing.setStatus("DRAFT");
        Branch branch = new Branch();
        branch.setId(branchId);
        existing.setBranch(branch);
        existing.setItems(new HashSet<>());

        PurchaseOrderItem item = new PurchaseOrderItem();
        Product product = new Product();
        product.setId(productId);
        item.setProduct(product);
        item.setQuantity(3);
        existing.getItems().add(item);

        Inventory inventory = new Inventory();
        inventory.setQuantity(0);
        inventory.setAvailableQuantity(0);

        when(purchaseOrderRepository.findById(poId)).thenReturn(Optional.of(existing));
        when(purchaseOrderRepository.save(any())).thenAnswer(i -> i.getArgument(0));
        when(inventoryRepository.findByBranchIdAndProductId(branchId, productId)).thenReturn(Optional.of(inventory));
        when(inventoryRepository.save(any())).thenAnswer(i -> i.getArgument(0));
        when(transactionRepository.save(any())).thenAnswer(i -> i.getArgument(0));

        assertDoesNotThrow(() -> poService.receivePurchaseOrder(poId));
    }

    @Test
    void getAllPurchaseOrdersWithFiltersReturnsList() {
        when(purchaseOrderRepository.findAll()).thenReturn(java.util.List.of(new PurchaseOrder()));
        var res = poService.getAllPurchaseOrders(null, null);
        assertNotNull(res);
        assertFalse(res.isEmpty());
    }

    @Test
    void getPurchaseOrderByIdNotFoundThrows() {
        UUID id = UUID.randomUUID();
        when(purchaseOrderRepository.findById(id)).thenReturn(Optional.empty());
        assertThrows(RuntimeException.class, () -> poService.getPurchaseOrderById(id));
    }
}
