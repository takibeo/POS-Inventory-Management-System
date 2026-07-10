-- V008: Seed demo sale invoices (20 invoices across 2-3 weeks)
-- Insert sale invoices (no explicit transaction markers; Flyway manages transactions)
INSERT INTO sale_invoices (invoice_number, branch_id, cashier_id, customer_name, status, total_amount, tax, discount, payment_method, amount_paid, created_at)
VALUES
('SI-2024-001', (SELECT id FROM branches WHERE name='Chi nhánh Trung tâm'), (SELECT id FROM users WHERE username='admin'), 'Khách lẻ', 'COMPLETED', 0, 0, 0, 'CASH', 0, '2024-06-01'::timestamp),
('SI-2024-002', (SELECT id FROM branches WHERE name='Chi nhánh Phụ'), (SELECT id FROM users WHERE username='admin'), 'Công ty A', 'COMPLETED', 0, 0, 0, 'CARD', 0, '2024-06-02'::timestamp),
('SI-2024-003', (SELECT id FROM branches WHERE name='Chi nhánh Trung tâm'), (SELECT id FROM users WHERE username='admin'), 'Khách lẻ', 'COMPLETED', 0, 0, 0, 'CASH', 0, '2024-06-03'::timestamp),
('SI-2024-004', (SELECT id FROM branches WHERE name='Chi nhánh Phụ'), (SELECT id FROM users WHERE username='admin'), 'Khách lẻ', 'COMPLETED', 0, 0, 0, 'TRANSFER', 0, '2024-06-04'::timestamp),
('SI-2024-005', (SELECT id FROM branches WHERE name='Chi nhánh Trung tâm'), (SELECT id FROM users WHERE username='admin'), 'Công ty B', 'COMPLETED', 0, 0, 0, 'CARD', 0, '2024-06-06'::timestamp),
('SI-2024-006', (SELECT id FROM branches WHERE name='Chi nhánh Phụ'), (SELECT id FROM users WHERE username='admin'), 'Khách lẻ', 'COMPLETED', 0, 0, 0, 'CASH', 0, '2024-06-07'::timestamp),
('SI-2024-007', (SELECT id FROM branches WHERE name='Chi nhánh Trung tâm'), (SELECT id FROM users WHERE username='admin'), 'Khách lẻ', 'COMPLETED', 0, 0, 0, 'CASH', 0, '2024-06-09'::timestamp),
('SI-2024-008', (SELECT id FROM branches WHERE name='Chi nhánh Phụ'), (SELECT id FROM users WHERE username='admin'), 'Công ty C', 'COMPLETED', 0, 0, 0, 'CARD', 0, '2024-06-10'::timestamp),
('SI-2024-009', (SELECT id FROM branches WHERE name='Chi nhánh Trung tâm'), (SELECT id FROM users WHERE username='admin'), 'Khách lẻ', 'COMPLETED', 0, 0, 0, 'CASH', 0, '2024-06-11'::timestamp),
('SI-2024-010', (SELECT id FROM branches WHERE name='Chi nhánh Phụ'), (SELECT id FROM users WHERE username='admin'), 'Khách lẻ', 'COMPLETED', 0, 0, 0, 'CASH', 0, '2024-06-13'::timestamp),
('SI-2024-011', (SELECT id FROM branches WHERE name='Chi nhánh Trung tâm'), (SELECT id FROM users WHERE username='admin'), 'Công ty D', 'COMPLETED', 0, 0, 0, 'TRANSFER', 0, '2024-06-14'::timestamp),
('SI-2024-012', (SELECT id FROM branches WHERE name='Chi nhánh Phụ'), (SELECT id FROM users WHERE username='admin'), 'Khách lẻ', 'COMPLETED', 0, 0, 0, 'CARD', 0, '2024-06-15'::timestamp),
('SI-2024-013', (SELECT id FROM branches WHERE name='Chi nhánh Trung tâm'), (SELECT id FROM users WHERE username='admin'), 'Khách lẻ', 'COMPLETED', 0, 0, 0, 'CASH', 0, '2024-06-17'::timestamp),
('SI-2024-014', (SELECT id FROM branches WHERE name='Chi nhánh Phụ'), (SELECT id FROM users WHERE username='admin'), 'Công ty E', 'COMPLETED', 0, 0, 0, 'CARD', 0, '2024-06-18'::timestamp),
('SI-2024-015', (SELECT id FROM branches WHERE name='Chi nhánh Trung tâm'), (SELECT id FROM users WHERE username='admin'), 'Khách lẻ', 'COMPLETED', 0, 0, 0, 'CASH', 0, '2024-06-19'::timestamp),
('SI-2024-016', (SELECT id FROM branches WHERE name='Chi nhánh Phụ'), (SELECT id FROM users WHERE username='admin'), 'Khách lẻ', 'COMPLETED', 0, 0, 0, 'CASH', 0, '2024-06-20'::timestamp),
('SI-2024-017', (SELECT id FROM branches WHERE name='Chi nhánh Trung tâm'), (SELECT id FROM users WHERE username='admin'), 'Công ty F', 'COMPLETED', 0, 0, 0, 'TRANSFER', 0, '2024-06-21'::timestamp),
('SI-2024-018', (SELECT id FROM branches WHERE name='Chi nhánh Phụ'), (SELECT id FROM users WHERE username='admin'), 'Khách lẻ', 'COMPLETED', 0, 0, 0, 'CARD', 0, '2024-06-22'::timestamp),
('SI-2024-019', (SELECT id FROM branches WHERE name='Chi nhánh Trung tâm'), (SELECT id FROM users WHERE username='admin'), 'Khách lẻ', 'COMPLETED', 0, 0, 0, 'CASH', 0, '2024-06-23'::timestamp),
('SI-2024-020', (SELECT id FROM branches WHERE name='Chi nhánh Phụ'), (SELECT id FROM users WHERE username='admin'), 'Khách lẻ', 'COMPLETED', 0, 0, 0, 'CASH', 0, '2024-06-24'::timestamp);

-- Insert items (1-3 items per invoice)
-- SI-2024-001: 1 item
INSERT INTO sale_invoice_items (sale_invoice_id, product_id, quantity, unit_price, discount, created_at)
VALUES ((SELECT id FROM sale_invoices WHERE invoice_number='SI-2024-001'), (SELECT id FROM products WHERE name='iPhone 15 Pro Max 256GB'), 1, 30000000.00, 0, '2024-06-01'::timestamp);

-- SI-2024-002: 2 items
INSERT INTO sale_invoice_items (sale_invoice_id, product_id, quantity, unit_price, discount, created_at)
VALUES ((SELECT id FROM sale_invoices WHERE invoice_number='SI-2024-002'), (SELECT id FROM products WHERE name='AirPods Pro 2 USB-C'), 2, 4400000.00, 0, '2024-06-02'::timestamp),
       ((SELECT id FROM sale_invoices WHERE invoice_number='SI-2024-002'), (SELECT id FROM products WHERE name='Ốp lưng iPhone 15 (cao cấp)'), 3, 200000.00, 0, '2024-06-02'::timestamp);

-- SI-2024-003: 1 item
INSERT INTO sale_invoice_items (sale_invoice_id, product_id, quantity, unit_price, discount, created_at)
VALUES ((SELECT id FROM sale_invoices WHERE invoice_number='SI-2024-003'), (SELECT id FROM products WHERE name='MacBook Pro 14 M3 Pro'), 1, 36000000.00, 0, '2024-06-03'::timestamp);

-- SI-2024-004: 3 items
INSERT INTO sale_invoice_items (sale_invoice_id, product_id, quantity, unit_price, discount, created_at)
VALUES ((SELECT id FROM sale_invoices WHERE invoice_number='SI-2024-004'), (SELECT id FROM products WHERE name='Sạc nhanh 65W GaN'), 2, 700000.00, 0, '2024-06-04'::timestamp),
       ((SELECT id FROM sale_invoices WHERE invoice_number='SI-2024-004'), (SELECT id FROM products WHERE name='Cáp sạc USB-C (2m)'), 1, 120000.00, 0, '2024-06-04'::timestamp),
       ((SELECT id FROM sale_invoices WHERE invoice_number='SI-2024-004'), (SELECT id FROM products WHERE name='Loa Bluetooth JBL Flip 6'), 1, 1000000.00, 0, '2024-06-04'::timestamp);

-- SI-2024-005: 2 items
INSERT INTO sale_invoice_items (sale_invoice_id, product_id, quantity, unit_price, discount, created_at)
VALUES ((SELECT id FROM sale_invoices WHERE invoice_number='SI-2024-005'), (SELECT id FROM products WHERE name='Dell XPS 16 Ultra'), 1, 29000000.00, 0, '2024-06-06'::timestamp),
       ((SELECT id FROM sale_invoices WHERE invoice_number='SI-2024-005'), (SELECT id FROM products WHERE name='iPad Pro 12.9 M2'), 1, 21000000.00, 0, '2024-06-06'::timestamp);

-- SI-2024-006: 1 item
INSERT INTO sale_invoice_items (sale_invoice_id, product_id, quantity, unit_price, discount, created_at)
VALUES ((SELECT id FROM sale_invoices WHERE invoice_number='SI-2024-006'), (SELECT id FROM products WHERE name='AirPods Pro 2 USB-C'), 1, 4400000.00, 0, '2024-06-07'::timestamp);

-- SI-2024-007: 3 items
INSERT INTO sale_invoice_items (sale_invoice_id, product_id, quantity, unit_price, discount, created_at)
VALUES ((SELECT id FROM sale_invoices WHERE invoice_number='SI-2024-007'), (SELECT id FROM products WHERE name='Samsung Galaxy S24 Ultra 512GB'), 1, 26000000.00, 0, '2024-06-09'::timestamp),
       ((SELECT id FROM sale_invoices WHERE invoice_number='SI-2024-007'), (SELECT id FROM products WHERE name='Ốp lưng iPhone 15 (cao cấp)'), 2, 200000.00, 0, '2024-06-09'::timestamp),
       ((SELECT id FROM sale_invoices WHERE invoice_number='SI-2024-007'), (SELECT id FROM products WHERE name='Cáp sạc USB-C (2m)'), 2, 120000.00, 0, '2024-06-09'::timestamp);

-- SI-2024-008: 1 item
INSERT INTO sale_invoice_items (sale_invoice_id, product_id, quantity, unit_price, discount, created_at)
VALUES ((SELECT id FROM sale_invoices WHERE invoice_number='SI-2024-008'), (SELECT id FROM products WHERE name='Loa Bluetooth JBL Flip 6'), 1, 1000000.00, 0, '2024-06-10'::timestamp);

-- SI-2024-009: 2 items
INSERT INTO sale_invoice_items (sale_invoice_id, product_id, quantity, unit_price, discount, created_at)
VALUES ((SELECT id FROM sale_invoices WHERE invoice_number='SI-2024-009'), (SELECT id FROM products WHERE name='MacBook Pro 14 M3 Pro'), 1, 36000000.00, 0, '2024-06-11'::timestamp),
       ((SELECT id FROM sale_invoices WHERE invoice_number='SI-2024-009'), (SELECT id FROM products WHERE name='AirPods Pro 2 USB-C'), 1, 4400000.00, 0, '2024-06-11'::timestamp);

-- SI-2024-010: 1 item
INSERT INTO sale_invoice_items (sale_invoice_id, product_id, quantity, unit_price, discount, created_at)
VALUES ((SELECT id FROM sale_invoices WHERE invoice_number='SI-2024-010'), (SELECT id FROM products WHERE name='Sổ tay A5 (da cao cấp)'), 5, 40000.00, 0, '2024-06-13'::timestamp);

-- SI-2024-011: 2 items
INSERT INTO sale_invoice_items (sale_invoice_id, product_id, quantity, unit_price, discount, created_at)
VALUES ((SELECT id FROM sale_invoices WHERE invoice_number='SI-2024-011'), (SELECT id FROM products WHERE name='Máy in HP LaserJet MFP203'), 1, 9500000.00, 0, '2024-06-14'::timestamp),
       ((SELECT id FROM sale_invoices WHERE invoice_number='SI-2024-011'), (SELECT id FROM products WHERE name='Kẹp tài liệu (bộ 10 cái)'), 2, 20000.00, 0, '2024-06-14'::timestamp);

-- SI-2024-012: 1 item
INSERT INTO sale_invoice_items (sale_invoice_id, product_id, quantity, unit_price, discount, created_at)
VALUES ((SELECT id FROM sale_invoices WHERE invoice_number='SI-2024-012'), (SELECT id FROM products WHERE name='Quạt điện Senko (cao cấp)'), 3, 600000.00, 0, '2024-06-15'::timestamp);

-- SI-2024-013: 3 items
INSERT INTO sale_invoice_items (sale_invoice_id, product_id, quantity, unit_price, discount, created_at)
VALUES ((SELECT id FROM sale_invoices WHERE invoice_number='SI-2024-013'), (SELECT id FROM products WHERE name='Tủ lạnh Samsung Inverter 450L'), 1, 13500000.00, 0, '2024-06-17'::timestamp),
       ((SELECT id FROM sale_invoices WHERE invoice_number='SI-2024-013'), (SELECT id FROM products WHERE name='Máy giặt LG Inverter 9kg'), 1, 11000000.00, 0, '2024-06-17'::timestamp),
       ((SELECT id FROM sale_invoices WHERE invoice_number='SI-2024-013'), (SELECT id FROM products WHERE name='Máy hút bụi Dyson V15'), 1, 6000000.00, 0, '2024-06-17'::timestamp);

-- SI-2024-014: 1 item
INSERT INTO sale_invoice_items (sale_invoice_id, product_id, quantity, unit_price, discount, created_at)
VALUES ((SELECT id FROM sale_invoices WHERE invoice_number='SI-2024-014'), (SELECT id FROM products WHERE name='Bếp từ Sunhouse 2 vùng nấu'), 1, 3200000.00, 0, '2024-06-18'::timestamp);

-- SI-2024-015: 2 items
INSERT INTO sale_invoice_items (sale_invoice_id, product_id, quantity, unit_price, discount, created_at)
VALUES ((SELECT id FROM sale_invoices WHERE invoice_number='SI-2024-015'), (SELECT id FROM products WHERE name='Máy chiếu Epson EB-FH06'), 1, 12000000.00, 0, '2024-06-19'::timestamp),
       ((SELECT id FROM sale_invoices WHERE invoice_number='SI-2024-015'), (SELECT id FROM products WHERE name='Máy scan Canon DR-C225'), 1, 3000000.00, 0, '2024-06-19'::timestamp);

-- SI-2024-016: 1 item
INSERT INTO sale_invoice_items (sale_invoice_id, product_id, quantity, unit_price, discount, created_at)
VALUES ((SELECT id FROM sale_invoices WHERE invoice_number='SI-2024-016'), (SELECT id FROM products WHERE name='Bút bi Thiên Long (hộp 100)'), 10, 70000.00, 0, '2024-06-20'::timestamp);

-- SI-2024-017: 1 item
INSERT INTO sale_invoice_items (sale_invoice_id, product_id, quantity, unit_price, discount, created_at)
VALUES ((SELECT id FROM sale_invoices WHERE invoice_number='SI-2024-017'), (SELECT id FROM products WHERE name='Máy in HP LaserJet MFP203'), 1, 9500000.00, 0, '2024-06-21'::timestamp);

-- SI-2024-018: 2 items
INSERT INTO sale_invoice_items (sale_invoice_id, product_id, quantity, unit_price, discount, created_at)
VALUES ((SELECT id FROM sale_invoices WHERE invoice_number='SI-2024-018'), (SELECT id FROM products WHERE name='AirPods Pro 2 USB-C'), 2, 4400000.00, 0, '2024-06-22'::timestamp),
       ((SELECT id FROM sale_invoices WHERE invoice_number='SI-2024-018'), (SELECT id FROM products WHERE name='Cáp sạc USB-C (2m)'), 1, 120000.00, 0, '2024-06-22'::timestamp);

-- SI-2024-019: 1 item
INSERT INTO sale_invoice_items (sale_invoice_id, product_id, quantity, unit_price, discount, created_at)
VALUES ((SELECT id FROM sale_invoices WHERE invoice_number='SI-2024-019'), (SELECT id FROM products WHERE name='iPad Pro 12.9 M2'), 1, 21000000.00, 0, '2024-06-23'::timestamp);

-- SI-2024-020: 3 items
INSERT INTO sale_invoice_items (sale_invoice_id, product_id, quantity, unit_price, discount, created_at)
VALUES ((SELECT id FROM sale_invoices WHERE invoice_number='SI-2024-020'), (SELECT id FROM products WHERE name='Xiaomi 14 Pro 512GB'), 1, 14000000.00, 0, '2024-06-24'::timestamp),
       ((SELECT id FROM sale_invoices WHERE invoice_number='SI-2024-020'), (SELECT id FROM products WHERE name='Ốp lưng iPhone 15 (cao cấp)'), 2, 200000.00, 0, '2024-06-24'::timestamp),
       ((SELECT id FROM sale_invoices WHERE invoice_number='SI-2024-020'), (SELECT id FROM products WHERE name='Cáp sạc USB-C (2m)'), 1, 120000.00, 0, '2024-06-24'::timestamp);


-- Update sale_invoices total_amount from items
UPDATE sale_invoices si
SET total_amount = COALESCE(sub.total,0)
FROM (
  SELECT sale_invoice_id, SUM(quantity * unit_price - COALESCE(discount,0)) AS total
  FROM sale_invoice_items
  GROUP BY sale_invoice_id
) sub
WHERE si.id = sub.sale_invoice_id;
