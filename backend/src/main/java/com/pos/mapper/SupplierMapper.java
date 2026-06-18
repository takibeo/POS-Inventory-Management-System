package com.pos.mapper;

import com.pos.dto.request.SupplierRequest;
import com.pos.dto.response.SupplierResponse;
import com.pos.entity.Supplier;

public final class SupplierMapper {

    private SupplierMapper() {
    }

    public static SupplierResponse toResponse(Supplier supplier) {
        if (supplier == null) {
            return null;
        }

        SupplierResponse response = new SupplierResponse();
        response.setId(supplier.getId());
        response.setName(supplier.getName());
        response.setContactName(supplier.getContactName());
        response.setPhone(supplier.getPhone());
        response.setEmail(supplier.getEmail());
        response.setAddress(supplier.getAddress());
        response.setNotes(supplier.getNotes());
        response.setCreatedAt(supplier.getCreatedAt());
        response.setUpdatedAt(supplier.getUpdatedAt());
        return response;
    }

    public static void updateEntityFromRequest(Supplier supplier, SupplierRequest request) {
        supplier.setName(request.getName());
        supplier.setContactName(request.getContactName());
        supplier.setPhone(request.getPhone());
        supplier.setEmail(request.getEmail());
        supplier.setAddress(request.getAddress());
        supplier.setNotes(request.getNotes());
    }
}
