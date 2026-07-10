-- Add subtotal column to purchase_order_items used by PurchaseOrderItem entity
ALTER TABLE purchase_order_items
    ADD COLUMN subtotal double precision DEFAULT 0;

-- Optionally populate existing rows if cost and quantity are present
UPDATE purchase_order_items
SET subtotal = COALESCE(quantity,0) * COALESCE(cost,0)
WHERE subtotal IS NULL;
