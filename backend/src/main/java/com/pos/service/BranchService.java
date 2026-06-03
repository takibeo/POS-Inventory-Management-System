package com.pos.service;

import com.pos.dto.request.BranchRequest;
import com.pos.dto.response.BranchResponse;

import java.util.List;
import java.util.UUID;

public interface BranchService {
    List<BranchResponse> getAllBranches();
    BranchResponse getBranchById(UUID id);
    BranchResponse createBranch(BranchRequest request);
    BranchResponse updateBranch(UUID id, BranchRequest request);
    void deleteBranch(UUID id);
}
