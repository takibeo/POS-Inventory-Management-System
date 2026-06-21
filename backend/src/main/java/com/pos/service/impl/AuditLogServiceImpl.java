package com.pos.service.impl;

import com.pos.entity.AuditLog;
import com.pos.repository.AuditLogRepository;
import com.pos.service.AuditLogService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class AuditLogServiceImpl implements AuditLogService {

    private final AuditLogRepository auditLogRepository;

    public AuditLogServiceImpl(AuditLogRepository auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }

    @Override
    public AuditLog save(AuditLog auditLog) {
        return auditLogRepository.save(auditLog);
    }

    @Override
    public List<AuditLog> getAll() {
        return auditLogRepository.findAll();
    }

    @Override
    public AuditLog getById(UUID id) {
        return auditLogRepository.findById(id).orElse(null);
    }
}
