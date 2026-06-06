package com.pos.dto.response;

import java.time.Instant;
import java.util.UUID;

public class ProductResponse {

    private UUID id;
    private String sku;
    private String name;
    private String description;

    private UUID categoryId;
    private String categoryName;

    private UUID supplierId;
    private String supplierName;

    private Double price;
    private Double cost;
    private String barcode;
    private String unit;
    private Integer reorderLevel;
    private Boolean isActive;
    private Instant createdAt;
    private Instant updatedAt;

    public ProductResponse() {}

    public UUID getId() {return id;}
    public void setId(UUID id) {this.id = id;}

    public String getSku() { return sku; }
    public void setSku(String sku) { this.sku = sku; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) {
        this.description = description;
    }

    public UUID getCategoryId() { return categoryId; }
    public void setCategoryId(UUID categoryId) {
        this.categoryId = categoryId;
    }

    public String getCategoryName() { return categoryName; }
    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    public UUID getSupplierId() { return supplierId; }
    public void setSupplierId(UUID supplierId) {
        this.supplierId = supplierId;
    }

    public String getSupplierName() { return supplierName; }
    public void setSupplierName(String supplierName) {
        this.supplierName = supplierName;
    }

    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }

    public Double getCost() { return cost; }
    public void setCost(Double cost) { this.cost = cost; }

    public String getBarcode() { return barcode; }
    public void setBarcode(String barcode) { this.barcode = barcode; }

    public String getUnit() { return unit; }
    public void setUnit(String unit) { this.unit = unit; }

    public Integer getReorderLevel() { return reorderLevel; }
    public void setReorderLevel(Integer reorderLevel) {
        this.reorderLevel = reorderLevel;
    }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }

}
