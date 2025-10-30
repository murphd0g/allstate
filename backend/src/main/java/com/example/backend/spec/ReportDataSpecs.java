package com.example.backend.spec;

import com.example.backend.model.ReportData;
import org.springframework.data.jpa.domain.Specification;

public class ReportDataSpecs {
    public static Specification<ReportData> hasName(String name) {
        return (root, query, cb) -> name == null ? null : cb.like(cb.lower(root.get("name")), "%" + name.toLowerCase() + "%");
    }
    public static Specification<ReportData> hasLocation(String location) {
        return (root, query, cb) -> location == null ? null : cb.like(cb.lower(root.get("location")), "%" + location.toLowerCase() + "%");
    }
    public static Specification<ReportData> creditScoreGte(Integer min) {
        return (root, query, cb) -> min == null ? null : cb.greaterThanOrEqualTo(root.get("creditScore"), min);
    }
    public static Specification<ReportData> creditScoreLte(Integer max) {
        return (root, query, cb) -> max == null ? null : cb.lessThanOrEqualTo(root.get("creditScore"), max);
    }
}
