ALTER TABLE inventories
    ADD COLUMN IF NOT EXISTS available_quantity INTEGER NOT NULL DEFAULT 0;

UPDATE inventories
SET available_quantity = GREATEST(0, quantity - COALESCE(reserved_quantity, 0));
