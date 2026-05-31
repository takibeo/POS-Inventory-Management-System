package com.pos.service.impl;

import com.pos.entity.Product;
import com.pos.repository.ProductRepository;
import com.pos.service.ProductService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;

    public ProductServiceImpl(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Override
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    @Override
    public Product getProductById(UUID id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
    }

    @Override
    public Product createProduct(Product product) {
        return productRepository.save(product);
    }

    @Override
    public Product updateProduct(UUID id, Product product) {
        Product existing = getProductById(id);
        existing.setSku(product.getSku());
        existing.setName(product.getName());
        existing.setDescription(product.getDescription());
        existing.setCategory(product.getCategory());
        existing.setSupplier(product.getSupplier());
        existing.setPrice(product.getPrice());
        existing.setCost(product.getCost());
        existing.setBarcode(product.getBarcode());
        existing.setUnit(product.getUnit());
        existing.setReorderLevel(product.getReorderLevel());
        existing.setIsActive(product.getIsActive());
        return productRepository.save(existing);
    }

    @Override
    public void deleteProduct(UUID id) {
        productRepository.deleteById(id);
    }
}
