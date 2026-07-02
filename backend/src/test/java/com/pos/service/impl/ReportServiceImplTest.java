package com.pos.service.impl;

import com.pos.dto.response.BestSellerReportResponse;
import com.pos.dto.response.LowStockReportResponse;
import com.pos.dto.response.ProfitReportResponse;
import com.pos.dto.response.RevenueReportResponse;
import com.pos.entity.*;
import com.pos.repository.InventoryRepository;
import com.pos.repository.SaleInvoiceRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ReportServiceImplTest {

    private SaleInvoiceRepository saleInvoiceRepository;
    private InventoryRepository inventoryRepository;
    private ReportServiceImpl reportService;

    @BeforeEach
    void setUp() {
        saleInvoiceRepository = mock(SaleInvoiceRepository.class);
        inventoryRepository = mock(InventoryRepository.class);
        reportService = new ReportServiceImpl(saleInvoiceRepository, inventoryRepository);
    }

    @Test
    void revenueReport_calculatesTotals() {
        SaleInvoice invoice = new SaleInvoice();
        invoice.setTotalAmount(200.0);
        invoice.setTax(10.0);
        invoice.setDiscount(5.0);

        SaleInvoiceItem item = new SaleInvoiceItem();
        item.setQuantity(2);
        invoice.setItems(java.util.Set.of(item));

        when(saleInvoiceRepository.findAll()).thenReturn(List.of(invoice));

        RevenueReportResponse resp = reportService.getRevenueReport();

        assertEquals(200.0, resp.getTotalRevenue());
        assertEquals(10.0, resp.getTotalTax());
        assertEquals(5.0, resp.getTotalDiscount());
        assertEquals(1, resp.getTotalOrders());
        assertEquals(2, resp.getTotalItems());
    }

    @Test
    void profitReport_calculatesProfit() {
        SaleInvoice invoice = new SaleInvoice();
        SaleInvoiceItem item = new SaleInvoiceItem();
        Product p = new Product();
        p.setCost(50.0);
        item.setProduct(p);
        item.setQuantity(2);
        item.setUnitPrice(100.0);
        invoice.setItems(java.util.Set.of(item));

        when(saleInvoiceRepository.findAll()).thenReturn(List.of(invoice));

        ProfitReportResponse resp = reportService.getProfitReport();

        assertEquals(200.0, resp.getTotalRevenue());
        assertEquals(100.0, resp.getTotalCost());
        assertEquals(100.0, resp.getTotalProfit());
        assertEquals(1, resp.getTotalOrders());
    }

    @Test
    void bestSellers_aggregates() {
        SaleInvoice invoice = new SaleInvoice();
        SaleInvoiceItem item = new SaleInvoiceItem();
        Product p = new Product();
        p.setId(java.util.UUID.randomUUID());
        p.setName("Prod A");
        p.setCost(10.0);
        item.setProduct(p);
        item.setQuantity(3);
        item.setUnitPrice(20.0);
        invoice.setItems(java.util.Set.of(item));

        when(saleInvoiceRepository.findAll()).thenReturn(List.of(invoice));

        List<BestSellerReportResponse> list = reportService.getBestSellers(10);
        assertEquals(1, list.size());
        BestSellerReportResponse first = list.get(0);
        // productId is UUID - just ensure name and quantity
        assertEquals("Prod A", first.getProductName());
        assertEquals(3, first.getQuantitySold());
        assertEquals(60.0, first.getTotalRevenue());
    }

    @Test
    void bestSellers_returnsEmptyWhenLimitIsNotPositive() {
        SaleInvoice invoice = new SaleInvoice();
        SaleInvoiceItem item = new SaleInvoiceItem();
        Product p = new Product();
        p.setId(java.util.UUID.randomUUID());
        p.setName("Prod A");
        p.setCost(10.0);
        item.setProduct(p);
        item.setQuantity(3);
        item.setUnitPrice(20.0);
        invoice.setItems(java.util.Set.of(item));

        when(saleInvoiceRepository.findAll()).thenReturn(List.of(invoice));

        List<BestSellerReportResponse> result = reportService.getBestSellers(-1);

        assertTrue(result.isEmpty());
    }

    @Test
    void lowStock_returnsInventoriesBelowReorder() {
        Inventory inv = new Inventory();
        Product p = new Product();
        p.setId(java.util.UUID.randomUUID());
        p.setName("Prod B");
        p.setReorderLevel(5);
        inv.setProduct(p);
        Branch b = new Branch();
        b.setId(java.util.UUID.randomUUID());
        b.setName("Main");
        inv.setBranch(b);
        inv.setAvailableQuantity(3);

        when(inventoryRepository.findAll()).thenReturn(List.of(inv));

        List<LowStockReportResponse> res = reportService.getLowStockReport();
        assertEquals(1, res.size());
        LowStockReportResponse r = res.get(0);
        // branchId is UUID - verify name instead
        assertEquals("Prod B", r.getProductName());
        assertEquals(3, r.getAvailableQuantity());
    }
}
