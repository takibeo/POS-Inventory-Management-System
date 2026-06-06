package com.pos.dto.request;

import jakarta.validation.constraints.*;

import java.util.UUID;

public class ProductRequest {
    @NotBlank(message = "SKU không được để trống")
    @Size(max = 100, message = "SKU không vượt quá 100 ký tự")
    private String sku;

    @NotBlank(message = "Tên không được để trống")
    @Size(max = 200, message = "Tên không vượt quá 100 ký tự")
    private String name;

    @Size(max = 2000, message = "Mô tả không vượt quá 100 ký tự")
    private String description;

    private UUID categoryId;
    private UUID supplierId;

    @NotNull(message = "Giá bán không được để trống")
    @DecimalMin(value = "0.0", inclusive = false, message = "Giá bán phải lớn hơn 0")
    private Double price;

    @NotNull(message = "Giá vốn không được để trống")
    @DecimalMin(value = "0.0", inclusive = false, message = "Giá vốn phải lớn hơn 0")
    private Double cost;

    @Size(max = 100, message = "Barcode không vượt quá 100 ký tự")
    private String barcode;

    @Size(max = 50, message = "Đơn vị tính không vượt quá 50 ký tự")
    private String unit;

    @Min(value = 0, message = "Mức tái nhập kho không được âm")
    private Integer reorderLevel = 0;

    private Boolean isActive = true;

    public ProductRequest() {}

    public String getSku() { return sku; }
    public void setSku(String sku) { this.sku = sku; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public UUID getCategoryId() { return categoryId; }
    public void setCategoryId(UUID categoryId) { this.categoryId = categoryId; }

    public UUID getSupplierId() { return supplierId; }
    public void setSupplierId(UUID supplierId) { this.supplierId = supplierId; }

    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }

    public Double getCost() { return cost; }
    public void setCost(Double cost) { this.cost = cost; }

    public String getBarcode() { return barcode; }
    public void setBarcode(String barcode) { this.barcode = barcode; }

    public String getUnit() { return unit; }
    public void setUnit(String unit) { this.unit = unit; }

    public Integer getReorderLevel() { return reorderLevel; }
    public void setReorderLevel(Integer reorderLevel) { this.reorderLevel = reorderLevel; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }

}
