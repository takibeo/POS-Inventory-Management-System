package com.pos.service;

import com.pos.dto.request.BranchRequest;
import com.pos.dto.response.BranchResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface BranchService {
    Page<BranchResponse> getAllBranches(Pageable pageable);
    BranchResponse getBranchById(UUID id);
    BranchResponse createBranch(BranchRequest request);
    BranchResponse updateBranch(UUID id, BranchRequest request);
    void deleteBranch(UUID id);
}
