package com.pos.service;

import com.pos.dto.response.BestSellerReportResponse;
import com.pos.dto.response.LowStockReportResponse;
import com.pos.dto.response.ProfitReportResponse;
import com.pos.dto.response.RevenueReportResponse;

import java.util.List;

public interface ReportService {
    RevenueReportResponse getRevenueReport();
    ProfitReportResponse getProfitReport();
    List<BestSellerReportResponse> getBestSellers(int limit);
    List<LowStockReportResponse> getLowStockReport();
}
