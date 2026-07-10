-- Expand allowed statuses for purchase_orders.status to match application values
ALTER TABLE purchase_orders DROP CONSTRAINT IF EXISTS purchase_orders_status_check;

ALTER TABLE purchase_orders
  ADD CONSTRAINT purchase_orders_status_check CHECK (status IN (
    'PENDING','APPROVED','RECEIVED','CANCELLED','DRAFT','SUBMITTED'
  ));
