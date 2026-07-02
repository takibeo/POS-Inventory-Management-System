package com.pos.service.impl;

import lombok.extern.slf4j.Slf4j;

import com.pos.dto.request.CategoryRequest;
import com.pos.dto.response.CategoryResponse;
import com.pos.entity.Category;
import com.pos.exception.BusinessException;
import com.pos.exception.ResourceNotFoundException;
import com.pos.mapper.CategoryMapper;
import com.pos.repository.CategoryRepository;
import com.pos.service.CategoryService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.UUID;

@Service
@Transactional(readOnly = true)
@Slf4j
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryServiceImpl(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @Override
    public Page<CategoryResponse> getAllCategories(Pageable pageable) {
        log.info("CategoryService.getAllCategories pageable={}", pageable);
        return categoryRepository.findAll(pageable)
                .map(CategoryMapper::toResponse);
    }

    @Override
    public CategoryResponse getCategoryById(UUID id) {
        log.info("CategoryService.getCategoryById id={}", id);
        return CategoryMapper.toResponse(findCategoryEntity(id));
    }

    @Override
    @Transactional
    public CategoryResponse createCategory(CategoryRequest request) {
        if (request == null) {
            throw new BusinessException("CATEGORY_REQUEST_REQUIRED", "Yêu cầu danh mục không được để trống");
        }
        log.info("CategoryService.createCategory request={}", request.getName());
        String name = request.getName() == null ? "" : request.getName().trim();
        if (name.isBlank()) {
            throw new BusinessException("CATEGORY_NAME_REQUIRED", "Tên danh mục không được để trống");
        }
        if (categoryRepository.existsByNameIgnoreCase(name)) {
            throw new BusinessException("CATEGORY_NAME_DUPLICATE",
                    "Danh mục '" + request.getName() + "' đã tồn tại");
        }

        Category category = new Category();
        category.setId(UUID.randomUUID());
        Instant now = Instant.now();
        category.setCreatedAt(now);
        category.setUpdatedAt(now);
        category.setName(name);
        CategoryMapper.updateEntityFromRequest(category, request);
        return CategoryMapper.toResponse(categoryRepository.save(category));
    }

    @Override
    @Transactional
    public CategoryResponse updateCategory(UUID id, CategoryRequest request) {
        if (request == null) {
            throw new BusinessException("CATEGORY_REQUEST_REQUIRED", "Yêu cầu danh mục không được để trống");
        }
        log.info("CategoryService.updateCategory id={} name={}", id, request.getName());
        Category existing = findCategoryEntity(id);

        String name = request.getName() == null ? "" : request.getName().trim();
        if (name.isBlank()) {
            throw new BusinessException("CATEGORY_NAME_REQUIRED", "Tên danh mục không được để trống");
        }
        if (categoryRepository.existsByNameIgnoreCaseAndIdNot(
                name, id)) {
            throw new BusinessException("CATEGORY_NAME_DUPLICATE",
                    "Danh mục '" + request.getName() + "' đã được sử dụng");
        }

        existing.setName(name);
        CategoryMapper.updateEntityFromRequest(existing, request);
        existing.setUpdatedAt(Instant.now());
        return CategoryMapper.toResponse(categoryRepository.save(existing));
    }

    @Override
    @Transactional
    public void deleteCategory(UUID id) {
        log.info("CategoryService.deleteCategory id={}", id);
        if (!categoryRepository.existsById(id)) {
            throw new ResourceNotFoundException(
                    "Danh mục không tồn tại: " + id);
        }
        categoryRepository.deleteById(id);
    }

    private Category findCategoryEntity(UUID id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Danh mục không tồn tại: " + id));
    }
}