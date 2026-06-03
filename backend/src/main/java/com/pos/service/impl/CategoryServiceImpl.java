package com.pos.service.impl;

import com.pos.dto.request.CategoryRequest;
import com.pos.dto.response.CategoryResponse;
import com.pos.entity.Category;
import com.pos.exception.ResourceNotFoundException;
import com.pos.mapper.CategoryMapper;
import com.pos.repository.CategoryRepository;
import com.pos.service.CategoryService;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryServiceImpl(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @Override
    public List<CategoryResponse> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(CategoryMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public CategoryResponse getCategoryById(UUID id) {
        return CategoryMapper.toResponse(findCategoryEntity(id));
    }

    @Override
    public CategoryResponse createCategory(CategoryRequest request) {
        Category category = new Category();
        category.setId(UUID.randomUUID());
        CategoryMapper.updateEntityFromRequest(category, request);
        Instant now = Instant.now();
        category.setCreatedAt(now);
        category.setUpdatedAt(now);
        return CategoryMapper.toResponse(categoryRepository.save(category));
    }

    @Override
    public CategoryResponse updateCategory(UUID id, CategoryRequest request) {
        Category existing = findCategoryEntity(id);
        CategoryMapper.updateEntityFromRequest(existing, request);
        existing.setUpdatedAt(Instant.now());
        return CategoryMapper.toResponse(categoryRepository.save(existing));
    }

    @Override
    public void deleteCategory(UUID id) {
        if (!categoryRepository.existsById(id)) {
            throw new ResourceNotFoundException("Danh mục không tồn tại");
        }
        categoryRepository.deleteById(id);
    }

    private Category findCategoryEntity(UUID id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Danh mục không tìm thấy"));
    }
}
