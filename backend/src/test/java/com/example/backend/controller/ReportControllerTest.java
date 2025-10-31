package com.example.backend.controller;

import com.example.backend.model.ReportData;
import com.example.backend.repository.ReportDataRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ReportController.class)
public class ReportControllerTest {
    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ReportDataRepository repository;

    private ReportData sample;

    @BeforeEach
    void setup() {
        sample = new ReportData("Test User", "555-0000", "Test City", 700, 3);
        sample.setId(1L);
    }

    @Test
    void testGetReport() throws Exception {
        when(repository.findAll(any(Specification.class), any(Pageable.class)))
                .thenReturn(new PageImpl<>(Arrays.asList(sample)));
        mockMvc.perform(get("/api/report"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].name").value("Test User"));
    }

    @Test
    void testGetById() throws Exception {
        when(repository.findById(1L)).thenReturn(Optional.of(sample));
        mockMvc.perform(get("/api/report/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Test User"));
    }
}
