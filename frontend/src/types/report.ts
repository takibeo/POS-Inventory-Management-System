export interface RevenueReport {
  date: string;
  revenue: number;
}

export interface ProfitReport {
  date: string;
  profit: number;
}

export interface BestSeller {
  productName: string;
  quantitySold: number;
}

export interface LowStockItem {
  productName: string;
  quantity: number;
  reorderLevel: number;
}
