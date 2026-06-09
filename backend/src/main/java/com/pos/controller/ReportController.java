package com.pos.controller;

import com.pos.dto.response.BestSellerReportResponse;
import com.pos.dto.response.LowStockReportResponse;
import com.pos.dto.response.ProfitReportResponse;
import com.pos.dto.response.RevenueReportResponse;
import com.pos.service.ReportService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reports")
@Tag(name = "Reports", description = "Báo cáo doanh thu, lợi nhuận, hàng bán chạy và tồn kho thấp")
public class ReportController {

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @GetMapping("/revenue")
    @Operation(summary = "Báo cáo doanh thu")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<RevenueReportResponse> getRevenueReport() {
        return ResponseEntity.ok(reportService.getRevenueReport());
    }

    @GetMapping("/profit")
    @Operation(summary = "Báo cáo lợi nhuận")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<ProfitReportResponse> getProfitReport() {
        return ResponseEntity.ok(reportService.getProfitReport());
    }

    @GetMapping("/best-sellers")
    @Operation(summary = "Báo cáo sản phẩm bán chạy")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<List<BestSellerReportResponse>> getBestSellers(
            @RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(reportService.getBestSellers(limit));
    }

    @GetMapping("/low-stock")
    @Operation(summary = "Báo cáo tồn kho thấp")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<List<LowStockReportResponse>> getLowStock() {
        return ResponseEntity.ok(reportService.getLowStockReport());
    }
}
