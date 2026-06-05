export interface ProductRef {
  id: string;
  name?: string;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  description?: string;
  category?: ProductRef;
  supplier?: ProductRef;
  categoryId?: string;
  supplierId?: string;
  price: number;
  cost: number;
  unit?: string;
  reorderLevel?: number;
  isActive?: boolean;
}

export type ProductFormValues = {
  sku: string;
  name: string;
  description?: string;
  categoryId?: string;
  supplierId?: string;
  price: number;
  cost: number;
  unit?: string;
  reorderLevel?: number;
  isActive: boolean;
};
