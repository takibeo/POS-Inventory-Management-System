package com.pos.service.impl;

import com.pos.dto.request.CategoryRequest;
import com.pos.repository.CategoryRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CategoryServiceImplTest {

    @Mock private CategoryRepository categoryRepository;
    private CategoryServiceImpl categoryService;

    @BeforeEach
    void setUp() {
        categoryService = new CategoryServiceImpl(categoryRepository);
    }

    @Test
    void createCategorySuccess() {
        var req = new CategoryRequest(); req.setName("CAT1");
        when(categoryRepository.existsByNameIgnoreCase("CAT1")).thenReturn(false);
        when(categoryRepository.save(any())).thenAnswer(i -> i.getArgument(0));

        var resp = categoryService.createCategory(req);
        assertNotNull(resp);
        verify(categoryRepository).save(any());
    }

    @Test
    void createCategoryDuplicateThrows() {
        var req = new CategoryRequest(); req.setName("CAT1");
        when(categoryRepository.existsByNameIgnoreCase("CAT1")).thenReturn(true);
        assertThrows(RuntimeException.class, () -> categoryService.createCategory(req));
    }
}
