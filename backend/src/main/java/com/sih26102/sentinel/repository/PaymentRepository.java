package com.sih26102.sentinel.repository;

import com.sih26102.sentinel.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PaymentRepository extends JpaRepository<Payment, String> {
    List<Payment> findByProjectIdOrderByPaymentDateAsc(String projectId);
}