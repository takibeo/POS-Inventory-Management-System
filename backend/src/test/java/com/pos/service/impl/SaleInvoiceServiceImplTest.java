package com.pos.service.impl;

import com.pos.dto.request.SaleInvoiceItemRequest;
import com.pos.dto.request.SaleInvoiceRequest;
import com.pos.entity.*;
import com.pos.exception.BusinessException;
import com.pos.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SaleInvoiceServiceImplTest {

    @Mock private SaleInvoiceRepository saleInvoiceRepository;
    @Mock private BranchRepository branchRepository;
    @Mock private UserRepository userRepository;
    @Mock private ProductRepository productRepository;
    @Mock private InventoryRepository inventoryRepository;
    @Mock private InventoryTransactionRepository transactionRepository;

    private SaleInvoiceServiceImpl saleService;

    @BeforeEach
    void setUp() {
        saleService = new SaleInvoiceServiceImpl(saleInvoiceRepository, branchRepository, userRepository,
                productRepository, inventoryRepository, transactionRepository);
    }

    @Test
    void createSaleSuccess() {
        UUID branchId = UUID.randomUUID();
        UUID cashierId = UUID.randomUUID();
        UUID productId = UUID.randomUUID();

        Branch branch = new Branch(); branch.setId(branchId);
        User cashier = new User(); cashier.setId(cashierId);
        Product product = new Product(); product.setId(productId); product.setName("Prod");
        Inventory inv = new Inventory(); inv.setId(UUID.randomUUID()); inv.setBranch(branch); inv.setProduct(product);
        inv.setQuantity(10); inv.setAvailableQuantity(10);

        when(branchRepository.findById(branchId)).thenReturn(Optional.of(branch));
        when(userRepository.findById(cashierId)).thenReturn(Optional.of(cashier));
        when(productRepository.findById(productId)).thenReturn(Optional.of(product));
        when(inventoryRepository.findByBranchIdAndProductId(branchId, productId)).thenReturn(Optional.of(inv));
        when(inventoryRepository.save(any())).thenAnswer(i -> i.getArgument(0));
        when(transactionRepository.save(any())).thenAnswer(i -> i.getArgument(0));
        when(saleInvoiceRepository.save(any())).thenAnswer(i -> i.getArgument(0));

        SaleInvoiceItemRequest item = new SaleInvoiceItemRequest();
        item.setProductId(productId); item.setQuantity(2); item.setUnitPrice(5.0);
        SaleInvoiceRequest req = new SaleInvoiceRequest();
        req.setBranchId(branchId); req.setCashierId(cashierId); req.setPaymentMethod("CASH");
        req.setItems(List.of(item)); req.setAmountPaid(20.0);

        var resp = saleService.createSale(req);
        assertNotNull(resp);
        verify(inventoryRepository).save(any());
        verify(transactionRepository).save(any());
    }

    @Test
    void createSaleInsufficientStockThrows() {
        UUID branchId = UUID.randomUUID(); UUID cashierId = UUID.randomUUID(); UUID productId = UUID.randomUUID();
        Branch branch = new Branch(); branch.setId(branchId);
        User cashier = new User(); cashier.setId(cashierId);
        Product product = new Product(); product.setId(productId); product.setName("Prod");
        Inventory inv = new Inventory(); inv.setQuantity(1); inv.setAvailableQuantity(1);

        when(branchRepository.findById(branchId)).thenReturn(Optional.of(branch));
        when(userRepository.findById(cashierId)).thenReturn(Optional.of(cashier));
        when(productRepository.findById(productId)).thenReturn(Optional.of(product));
        when(inventoryRepository.findByBranchIdAndProductId(branchId, productId)).thenReturn(Optional.of(inv));

        SaleInvoiceItemRequest item = new SaleInvoiceItemRequest(); item.setProductId(productId); item.setQuantity(5); item.setUnitPrice(5.0);
        SaleInvoiceRequest req = new SaleInvoiceRequest(); req.setBranchId(branchId); req.setCashierId(cashierId); req.setPaymentMethod("CASH"); req.setItems(List.of(item));

        assertThrows(BusinessException.class, () -> saleService.createSale(req));
    }

    @Test
    void getAllSalesWithFiltersReturnsList() {
        when(saleInvoiceRepository.findAll()).thenReturn(java.util.List.of(new com.pos.entity.SaleInvoice()));
        var res = saleService.getAllSales(null, null);
        assertNotNull(res);
        assertFalse(res.isEmpty());
    }

    @Test
    void getSaleByIdNotFoundThrows() {
        UUID id = UUID.randomUUID();
        when(saleInvoiceRepository.findById(id)).thenReturn(Optional.empty());
        assertThrows(RuntimeException.class, () -> saleService.getSaleById(id));
    }
}
