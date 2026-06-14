package com.pos.service.impl;

import com.pos.dto.request.BranchRequest;
import com.pos.dto.response.BranchResponse;
import com.pos.entity.Branch;
import com.pos.exception.ResourceNotFoundException;
import com.pos.mapper.BranchMapper;
import com.pos.repository.BranchRepository;
import com.pos.service.BranchService;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class BranchServiceImpl implements BranchService {

    private final BranchRepository branchRepository;

    public BranchServiceImpl(BranchRepository branchRepository) {
        this.branchRepository = branchRepository;
    }

    @Override
    public List<BranchResponse> getAllBranches() {
        return branchRepository.findAll().stream()
                .map(BranchMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public BranchResponse getBranchById(UUID id) {
        return BranchMapper.toResponse(findBranchEntity(id));
    }

    @Override
    public BranchResponse createBranch(BranchRequest request) {
        Branch branch = new Branch();
        branch.setId(UUID.randomUUID());
        BranchMapper.updateEntityFromRequest(branch, request);
        Instant now = Instant.now();
        branch.setCreatedAt(now);
        branch.setUpdatedAt(now);
        return BranchMapper.toResponse(branchRepository.save(branch));
    }

    @Override
    public BranchResponse updateBranch(UUID id, BranchRequest request) {
        Branch existing = findBranchEntity(id);
        BranchMapper.updateEntityFromRequest(existing, request);
        existing.setUpdatedAt(Instant.now());
        return BranchMapper.toResponse(branchRepository.save(existing));
    }

    @Override
    public void deleteBranch(UUID id) {
        if (!branchRepository.existsById(id)) {
            throw new ResourceNotFoundException("Chi nhánh không tồn tại");
        }
        branchRepository.deleteById(id);
    }

    private Branch findBranchEntity(UUID id) {
        return branchRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Chi nhánh không tìm thấy"));
    }
}
