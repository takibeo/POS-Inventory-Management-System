package com.pos.service.impl;

import com.pos.dto.request.SupplierRequest;
import com.pos.dto.response.SupplierResponse;
import com.pos.entity.Supplier;
import com.pos.exception.ResourceNotFoundException;
import com.pos.mapper.SupplierMapper;
import com.pos.repository.SupplierRepository;
import com.pos.service.SupplierService;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class SupplierServiceImpl implements SupplierService {

    private final SupplierRepository supplierRepository;

    public SupplierServiceImpl(SupplierRepository supplierRepository) {
        this.supplierRepository = supplierRepository;
    }

    @Override
    public List<SupplierResponse> getAllSuppliers() {
        return supplierRepository.findAll().stream()
                .map(SupplierMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public SupplierResponse getSupplierById(UUID id) {
        return SupplierMapper.toResponse(findSupplierEntity(id));
    }

    @Override
    public SupplierResponse createSupplier(SupplierRequest request) {
        Supplier supplier = new Supplier();
        supplier.setId(UUID.randomUUID());
        SupplierMapper.updateEntityFromRequest(supplier, request);
        Instant now = Instant.now();
        supplier.setCreatedAt(now);
        supplier.setUpdatedAt(now);
        return SupplierMapper.toResponse(supplierRepository.save(supplier));
    }

    @Override
    public SupplierResponse updateSupplier(UUID id, SupplierRequest request) {
        Supplier existing = findSupplierEntity(id);
        SupplierMapper.updateEntityFromRequest(existing, request);
        existing.setUpdatedAt(Instant.now());
        return SupplierMapper.toResponse(supplierRepository.save(existing));
    }

    @Override
    public void deleteSupplier(UUID id) {
        supplierRepository.delete(findSupplierEntity(id));
    }

    private Supplier findSupplierEntity(UUID id) {
        return supplierRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Nhà cung cấp không tìm thấy"));
    }
}
