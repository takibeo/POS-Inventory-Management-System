package com.pos.service.impl;

import com.pos.dto.request.BranchRequest;
import com.pos.entity.Branch;
import com.pos.exception.ResourceNotFoundException;
import com.pos.repository.BranchRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BranchServiceImplTest {

    @Mock private BranchRepository branchRepository;
    private BranchServiceImpl branchService;

    @BeforeEach
    void setUp() {
        branchService = new BranchServiceImpl(branchRepository);
    }

    @Test
    void createBranchSuccess() {
        var req = new BranchRequest(); req.setName("B1");
        when(branchRepository.save(any())).thenAnswer(i -> i.getArgument(0));
        var resp = branchService.createBranch(req);
        assertNotNull(resp);
        verify(branchRepository).save(any());
    }

    @Test
    void getBranchByIdReturnsExistingBranch() {
        UUID id = UUID.randomUUID();
        Branch branch = new Branch();
        branch.setId(id);
        branch.setName("B1");
        when(branchRepository.findById(id)).thenReturn(Optional.of(branch));

        var resp = branchService.getBranchById(id);

        assertNotNull(resp);
        assertEquals("B1", resp.getName());
    }

    @Test
    void getBranchByIdThrowsWhenMissing() {
        UUID id = UUID.randomUUID();
        when(branchRepository.findById(id)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> branchService.getBranchById(id));
    }
}
