-- V009: Add subtotal column to sale_invoice_items used by SaleInvoiceItem entity
ALTER TABLE sale_invoice_items
    ADD COLUMN subtotal double precision DEFAULT 0;

-- Populate subtotal for existing rows
UPDATE sale_invoice_items
SET subtotal = COALESCE(quantity,0) * COALESCE(unit_price,0)
WHERE subtotal IS NULL OR subtotal = 0;
