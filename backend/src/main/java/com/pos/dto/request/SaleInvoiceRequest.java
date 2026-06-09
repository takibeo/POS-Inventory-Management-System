package com.pos.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class SaleInvoiceRequest {

    @NotNull(message = "Chi nhánh không được để trống")
    private UUID branchId;

    @NotNull(message = "Nhân viên thu ngân không được để trống")
    private UUID cashierId;

    @NotBlank(message = "Phương thức thanh toán không được để trống")
    private String paymentMethod;

    private String customerName;

    @DecimalMin(value = "0.0", inclusive = true, message = "Thuế không được âm")
    private Double tax = 0.0;

    @DecimalMin(value = "0.0", inclusive = true, message = "Giảm giá không được âm")
    private Double discount = 0.0;

    @DecimalMin(value = "0.0", inclusive = true, message = "Số tiền thanh toán không được âm")
    private Double amountPaid;

    @NotEmpty(message = "Hoá đơn phải có ít nhất một mặt hàng")
    @Valid
    private List<SaleInvoiceItemRequest> items = new ArrayList<>();

    public SaleInvoiceRequest() {
    }

    public UUID getBranchId() {
        return branchId;
    }

    public void setBranchId(UUID branchId) {
        this.branchId = branchId;
    }

    public UUID getCashierId() {
        return cashierId;
    }

    public void setCashierId(UUID cashierId) {
        this.cashierId = cashierId;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public Double getTax() {
        return tax;
    }

    public void setTax(Double tax) {
        this.tax = tax;
    }

    public Double getDiscount() {
        return discount;
    }

    public void setDiscount(Double discount) {
        this.discount = discount;
    }

    public Double getAmountPaid() {
        return amountPaid;
    }

    public void setAmountPaid(Double amountPaid) {
        this.amountPaid = amountPaid;
    }

    public List<SaleInvoiceItemRequest> getItems() {
        return items;
    }

    public void setItems(List<SaleInvoiceItemRequest> items) {
        this.items = items;
    }
}
