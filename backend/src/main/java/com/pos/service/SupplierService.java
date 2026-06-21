package com.pos.service;

import com.pos.dto.request.SupplierRequest;
import com.pos.dto.response.SupplierResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface SupplierService {
    Page<SupplierResponse> getAllSuppliers(Pageable pageable);
    SupplierResponse getSupplierById(UUID id);
    SupplierResponse createSupplier(SupplierRequest request);
    SupplierResponse updateSupplier(UUID id, SupplierRequest request);
    void deleteSupplier(UUID id);
}
