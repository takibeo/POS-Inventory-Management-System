package com.pos.controller;

import com.pos.dto.response.RevenueReportResponse;
import com.pos.service.ReportService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(org.mockito.junit.jupiter.MockitoExtension.class)
class ReportControllerIT {

    private MockMvc mockMvc;
    @org.mockito.Mock private ReportService reportService;

    @org.junit.jupiter.api.BeforeEach
    void setUp() {
        ReportController controller = new ReportController(reportService);
        mockMvc = org.springframework.test.web.servlet.setup.MockMvcBuilders.standaloneSetup(controller).build();
    }

    @org.junit.jupiter.api.Test
    void getRevenueReport_returnsOk() throws Exception {
        RevenueReportResponse r = new RevenueReportResponse(); r.setTotalRevenue(100.0); r.setTotalOrders(2); r.setTotalItems(5);
        when(reportService.getRevenueReport()).thenReturn(r);

        mockMvc.perform(get("/api/reports/revenue").contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalRevenue").value(100.0));
    }
}
