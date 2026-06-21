package com.pos.service.impl;

import com.pos.dto.request.SupplierRequest;
import com.pos.entity.Supplier;
import com.pos.repository.SupplierRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SupplierServiceImplTest {

    @Mock private SupplierRepository supplierRepository;
    private SupplierServiceImpl supplierService;

    @BeforeEach
    void setUp() {
        supplierService = new SupplierServiceImpl(supplierRepository);
    }

    @Test
    void createSupplierSuccess() {
        var req = new SupplierRequest(); req.setName("S1");
        when(supplierRepository.save(any())).thenAnswer(i -> i.getArgument(0));
        var resp = supplierService.createSupplier(req);
        assertNotNull(resp);
        verify(supplierRepository).save(any());
    }

    @Test
    void getSupplierByIdNotFoundThrows() {
        UUID id = UUID.randomUUID();
        when(supplierRepository.findById(id)).thenReturn(Optional.empty());
        assertThrows(RuntimeException.class, () -> supplierService.getSupplierById(id));
    }
}
