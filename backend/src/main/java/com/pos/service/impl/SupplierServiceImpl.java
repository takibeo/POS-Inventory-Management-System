package com.pos.service.impl;

import lombok.extern.slf4j.Slf4j;

import com.pos.dto.request.SupplierRequest;
import com.pos.dto.response.SupplierResponse;
import com.pos.entity.Supplier;
import com.pos.exception.ResourceNotFoundException;
import com.pos.mapper.SupplierMapper;
import com.pos.repository.SupplierRepository;
import com.pos.service.SupplierService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.UUID;

@Service
@Slf4j
public class SupplierServiceImpl implements SupplierService {

    private final SupplierRepository supplierRepository;

    public SupplierServiceImpl(SupplierRepository supplierRepository) {
        this.supplierRepository = supplierRepository;
    }

    @Override
    public Page<SupplierResponse> getAllSuppliers(Pageable pageable) {
        log.info("SupplierService.getAllSuppliers called pageable={}", pageable);
        return supplierRepository.findAll(pageable).map(SupplierMapper::toResponse);
    }

    @Override
    public SupplierResponse getSupplierById(UUID id) {
        log.info("SupplierService.getSupplierById id={}", id);
        return SupplierMapper.toResponse(findSupplierEntity(id));
    }

    @Override
    public SupplierResponse createSupplier(SupplierRequest request) {
        log.info("SupplierService.createSupplier name={}", request.getName());
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
        log.info("SupplierService.updateSupplier id={} name={}", id, request.getName());
        Supplier existing = findSupplierEntity(id);
        SupplierMapper.updateEntityFromRequest(existing, request);
        existing.setUpdatedAt(Instant.now());
        return SupplierMapper.toResponse(supplierRepository.save(existing));
    }

    @Override
    public void deleteSupplier(UUID id) {
        log.info("SupplierService.deleteSupplier id={}", id);
        supplierRepository.delete(findSupplierEntity(id));
    }

    private Supplier findSupplierEntity(UUID id) {
        return supplierRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Nhà cung cấp không tìm thấy"));
    }
}
