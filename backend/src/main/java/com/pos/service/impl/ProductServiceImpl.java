package com.pos.service.impl;

import lombok.extern.slf4j.Slf4j;

import com.pos.dto.request.ProductRequest;
import com.pos.dto.response.ProductResponse;
import com.pos.entity.Category;
import com.pos.entity.Product;
import com.pos.entity.Supplier;
import com.pos.exception.BusinessException;
import com.pos.exception.ResourceNotFoundException;
import com.pos.mapper.ProductMapper;
import com.pos.repository.CategoryRepository;
import com.pos.repository.ProductRepository;
import com.pos.repository.SupplierRepository;
import com.pos.service.ProductService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.UUID;

@Service
@Transactional(readOnly = true)
@Slf4j
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final SupplierRepository supplierRepository;

    public ProductServiceImpl(ProductRepository productRepository,
                              CategoryRepository categoryRepository,
                              SupplierRepository supplierRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.supplierRepository = supplierRepository;
    }

    @Override
    public Page<ProductResponse> getAllProducts(UUID categoryId,
                                                Boolean isActive,
                                                Pageable pageable) {
        log.info("ProductService.getAllProducts categoryId={} isActive={} pageable={}", categoryId, isActive, pageable);
        return productRepository
                .findAllWithFilters(categoryId, isActive, pageable)
                .map(ProductMapper::toResponse);
    }

    @Override
    public Page<ProductResponse> searchProducts(String q, Pageable pageable) {
        log.info("ProductService.searchProducts q={} pageable={}", q, pageable);
        String qparam = (q == null || q.isBlank()) ? null : q.trim();
        return productRepository.searchByNameOrSku(qparam, pageable)
                .map(ProductMapper::toResponse);
    }

    @Override
    public ProductResponse getProductById(UUID id) {
        log.info("ProductService.getProductById id={}", id);
        Product product = productRepository.findByIdWithRelations(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Sản phẩm không tồn tại: " + id));
        return ProductMapper.toResponse(product);
    }

    @Override
    @Transactional
    public ProductResponse createProduct(ProductRequest request) {
        log.info("ProductService.createProduct sku={}", request.getSku());
        if (productRepository.existsBySku(request.getSku())) {
            throw new BusinessException("SKU_DUPLICATE",
                    "SKU '" + request.getSku() + "' đã tồn tại");
        }

        Category category = resolveCategory(request.getCategoryId());
        Supplier supplier = resolveSupplier(request.getSupplierId());

        Product product = new Product();
        product.setId(UUID.randomUUID());
        Instant now = Instant.now();
        product.setCreatedAt(now);
        product.setUpdatedAt(now);

        ProductMapper.updateEntityFromRequest(
                product, request, category, supplier);
        return ProductMapper.toResponse(productRepository.save(product));
    }

    @Override
    @Transactional
    public ProductResponse updateProduct(UUID id, ProductRequest request) {
        log.info("ProductService.updateProduct id={} sku={}", id, request.getSku());
        Product existing = productRepository.findByIdWithRelations(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Sản phẩm không tồn tại: " + id));

        if (productRepository.existsBySkuAndIdNot(request.getSku(), id)) {
            throw new BusinessException("SKU_DUPLICATE",
                    "SKU '" + request.getSku() + "' đã được sử dụng bởi sản phẩm khác");
        }

        Category category = resolveCategory(request.getCategoryId());
        Supplier supplier = resolveSupplier(request.getSupplierId());

        ProductMapper.updateEntityFromRequest(
                existing, request, category, supplier);
        existing.setUpdatedAt(Instant.now());
        return ProductMapper.toResponse(productRepository.save(existing));
    }

    @Override
    @Transactional
    public void deleteProduct(UUID id) {
        log.info("ProductService.deleteProduct id={}", id);
        if (!productRepository.existsById(id)) {
            throw new ResourceNotFoundException(
                    "Sản phẩm không tồn tại: " + id);
        }
        productRepository.deleteById(id);
    }

    private Category resolveCategory(UUID categoryId) {
        if (categoryId == null) return null;
        return categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Danh mục không tồn tại: " + categoryId));
    }

    private Supplier resolveSupplier(UUID supplierId) {
        if (supplierId == null) return null;
        return supplierRepository.findById(supplierId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Nhà cung cấp không tồn tại: " + supplierId));
    }
}