export interface PurchaseOrderItem {
  productId: string;
  quantity: number;
  cost: number;
}

export interface PurchaseOrder {
  id: string;
  orderNumber: string;
  supplierId: string;
  branchId: string;
  status: string;
  totalAmount: number;
  items: PurchaseOrderItem[];
}
