package com.pos.mapper;

import com.pos.dto.response.SaleInvoiceItemResponse;
import com.pos.dto.response.SaleInvoiceResponse;
import com.pos.entity.SaleInvoice;
import com.pos.entity.SaleInvoiceItem;

import java.util.stream.Collectors;
import java.util.ArrayList;
import java.util.Collections;

public class SaleInvoiceMapper {

    public static SaleInvoiceResponse toResponse(SaleInvoice invoice) {
        if (invoice == null) {
            return null;
        }

        SaleInvoiceResponse response = new SaleInvoiceResponse();
        response.setId(invoice.getId());
        response.setInvoiceNumber(invoice.getInvoiceNumber());
        response.setBranchId(invoice.getBranch() != null ? invoice.getBranch().getId() : null);
        response.setBranchName(invoice.getBranch() != null ? invoice.getBranch().getName() : null);
        response.setCashierId(invoice.getCashier() != null ? invoice.getCashier().getId() : null);
        response.setCashierName(invoice.getCashier() != null ? invoice.getCashier().getFullName() : null);
        response.setCustomerName(invoice.getCustomerName());
        response.setStatus(invoice.getStatus());
        response.setCreatedAt(invoice.getCreatedAt());
        response.setTotalAmount(invoice.getTotalAmount());
        response.setTax(invoice.getTax());
        response.setDiscount(invoice.getDiscount());
        response.setPaymentMethod(invoice.getPaymentMethod());
        response.setAmountPaid(invoice.getAmountPaid());
        response.setChangeAmount(invoice.getChangeAmount());
        if (invoice.getItems() != null) {
            response.setItems(new ArrayList<>(invoice.getItems()).stream()
                    .map(SaleInvoiceMapper::toItemResponse)
                    .collect(Collectors.toList()));
        } else {
            response.setItems(Collections.emptyList());
        }
        return response;
    }

    public static SaleInvoiceItemResponse toItemResponse(SaleInvoiceItem item) {
        if (item == null) {
            return null;
        }

        SaleInvoiceItemResponse response = new SaleInvoiceItemResponse();
        response.setProductId(item.getProduct() != null ? item.getProduct().getId() : null);
        response.setProductName(item.getProduct() != null ? item.getProduct().getName() : null);
        response.setQuantity(item.getQuantity());
        response.setUnitPrice(item.getUnitPrice());
        response.setDiscount(item.getDiscount());
        response.setSubtotal(item.getSubtotal());
        return response;
    }
}
