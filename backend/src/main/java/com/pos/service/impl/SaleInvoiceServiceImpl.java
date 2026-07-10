package com.pos.service.impl;

import lombok.extern.slf4j.Slf4j;

import com.pos.dto.request.SaleInvoiceItemRequest;
import com.pos.dto.request.SaleInvoiceRequest;
import com.pos.dto.response.SaleInvoiceResponse;
import com.pos.entity.*;
import com.pos.exception.BusinessException;
import com.pos.exception.ResourceNotFoundException;
import com.pos.mapper.SaleInvoiceMapper;
import com.pos.repository.*;
import com.pos.service.SaleInvoiceService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
@Transactional
@Slf4j
public class SaleInvoiceServiceImpl implements SaleInvoiceService {

    private final SaleInvoiceRepository saleInvoiceRepository;
    private final BranchRepository branchRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final InventoryRepository inventoryRepository;
    private final InventoryTransactionRepository transactionRepository;

    public SaleInvoiceServiceImpl(SaleInvoiceRepository saleInvoiceRepository,
                                  BranchRepository branchRepository,
                                  UserRepository userRepository,
                                  ProductRepository productRepository,
                                  InventoryRepository inventoryRepository,
                                  InventoryTransactionRepository transactionRepository) {
        this.saleInvoiceRepository = saleInvoiceRepository;
        this.branchRepository = branchRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
        this.inventoryRepository = inventoryRepository;
        this.transactionRepository = transactionRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<SaleInvoiceResponse> getAllSales(java.util.UUID branchId, String status) {
        log.info("SaleInvoiceService.getAllSales called branchId={} status={}", branchId, status);
        return saleInvoiceRepository.findAllWithItems().stream()
                .filter(s -> branchId == null || (s.getBranch() != null && branchId.equals(s.getBranch().getId())))
                .filter(s -> status == null || status.isBlank() || status.equalsIgnoreCase(s.getStatus()))
                .map(SaleInvoiceMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public SaleInvoiceResponse getSaleById(UUID id) {
        log.info("SaleInvoiceService.getSaleById id={}", id);
        return SaleInvoiceMapper.toResponse(saleInvoiceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Sale invoice not found")));
    }

    @Override
    public SaleInvoiceResponse createSale(SaleInvoiceRequest request) {
        log.info("SaleInvoiceService.createSale branchId={} cashierId={}", request.getBranchId(), request.getCashierId());
        Branch branch = branchRepository.findById(request.getBranchId())
                .orElseThrow(() -> new ResourceNotFoundException("Branch not found"));
        User cashier = userRepository.findById(request.getCashierId())
                .orElseThrow(() -> new ResourceNotFoundException("Cashier not found"));

        SaleInvoice saleInvoice = new SaleInvoice();
        saleInvoice.setId(UUID.randomUUID());
        saleInvoice.setInvoiceNumber(generateInvoiceNumber());
        saleInvoice.setBranch(branch);
        saleInvoice.setCashier(cashier);
        saleInvoice.setCustomerName(request.getCustomerName());
        saleInvoice.setStatus("COMPLETED");
        saleInvoice.setPaymentMethod(request.getPaymentMethod());
        saleInvoice.setTax(request.getTax() != null ? request.getTax() : 0.0);
        saleInvoice.setDiscount(request.getDiscount() != null ? request.getDiscount() : 0.0);
        saleInvoice.setAmountPaid(request.getAmountPaid());
        saleInvoice.setCreatedAt(Instant.now());

        double itemsTotal = 0.0;

        for (SaleInvoiceItemRequest itemRequest : request.getItems()) {
            Product product = productRepository.findById(itemRequest.getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

            Inventory inventory = inventoryRepository
                    .findByBranchIdAndProductId(branch.getId(), product.getId())
                    .orElseThrow(() -> new BusinessException("INVENTORY_NOT_FOUND", "Không tìm thấy tồn kho cho sản phẩm ở chi nhánh này"));

            int quantity = itemRequest.getQuantity();
            double unitPrice = itemRequest.getUnitPrice();
            double discount = itemRequest.getDiscount() != null ? itemRequest.getDiscount() : 0.0;
            int available = inventory.getAvailableQuantity() != null ? inventory.getAvailableQuantity() : (inventory.getQuantity() != null ? inventory.getQuantity() : 0);

            if (available < quantity) {
                throw new BusinessException("INSUFFICIENT_STOCK", "Tồn kho không đủ cho sản phẩm: " + product.getName());
            }

            double subtotal = quantity * unitPrice - discount;
            if (subtotal < 0) {
                throw new BusinessException("INVALID_ITEM_TOTAL", "Tổng giá trị mặt hàng không hợp lệ");
            }

            inventory.setQuantity((inventory.getQuantity() != null ? inventory.getQuantity() : 0) - quantity);
            inventory.setAvailableQuantity(available - quantity);
            inventory.setLastUpdated(Instant.now());
            inventoryRepository.save(inventory);

            SaleInvoiceItem item = new SaleInvoiceItem();
            item.setId(UUID.randomUUID());
            item.setSaleInvoice(saleInvoice);
            item.setProduct(product);
            item.setQuantity(quantity);
            item.setUnitPrice(unitPrice);
            item.setDiscount(discount);
            item.setSubtotal(subtotal);
            item.setCreatedAt(Instant.now());
            saleInvoice.getItems().add(item);

            InventoryTransaction transaction = new InventoryTransaction();
            transaction.setId(UUID.randomUUID());
            transaction.setInventory(inventory);
            // Use allowed DB values: OUT for outgoing stock (sale)
            transaction.setTransactionType("OUT");
            transaction.setQuantity(-quantity);
            transaction.setRemark("Giảm tồn kho do bán hàng");
            transaction.setReferenceId(saleInvoice.getId());
            transaction.setCreatedBy(cashier);
            transaction.setCreatedAt(Instant.now());
            transactionRepository.save(transaction);

            itemsTotal += subtotal;
        }

        double totalAmount = itemsTotal + saleInvoice.getTax() - saleInvoice.getDiscount();
        if (totalAmount < 0) {
            throw new BusinessException("INVALID_TOTAL_AMOUNT", "Tổng tiền hoá đơn không hợp lệ");
        }
        saleInvoice.setTotalAmount(totalAmount);

        if (saleInvoice.getAmountPaid() != null && saleInvoice.getAmountPaid() < totalAmount) {
            throw new BusinessException("INSUFFICIENT_PAYMENT", "Số tiền thanh toán nhỏ hơn tổng tiền hoá đơn");
        }

        if (saleInvoice.getAmountPaid() != null) {
            saleInvoice.setChangeAmount(saleInvoice.getAmountPaid() - totalAmount);
        }

        return SaleInvoiceMapper.toResponse(saleInvoiceRepository.save(saleInvoice));
    }

    @Override
    public void deleteSale(UUID id) {
        log.info("SaleInvoiceService.deleteSale id={}", id);
        if (!saleInvoiceRepository.existsById(id)) {
            throw new ResourceNotFoundException("Sale invoice not found");
        }
        saleInvoiceRepository.deleteById(id);
    }

    private String generateInvoiceNumber() {
        return "INV-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
}
