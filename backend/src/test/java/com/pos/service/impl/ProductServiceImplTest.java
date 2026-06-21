package com.pos.service.impl;

import com.pos.dto.request.ProductRequest;
import com.pos.entity.Category;
import com.pos.entity.Supplier;
import com.pos.entity.Product;
import com.pos.repository.CategoryRepository;
import com.pos.repository.ProductRepository;
import com.pos.repository.SupplierRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProductServiceImplTest {
    @Mock private ProductRepository productRepository;
    @Mock private CategoryRepository categoryRepository;
    @Mock private SupplierRepository supplierRepository;

    private ProductServiceImpl productService;

    @BeforeEach
    void setUp() {
        productService = new ProductServiceImpl(productRepository, categoryRepository, supplierRepository);
    }

    @Test
    void createProductSuccess() {
        var req = new ProductRequest();
        req.setSku("SKU-1"); req.setName("P1"); req.setPrice(10.0); req.setCost(5.0);
        UUID catId = UUID.randomUUID(); UUID supId = UUID.randomUUID();
        req.setCategoryId(catId); req.setSupplierId(supId);

        when(productRepository.existsBySku("SKU-1")).thenReturn(false);
        when(categoryRepository.findById(catId)).thenReturn(Optional.of(new Category()));
        when(supplierRepository.findById(supId)).thenReturn(Optional.of(new Supplier()));
        when(productRepository.save(any())).thenAnswer(i -> i.getArgument(0));

        var resp = productService.createProduct(req);
        assertNotNull(resp);
        verify(productRepository).save(any());
    }

    @Test
    void createProductDuplicateSkuThrows() {
        var req = new ProductRequest(); req.setSku("SKU-1"); req.setName("P1"); req.setPrice(10.0); req.setCost(5.0);
        when(productRepository.existsBySku("SKU-1")).thenReturn(true);
        assertThrows(RuntimeException.class, () -> productService.createProduct(req));
    }

    @Test
    void updateProductSuccess() {
        UUID id = UUID.randomUUID();
        var req = new ProductRequest(); req.setSku("SKU-2"); req.setName("P2"); req.setPrice(15.0); req.setCost(7.0);
        org.mockito.Mockito.lenient().when(productRepository.findByIdWithRelations(id)).thenReturn(Optional.of(new Product()));
        org.mockito.Mockito.lenient().when(productRepository.existsBySkuAndIdNot("SKU-2", id)).thenReturn(false);
        org.mockito.Mockito.lenient().when(categoryRepository.findById(any())).thenReturn(Optional.of(new Category()));
        org.mockito.Mockito.lenient().when(supplierRepository.findById(any())).thenReturn(Optional.of(new Supplier()));
        org.mockito.Mockito.lenient().when(productRepository.save(any())).thenAnswer(i -> i.getArgument(0));

        var resp = productService.updateProduct(id, req);
        assertNotNull(resp);
        verify(productRepository).save(any());
    }

    @Test
    void deleteProductNotFoundThrows() {
        UUID id = UUID.randomUUID();
        when(productRepository.existsById(id)).thenReturn(false);
        assertThrows(RuntimeException.class, () -> productService.deleteProduct(id));
    }
}
