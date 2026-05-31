package com.pos.service.impl;

import com.pos.entity.Branch;
import com.pos.repository.BranchRepository;
import com.pos.service.BranchService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class BranchServiceImpl implements BranchService {

    private final BranchRepository branchRepository;

    public BranchServiceImpl(BranchRepository branchRepository) {
        this.branchRepository = branchRepository;
    }

    @Override
    public List<Branch> getAllBranches() {
        return branchRepository.findAll();
    }

    @Override
    public Branch getBranchById(UUID id) {
        return branchRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Branch not found"));
    }

    @Override
    public Branch createBranch(Branch branch) {
        return branchRepository.save(branch);
    }

    @Override
    public Branch updateBranch(UUID id, Branch branch) {
        Branch existing = getBranchById(id);
        existing.setName(branch.getName());
        existing.setCode(branch.getCode());
        existing.setAddress(branch.getAddress());
        existing.setPhone(branch.getPhone());
        existing.setManager(branch.getManager());
        return branchRepository.save(existing);
    }

    @Override
    public void deleteBranch(UUID id) {
        branchRepository.deleteById(id);
    }
}
