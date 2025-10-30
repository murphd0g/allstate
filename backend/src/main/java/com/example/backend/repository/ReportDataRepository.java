package com.example.backend.repository;

import com.example.backend.model.ReportData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface ReportDataRepository extends JpaRepository<ReportData, Long>, JpaSpecificationExecutor<ReportData> {
}
