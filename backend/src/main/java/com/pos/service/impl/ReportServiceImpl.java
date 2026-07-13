package com.pos.service.impl;

import lombok.extern.slf4j.Slf4j;

import com.pos.dto.response.BestSellerReportResponse;
import com.pos.dto.response.LowStockReportResponse;
import com.pos.dto.response.ProfitReportResponse;
import com.pos.dto.response.RevenueReportResponse;
import com.pos.entity.Inventory;
import com.pos.entity.SaleInvoice;
import com.pos.entity.SaleInvoiceItem;
import com.pos.repository.BranchRepository;
import com.pos.repository.InventoryRepository;
import com.pos.repository.ProductRepository;
import com.pos.repository.SaleInvoiceRepository;
import com.pos.service.ReportService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
@Slf4j
public class ReportServiceImpl implements ReportService {

    private final SaleInvoiceRepository saleInvoiceRepository;
    private final InventoryRepository inventoryRepository;
    private final ProductRepository productRepository;
    private final BranchRepository branchRepository;

    public ReportServiceImpl(SaleInvoiceRepository saleInvoiceRepository,
                             InventoryRepository inventoryRepository,
                             ProductRepository productRepository,
                             BranchRepository branchRepository) {
        this.saleInvoiceRepository = saleInvoiceRepository;
        this.inventoryRepository = inventoryRepository;
        this.productRepository = productRepository;
        this.branchRepository = branchRepository;
    }

    @Override
    public RevenueReportResponse getRevenueReport() {
        log.info("ReportService.getRevenueReport called");
        List<SaleInvoice> invoices = saleInvoiceRepository.findAll();

        double totalRevenue = 0.0;
        double totalTax = 0.0;
        double totalDiscount = 0.0;
        int totalItems = 0;

        for (SaleInvoice invoice : invoices) {
            if (invoice.getTotalAmount() != null) {
                totalRevenue += invoice.getTotalAmount();
            }
            if (invoice.getTax() != null) {
                totalTax += invoice.getTax();
            }
            if (invoice.getDiscount() != null) {
                totalDiscount += invoice.getDiscount();
            }
            if (invoice.getItems() != null) {
                totalItems += invoice.getItems().stream()
                        .mapToInt(SaleInvoiceItem::getQuantity)
                        .sum();
            }
        }

        RevenueReportResponse response = new RevenueReportResponse();
        response.setTotalRevenue(totalRevenue);
        response.setTotalTax(totalTax);
        response.setTotalDiscount(totalDiscount);
        response.setTotalOrders(invoices.size());
        response.setTotalItems(totalItems);
        return response;
    }

    @Override
    public ProfitReportResponse getProfitReport() {
        log.info("ReportService.getProfitReport called");
        List<SaleInvoice> invoices = saleInvoiceRepository.findAll();

        double totalRevenue = 0.0;
        double totalCost = 0.0;

        for (SaleInvoice invoice : invoices) {
            if (invoice.getItems() != null) {
                for (SaleInvoiceItem item : invoice.getItems()) {
                    double revenue = item.getUnitPrice() != null ? item.getUnitPrice() * item.getQuantity() : 0.0;
                    double cost = item.getProduct() != null && item.getProduct().getCost() != null
                            ? item.getProduct().getCost() * item.getQuantity()
                            : 0.0;
                    totalRevenue += revenue;
                    totalCost += cost;
                }
            }
        }

        ProfitReportResponse response = new ProfitReportResponse();
        response.setTotalRevenue(totalRevenue);
        response.setTotalCost(totalCost);
        response.setTotalProfit(totalRevenue - totalCost);
        response.setTotalOrders(invoices.size());
        return response;
    }

    @Override
    public List<BestSellerReportResponse> getBestSellers(int limit) {
        log.info("ReportService.getBestSellers limit={}", limit);
        if (limit <= 0) {
            return List.of();
        }

        Map<String, BestSellerReportResponse> productStats = new HashMap<>();

        saleInvoiceRepository.findAll().stream()
                .flatMap(invoice -> invoice.getItems().stream())
                .forEach(item -> {
                    if (item.getProduct() == null || item.getProduct().getId() == null) {
                        return;
                    }
                    String productKey = item.getProduct().getId().toString();
                    BestSellerReportResponse stats = productStats.computeIfAbsent(productKey, key -> {
                        BestSellerReportResponse response = new BestSellerReportResponse();
                        response.setProductId(item.getProduct().getId());
                        response.setProductName(item.getProduct().getName());
                        response.setQuantitySold(0);
                        response.setTotalRevenue(0.0);
                        response.setTotalProfit(0.0);
                        return response;
                    });

                    int quantity = item.getQuantity() != null ? item.getQuantity() : 0;
                    double revenue = item.getUnitPrice() != null ? item.getUnitPrice() * quantity : 0.0;
                    double cost = item.getProduct() != null && item.getProduct().getCost() != null
                            ? item.getProduct().getCost() * quantity
                            : 0.0;

                    stats.setQuantitySold(stats.getQuantitySold() + quantity);
                    stats.setTotalRevenue(stats.getTotalRevenue() + revenue);
                    stats.setTotalProfit(stats.getTotalProfit() + (revenue - cost));
                });

        return productStats.values().stream()
                .sorted(Comparator.comparing(BestSellerReportResponse::getQuantitySold).reversed())
                .limit(limit)
                .collect(Collectors.toList());
    }

    @Override
    public List<LowStockReportResponse> getLowStockReport() {
        log.info("ReportService.getLowStockReport called");

        Map<String, Inventory> inventoryMap = inventoryRepository.findAll().stream()
                .filter(inventory -> inventory.getProduct() != null && inventory.getBranch() != null)
                .collect(Collectors.toMap(
                        inventory -> inventory.getBranch().getId() + ":" + inventory.getProduct().getId(),
                        inventory -> inventory,
                        (first, second) -> first
                ));

        List<LowStockReportResponse> result = productRepository.findAll().stream()
                .flatMap(product -> branchRepository.findAll().stream()
                        .map(branch -> {
                            String key = branch.getId() + ":" + product.getId();
                            Inventory inventory = inventoryMap.get(key);
                            int available = inventory != null && inventory.getAvailableQuantity() != null ? inventory.getAvailableQuantity() : 0;
                            int reorder = product.getReorderLevel() != null ? product.getReorderLevel() : 0;
                            if (available <= reorder) {
                                LowStockReportResponse response = new LowStockReportResponse();
                                response.setBranchId(branch.getId());
                                response.setBranchName(branch.getName());
                                response.setProductId(product.getId());
                                response.setProductName(product.getName());
                                response.setAvailableQuantity(available);
                                response.setReorderLevel(reorder);
                                return response;
                            }
                            return null;
                        })
                )
                .filter(response -> response != null)
                .collect(Collectors.toList());

        return result;
    }
}
