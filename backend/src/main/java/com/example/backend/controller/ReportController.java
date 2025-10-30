package com.example.backend.controller;

import com.example.backend.model.ReportData;
import com.example.backend.repository.ReportDataRepository;
import com.example.backend.spec.ReportDataSpecs;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/report")
public class ReportController {
    @Autowired
    private ReportDataRepository repository;

    @GetMapping
    public Page<ReportData> getReport(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "1000") int size, // default to 1000 to show all
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String order,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) Integer minCreditScore,
            @RequestParam(required = false) Integer maxCreditScore
    ) {
        Pageable pageable = PageRequest.of(page, size, order.equals("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending());
        Specification<ReportData> spec = Specification.where(ReportDataSpecs.hasName(name))
                .and(ReportDataSpecs.hasLocation(location))
                .and(ReportDataSpecs.creditScoreGte(minCreditScore))
                .and(ReportDataSpecs.creditScoreLte(maxCreditScore));
        return repository.findAll(spec, pageable);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReportData> getById(@PathVariable Long id) {
        Optional<ReportData> data = repository.findById(id);
        return data.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ReportData addReport(@RequestBody ReportData data) {
        return repository.save(data);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ReportData> updateReport(@PathVariable Long id, @RequestBody ReportData newData) {
        return repository.findById(id)
                .map(existing -> {
                    existing.setName(newData.getName());
                    existing.setPhoneNumber(newData.getPhoneNumber());
                    existing.setLocation(newData.getLocation());
                    existing.setCreditScore(newData.getCreditScore());
                    existing.setTenure(newData.getTenure());
                    repository.save(existing);
                    return ResponseEntity.ok(existing);
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReport(@PathVariable Long id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
