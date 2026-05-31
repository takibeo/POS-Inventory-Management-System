export interface Product {
  id: string;
  sku: string;
  name: string;
  description?: string;
  categoryId?: string;
  supplierId?: string;
  price: number;
  cost: number;
  unit?: string;
  reorderLevel?: number;
  isActive?: boolean;
}
