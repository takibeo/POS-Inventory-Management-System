package com.pos.service;

import com.pos.dto.request.SupplierRequest;
import com.pos.dto.response.SupplierResponse;

import java.util.List;
import java.util.UUID;

public interface SupplierService {
    List<SupplierResponse> getAllSuppliers();
    SupplierResponse getSupplierById(UUID id);
    SupplierResponse createSupplier(SupplierRequest request);
    SupplierResponse updateSupplier(UUID id, SupplierRequest request);
    void deleteSupplier(UUID id);
}
