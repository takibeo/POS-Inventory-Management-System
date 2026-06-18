package com.pos.mapper;

import com.pos.dto.request.BranchRequest;
import com.pos.dto.response.BranchResponse;
import com.pos.entity.Branch;

public final class BranchMapper {

    private BranchMapper() {
    }

    public static BranchResponse toResponse(Branch branch) {
        if (branch == null) {
            return null;
        }
        BranchResponse resp = new BranchResponse();
        resp.setId(branch.getId());
        resp.setName(branch.getName());
        resp.setCode(branch.getCode());
        resp.setAddress(branch.getAddress());
        resp.setPhone(branch.getPhone());
        resp.setCreatedAt(branch.getCreatedAt());
        resp.setUpdatedAt(branch.getUpdatedAt());
        return resp;
    }

    public static void updateEntityFromRequest(Branch branch, BranchRequest request) {
        branch.setName(request.getName());
        branch.setCode(request.getCode());
        branch.setAddress(request.getAddress());
        branch.setPhone(request.getPhone());
    }
}
