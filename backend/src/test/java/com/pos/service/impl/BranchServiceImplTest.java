package com.pos.service.impl;

import com.pos.dto.request.BranchRequest;
import com.pos.repository.BranchRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

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
}
