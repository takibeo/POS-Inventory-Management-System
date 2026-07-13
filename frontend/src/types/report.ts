export interface RevenueReport {
  date: string;
  revenue: number;
}

export interface ProfitReport {
  date: string;
  profit: number;
}

export interface RevenueReportResponse {
  totalRevenue: number;
  totalTax: number;
  totalDiscount: number;
  totalOrders: number;
  totalItems: number;
}

export interface ProfitReportResponse {
  totalRevenue: number;
  totalCost: number;
  totalProfit: number;
  totalOrders: number;
}

export interface BestSeller {
  productName: string;
  quantitySold: number;
}

export interface LowStockItem {
  branchName: string;
  productName: string;
  quantity: number;
  reorderLevel: number;
}

//chart theo ngày
export interface RevenueTrend {
  date: string;
  revenue: number;
}

export interface ProfitTrend {
  date: string;
  profit: number;
}

export interface CategoryBreakdown {
  categoryName: string;
  productCount: number;
}