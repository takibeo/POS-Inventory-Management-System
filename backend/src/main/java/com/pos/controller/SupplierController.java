package com.pos.controller;

import com.pos.dto.request.SupplierRequest;
import com.pos.dto.response.SupplierResponse;
import com.pos.service.SupplierService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/suppliers")
public class SupplierController {

    private final SupplierService supplierService;

    public SupplierController(SupplierService supplierService) {
        this.supplierService = supplierService;
    }

    @GetMapping
    public ResponseEntity<List<SupplierResponse>> getAll() {
        return ResponseEntity.ok(supplierService.getAllSuppliers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<SupplierResponse> getById(@PathVariable("id") UUID id) {
        return ResponseEntity.ok(supplierService.getSupplierById(id));
    }

    @PostMapping
    public ResponseEntity<SupplierResponse> create(@Valid @RequestBody SupplierRequest request) {
        return ResponseEntity.ok(supplierService.createSupplier(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SupplierResponse> update(@PathVariable("id") UUID id,
                                                   @Valid @RequestBody SupplierRequest request) {
        return ResponseEntity.ok(supplierService.updateSupplier(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable("id") UUID id) {
        supplierService.deleteSupplier(id);
        return ResponseEntity.noContent().build();
    }
}
