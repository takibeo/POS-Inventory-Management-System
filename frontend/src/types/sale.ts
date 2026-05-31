export interface SaleItem {
  productId: string;
  quantity: number;
  unitPrice: number;
  discount?: number;
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
