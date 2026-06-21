package com.pos.service;

import com.pos.entity.AuditLog;

import java.util.List;
import java.util.UUID;

public interface AuditLogService {
    AuditLog save(AuditLog auditLog);
    List<AuditLog> getAll();
    AuditLog getById(UUID id);
}
