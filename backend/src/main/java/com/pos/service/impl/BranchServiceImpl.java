package com.pos.service.impl;

import lombok.extern.slf4j.Slf4j;

import com.pos.dto.request.BranchRequest;
import com.pos.dto.response.BranchResponse;
import com.pos.entity.Branch;
import com.pos.exception.ResourceNotFoundException;
import com.pos.mapper.BranchMapper;
import com.pos.repository.BranchRepository;
import com.pos.service.BranchService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.UUID;

@Service
@Slf4j
public class BranchServiceImpl implements BranchService {

    private final BranchRepository branchRepository;

    public BranchServiceImpl(BranchRepository branchRepository) {
        this.branchRepository = branchRepository;
    }

    @Override
    public Page<BranchResponse> getAllBranches(Pageable pageable) {
        log.info("BranchService.getAllBranches called pageable={}", pageable);
        return branchRepository.findAll(pageable).map(BranchMapper::toResponse);
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
