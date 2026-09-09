package com.sih26102.sentinel.repository;

import com.sih26102.sentinel.model.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {
}