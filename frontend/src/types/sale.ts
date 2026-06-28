export interface SaleItem {
  productId: string;
  quantity: number;
  unitPrice: number;
  discount?: number;
}

export interface SaleInvoiceRequest {
  branchId: string;
  cashierId: string;
  paymentMethod: string;
  customerName?: string;
  tax?: number;
  discount?: number;
  amountPaid?: number;
  items: SaleItem[];
}

export interface SaleInvoice {
  id: string;
  invoiceNumber: string;
  branchId: string;
  cashierId: string;
  customerName?: string;
  totalAmount: number;
  paymentMethod: string;
  amountPaid: number;
  changeAmount: number;
  items: SaleItem[];
}
