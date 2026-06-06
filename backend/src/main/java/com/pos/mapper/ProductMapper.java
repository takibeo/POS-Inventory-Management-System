package com.pos.mapper;

import com.pos.dto.request.ProductRequest;
import com.pos.dto.response.ProductResponse;
import com.pos.entity.Category;
import com.pos.entity.Product;
import com.pos.entity.Supplier;

public class ProductMapper {
    public static ProductResponse toResponse(Product product) {
        if (product == null) return null;

        ProductResponse resp = new ProductResponse();
        resp.setId(product.getId());
        resp.setSku(product.getSku());
        resp.setName(product.getName());
        resp.setDescription(product.getDescription());
        resp.setPrice(product.getPrice());
        resp.setCost(product.getCost());
        resp.setBarcode(product.getBarcode());
        resp.setUnit(product.getUnit());
        resp.setReorderLevel(product.getReorderLevel());
        resp.setIsActive(product.getIsActive());
        resp.setCreatedAt(product.getCreatedAt());
        resp.setUpdatedAt(product.getUpdatedAt());

        if (product.getCategory() != null) {
            resp.setCategoryId(product.getCategory().getId());
            resp.setCategoryName(product.getCategory().getName());
        }

        if (product.getSupplier() != null) {
            resp.setSupplierId(product.getSupplier().getId());
            resp.setSupplierName(product.getSupplier().getName());
        }
        return resp;
    }

    public static void updateEntityFromRequest(Product product, ProductRequest request, Category category, Supplier supplier) {
        product.setSku(request.getSku());
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setCost(request.getCost());
        product.setBarcode(request.getBarcode());
        product.setUnit(request.getUnit());
        product.setReorderLevel(
                request.getReorderLevel() != null ? request.getReorderLevel() : 0
        );
        product.setIsActive(
                request.getIsActive() != null ? request.getIsActive() : true
        );
        product.setCategory(category);
        product.setSupplier(supplier);
    }
}
