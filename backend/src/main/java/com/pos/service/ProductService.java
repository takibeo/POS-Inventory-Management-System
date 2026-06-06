package com.pos.service;

import com.pos.dto.request.ProductRequest;
import com.pos.dto.response.ProductResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface ProductService {

    Page<ProductResponse> getAllProducts(UUID categoryId,
                                         Boolean isActive,
                                         Pageable pageable);

    ProductResponse getProductById(UUID id);

    ProductResponse createProduct(ProductRequest request);

    ProductResponse updateProduct(UUID id, ProductRequest request);

    void deleteProduct(UUID id);
}