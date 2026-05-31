export interface Inventory {
  id: string;
  branchId: string;
  productId: string;
  quantity: number;
  reservedQuantity: number;
  availableQuantity: number;
}
