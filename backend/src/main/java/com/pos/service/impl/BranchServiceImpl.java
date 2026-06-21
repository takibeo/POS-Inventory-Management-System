package com.pos.service.impl;

import lombok.extern.slf4j.Slf4j;

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
@Slf4j
public class BranchServiceImpl implements BranchService {

    private final BranchRepository branchRepository;

    public BranchServiceImpl(BranchRepository branchRepository) {
        this.branchRepository = branchRepository;
    }

    @Override
    public List<BranchResponse> getAllBranches() {
        log.info("BranchService.getAllBranches called");
        return branchRepository.findAll().stream()
                .map(BranchMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public BranchResponse getBranchById(UUID id) {
        log.info("BranchService.getBranchById id={}", id);
        return BranchMapper.toResponse(findBranchEntity(id));
    }

    @Override
    public BranchResponse createBranch(BranchRequest request) {
        log.info("BranchService.createBranch request={}", request);
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
        log.info("BranchService.updateBranch id={} request={}", id, request);
        Branch existing = findBranchEntity(id);
        BranchMapper.updateEntityFromRequest(existing, request);
        existing.setUpdatedAt(Instant.now());
        return BranchMapper.toResponse(branchRepository.save(existing));
    }

    @Override
    public void deleteBranch(UUID id) {
        log.info("BranchService.deleteBranch id={}", id);
        branchRepository.delete(findBranchEntity(id));
    }

    private Branch findBranchEntity(UUID id) {
        return branchRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Branch not found"));
    }
}
