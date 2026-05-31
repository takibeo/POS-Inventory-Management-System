package com.pos.controller;

import com.pos.entity.Branch;
import com.pos.service.BranchService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/branches")
public class BranchController {

    private final BranchService branchService;

    public BranchController(BranchService branchService) {
        this.branchService = branchService;
    }

    @GetMapping
    public ResponseEntity<List<Branch>> getAll() {
        return ResponseEntity.ok(branchService.getAllBranches());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Branch> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(branchService.getBranchById(id));
    }

    @PostMapping
    public ResponseEntity<Branch> create(@RequestBody Branch branch) {
        return ResponseEntity.ok(branchService.createBranch(branch));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Branch> update(@PathVariable UUID id, @RequestBody Branch branch) {
        return ResponseEntity.ok(branchService.updateBranch(id, branch));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        branchService.deleteBranch(id);
        return ResponseEntity.noContent().build();
    }
}
