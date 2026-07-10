-- V007: Remove existing purchase orders and insert demo purchase orders + items
BEGIN;

-- Remove existing purchase orders and items
DELETE FROM purchase_order_items;
DELETE FROM purchase_orders;

-- Ensure suppliers exist
INSERT INTO suppliers (name, created_at, updated_at)
SELECT 'Công ty TNHH Điện tử Việt Nam', now(), now()
WHERE NOT EXISTS (SELECT 1 FROM suppliers WHERE name = 'Công ty TNHH Điện tử Việt Nam');

INSERT INTO suppliers (name, created_at, updated_at)
SELECT 'Công ty TNHH Phụ kiện Công nghệ Xanh', now(), now()
WHERE NOT EXISTS (SELECT 1 FROM suppliers WHERE name = 'Công ty TNHH Phụ kiện Công nghệ Xanh');

INSERT INTO suppliers (name, created_at, updated_at)
SELECT 'Công ty CP Thiết bị Gia dụng ABC', now(), now()
WHERE NOT EXISTS (SELECT 1 FROM suppliers WHERE name = 'Công ty CP Thiết bị Gia dụng ABC');

INSERT INTO suppliers (name, created_at, updated_at)
SELECT 'Công ty CP Đồ gia dụng Nhà bếp Việt', now(), now()
WHERE NOT EXISTS (SELECT 1 FROM suppliers WHERE name = 'Công ty CP Đồ gia dụng Nhà bếp Việt');

INSERT INTO suppliers (name, created_at, updated_at)
SELECT 'Công ty TNHH Thiết bị Văn phòng Phú Đạt', now(), now()
WHERE NOT EXISTS (SELECT 1 FROM suppliers WHERE name = 'Công ty TNHH Thiết bị Văn phòng Phú Đạt');

-- Ensure branches exist
INSERT INTO branches (name, code, created_at, updated_at)
SELECT 'Chi nhánh Trung tâm', 'BR-CENTRAL', now(), now()
WHERE NOT EXISTS (SELECT 1 FROM branches WHERE name = 'Chi nhánh Trung tâm');

INSERT INTO branches (name, code, created_at, updated_at)
SELECT 'Chi nhánh Phụ', 'BR-PHU', now(), now()
WHERE NOT EXISTS (SELECT 1 FROM branches WHERE name = 'Chi nhánh Phụ');

-- Ensure products exist (with supplier association)
-- Order 1 products (supplier: Công ty TNHH Điện tử Việt Nam)
INSERT INTO products (sku, name, supplier_id, price, cost, created_at, updated_at)
SELECT 'SKU-IPH15-256', 'iPhone 15 Pro Max 256GB', s.id, 30000000, 25000000, now(), now()
FROM suppliers s
WHERE s.name = 'Công ty TNHH Điện tử Việt Nam'
  AND NOT EXISTS (SELECT 1 FROM products p WHERE p.name = 'iPhone 15 Pro Max 256GB');

INSERT INTO products (sku, name, supplier_id, price, cost, created_at, updated_at)
SELECT 'SKU-SAM24U-512', 'Samsung Galaxy S24 Ultra 512GB', s.id, 26000000, 22000000, now(), now()
FROM suppliers s
WHERE s.name = 'Công ty TNHH Điện tử Việt Nam'
  AND NOT EXISTS (SELECT 1 FROM products p WHERE p.name = 'Samsung Galaxy S24 Ultra 512GB');

INSERT INTO products (sku, name, supplier_id, price, cost, created_at, updated_at)
SELECT 'SKU-XIA14-512', 'Xiaomi 14 Pro 512GB', s.id, 14000000, 13000000, now(), now()
FROM suppliers s
WHERE s.name = 'Công ty TNHH Điện tử Việt Nam'
  AND NOT EXISTS (SELECT 1 FROM products p WHERE p.name = 'Xiaomi 14 Pro 512GB');

INSERT INTO products (sku, name, supplier_id, price, cost, created_at, updated_at)
SELECT 'SKU-MBP14-M3', 'MacBook Pro 14 M3 Pro', s.id, 36000000, 33000000, now(), now()
FROM suppliers s
WHERE s.name = 'Công ty TNHH Điện tử Việt Nam'
  AND NOT EXISTS (SELECT 1 FROM products p WHERE p.name = 'MacBook Pro 14 M3 Pro');

INSERT INTO products (sku, name, supplier_id, price, cost, created_at, updated_at)
SELECT 'SKU-DELL-XPS16', 'Dell XPS 16 Ultra', s.id, 29000000, 28000000, now(), now()
FROM suppliers s
WHERE s.name = 'Công ty TNHH Điện tử Việt Nam'
  AND NOT EXISTS (SELECT 1 FROM products p WHERE p.name = 'Dell XPS 16 Ultra');

INSERT INTO products (sku, name, supplier_id, price, cost, created_at, updated_at)
SELECT 'SKU-IPAD-PRO-12-9', 'iPad Pro 12.9 M2', s.id, 21000000, 18500000, now(), now()
FROM suppliers s
WHERE s.name = 'Công ty TNHH Điện tử Việt Nam'
  AND NOT EXISTS (SELECT 1 FROM products p WHERE p.name = 'iPad Pro 12.9 M2');

-- Order 2 products (supplier: Công ty TNHH Phụ kiện Công nghệ Xanh)
INSERT INTO products (sku, name, supplier_id, price, cost, created_at, updated_at)
SELECT 'SKU-AIRPODS-PRO-2', 'AirPods Pro 2 USB-C', s.id, 4400000, 3800000, now(), now()
FROM suppliers s
WHERE s.name = 'Công ty TNHH Phụ kiện Công nghệ Xanh'
  AND NOT EXISTS (SELECT 1 FROM products p WHERE p.name = 'AirPods Pro 2 USB-C');

INSERT INTO products (sku, name, supplier_id, price, cost, created_at, updated_at)
SELECT 'SKU-CHARGER-65W', 'Sạc nhanh 65W GaN', s.id, 700000, 550000, now(), now()
FROM suppliers s
WHERE s.name = 'Công ty TNHH Phụ kiện Công nghệ Xanh'
  AND NOT EXISTS (SELECT 1 FROM products p WHERE p.name = 'Sạc nhanh 65W GaN');

INSERT INTO products (sku, name, supplier_id, price, cost, created_at, updated_at)
SELECT 'SKU-JBL-FLIP6', 'Loa Bluetooth JBL Flip 6', s.id, 1000000, 850000, now(), now()
FROM suppliers s
WHERE s.name = 'Công ty TNHH Phụ kiện Công nghệ Xanh'
  AND NOT EXISTS (SELECT 1 FROM products p WHERE p.name = 'Loa Bluetooth JBL Flip 6');

INSERT INTO products (sku, name, supplier_id, price, cost, created_at, updated_at)
SELECT 'SKU-CASE-IP15', 'Ốp lưng iPhone 15 (cao cấp)', s.id, 200000, 150000, now(), now()
FROM suppliers s
WHERE s.name = 'Công ty TNHH Phụ kiện Công nghệ Xanh'
  AND NOT EXISTS (SELECT 1 FROM products p WHERE p.name = 'Ốp lưng iPhone 15 (cao cấp)');

INSERT INTO products (sku, name, supplier_id, price, cost, created_at, updated_at)
SELECT 'SKU-CABLE-2M', 'Cáp sạc USB-C (2m)', s.id, 120000, 80000, now(), now()
FROM suppliers s
WHERE s.name = 'Công ty TNHH Phụ kiện Công nghệ Xanh'
  AND NOT EXISTS (SELECT 1 FROM products p WHERE p.name = 'Cáp sạc USB-C (2m)');

-- Order 3 products (supplier: Công ty CP Thiết bị Gia dụng ABC)
INSERT INTO products (sku, name, supplier_id, price, cost, created_at, updated_at)
SELECT 'SKU-RF-SAMSUNG-450L', 'Tủ lạnh Samsung Inverter 450L', s.id, 13500000, 12500000, now(), now()
FROM suppliers s
WHERE s.name = 'Công ty CP Thiết bị Gia dụng ABC'
  AND NOT EXISTS (SELECT 1 FROM products p WHERE p.name = 'Tủ lạnh Samsung Inverter 450L');

INSERT INTO products (sku, name, supplier_id, price, cost, created_at, updated_at)
SELECT 'SKU-WM-LG-9KG', 'Máy giặt LG Inverter 9kg', s.id, 11000000, 10000000, now(), now()
FROM suppliers s
WHERE s.name = 'Công ty CP Thiết bị Gia dụng ABC'
  AND NOT EXISTS (SELECT 1 FROM products p WHERE p.name = 'Máy giặt LG Inverter 9kg');

INSERT INTO products (sku, name, supplier_id, price, cost, created_at, updated_at)
SELECT 'SKU-AC-DAIKIN-15', 'Điều hòa Daikin Inverter 1.5HP', s.id, 9000000, 8750000, now(), now()
FROM suppliers s
WHERE s.name = 'Công ty CP Thiết bị Gia dụng ABC'
  AND NOT EXISTS (SELECT 1 FROM products p WHERE p.name = 'Điều hòa Daikin Inverter 1.5HP');

INSERT INTO products (sku, name, supplier_id, price, cost, created_at, updated_at)
SELECT 'SKU-HV-DYSON-V15', 'Máy hút bụi Dyson V15', s.id, 6000000, 5200000, now(), now()
FROM suppliers s
WHERE s.name = 'Công ty CP Thiết bị Gia dụng ABC'
  AND NOT EXISTS (SELECT 1 FROM products p WHERE p.name = 'Máy hút bụi Dyson V15');

INSERT INTO products (sku, name, supplier_id, price, cost, created_at, updated_at)
SELECT 'SKU-FAN-SENKO', 'Quạt điện Senko (cao cấp)', s.id, 600000, 550000, now(), now()
FROM suppliers s
WHERE s.name = 'Công ty CP Thiết bị Gia dụng ABC'
  AND NOT EXISTS (SELECT 1 FROM products p WHERE p.name = 'Quạt điện Senko (cao cấp)');

-- Order 4 products (supplier: Công ty CP Đồ gia dụng Nhà bếp Việt)
INSERT INTO products (sku, name, supplier_id, price, cost, created_at, updated_at)
SELECT 'SKU-ZOJIRUSHI-1.8', 'Nồi cơm điện Zojirushi 1.8L', s.id, 3000000, 2800000, now(), now()
FROM suppliers s
WHERE s.name = 'Công ty CP Đồ gia dụng Nhà bếp Việt'
  AND NOT EXISTS (SELECT 1 FROM products p WHERE p.name = 'Nồi cơm điện Zojirushi 1.8L');

INSERT INTO products (sku, name, supplier_id, price, cost, created_at, updated_at)
SELECT 'SKU-SUNHOUSE-2B', 'Bếp từ Sunhouse 2 vùng nấu', s.id, 3200000, 3200000, now(), now()
FROM suppliers s
WHERE s.name = 'Công ty CP Đồ gia dụng Nhà bếp Việt'
  AND NOT EXISTS (SELECT 1 FROM products p WHERE p.name = 'Bếp từ Sunhouse 2 vùng nấu');

INSERT INTO products (sku, name, supplier_id, price, cost, created_at, updated_at)
SELECT 'SKU-SHARP-MW-25', 'Lò vi sóng Sharp 25L', s.id, 2200000, 2000000, now(), now()
FROM suppliers s
WHERE s.name = 'Công ty CP Đồ gia dụng Nhà bếp Việt'
  AND NOT EXISTS (SELECT 1 FROM products p WHERE p.name = 'Lò vi sóng Sharp 25L');

INSERT INTO products (sku, name, supplier_id, price, cost, created_at, updated_at)
SELECT 'SKU-PHILIPS-BLEND', 'Máy xay sinh tố Philips', s.id, 1200000, 950000, now(), now()
FROM suppliers s
WHERE s.name = 'Công ty CP Đồ gia dụng Nhà bếp Việt'
  AND NOT EXISTS (SELECT 1 FROM products p WHERE p.name = 'Máy xay sinh tố Philips');

INSERT INTO products (sku, name, supplier_id, price, cost, created_at, updated_at)
SELECT 'SKU-KET-3500', 'Ấm đun nước siêu tốc', s.id, 400000, 350000, now(), now()
FROM suppliers s
WHERE s.name = 'Công ty CP Đồ gia dụng Nhà bếp Việt'
  AND NOT EXISTS (SELECT 1 FROM products p WHERE p.name = 'Ấm đun nước siêu tốc');

INSERT INTO products (sku, name, supplier_id, price, cost, created_at, updated_at)
SELECT 'SKU-COOKWARE-5', 'Bộ nồi chảo chống dính (5 món)', s.id, 1500000, 1200000, now(), now()
FROM suppliers s
WHERE s.name = 'Công ty CP Đồ gia dụng Nhà bếp Việt'
  AND NOT EXISTS (SELECT 1 FROM products p WHERE p.name = 'Bộ nồi chảo chống dính (5 món)');

-- Order 5 products (supplier: Công ty TNHH Thiết bị Văn phòng Phú Đạt)
INSERT INTO products (sku, name, supplier_id, price, cost, created_at, updated_at)
SELECT 'SKU-HP-MFP203', 'Máy in HP LaserJet MFP203', s.id, 9500000, 7600000, now(), now()
FROM suppliers s
WHERE s.name = 'Công ty TNHH Thiết bị Văn phòng Phú Đạt'
  AND NOT EXISTS (SELECT 1 FROM products p WHERE p.name = 'Máy in HP LaserJet MFP203');

INSERT INTO products (sku, name, supplier_id, price, cost, created_at, updated_at)
SELECT 'SKU-EPSON-PRJ', 'Máy chiếu Epson EB-FH06', s.id, 12000000, 10000000, now(), now()
FROM suppliers s
WHERE s.name = 'Công ty TNHH Thiết bị Văn phòng Phú Đạt'
  AND NOT EXISTS (SELECT 1 FROM products p WHERE p.name = 'Máy chiếu Epson EB-FH06');

INSERT INTO products (sku, name, supplier_id, price, cost, created_at, updated_at)
SELECT 'SKU-CANON-SCAN', 'Máy scan Canon DR-C225', s.id, 3000000, 2500000, now(), now()
FROM suppliers s
WHERE s.name = 'Công ty TNHH Thiết bị Văn phòng Phú Đạt'
  AND NOT EXISTS (SELECT 1 FROM products p WHERE p.name = 'Máy scan Canon DR-C225');

INSERT INTO products (sku, name, supplier_id, price, cost, created_at, updated_at)
SELECT 'SKU-BL-TIENLONG', 'Bút bi Thiên Long (hộp 100)', s.id, 70000, 50000, now(), now()
FROM suppliers s
WHERE s.name = 'Công ty TNHH Thiết bị Văn phòng Phú Đạt'
  AND NOT EXISTS (SELECT 1 FROM products p WHERE p.name = 'Bút bi Thiên Long (hộp 100)');

INSERT INTO products (sku, name, supplier_id, price, cost, created_at, updated_at)
SELECT 'SKU-NT-A5', 'Sổ tay A5 (da cao cấp)', s.id, 40000, 25000, now(), now()
FROM suppliers s
WHERE s.name = 'Công ty TNHH Thiết bị Văn phòng Phú Đạt'
  AND NOT EXISTS (SELECT 1 FROM products p WHERE p.name = 'Sổ tay A5 (da cao cấp)');

INSERT INTO products (sku, name, supplier_id, price, cost, created_at, updated_at)
SELECT 'SKU-CLIP-10', 'Kẹp tài liệu (bộ 10 cái)', s.id, 20000, 15000, now(), now()
FROM suppliers s
WHERE s.name = 'Công ty TNHH Thiết bị Văn phòng Phú Đạt'
  AND NOT EXISTS (SELECT 1 FROM products p WHERE p.name = 'Kẹp tài liệu (bộ 10 cái)');

INSERT INTO products (sku, name, supplier_id, price, cost, created_at, updated_at)
SELECT 'SKU-LOGI-KB-WL', 'Bàn phím không dây Logitech', s.id, 450000, 350000, now(), now()
FROM suppliers s
WHERE s.name = 'Công ty TNHH Thiết bị Văn phòng Phú Đạt'
  AND NOT EXISTS (SELECT 1 FROM products p WHERE p.name = 'Bàn phím không dây Logitech');

-- Insert purchase orders
INSERT INTO purchase_orders (order_number, supplier_id, branch_id, status, ordered_date, total_amount, notes, created_at, updated_at)
VALUES
('PO-2024-001', (SELECT id FROM suppliers WHERE name='Công ty TNHH Điện tử Việt Nam'), (SELECT id FROM branches WHERE name='Chi nhánh Trung tâm'), 'RECEIVED', '2024-01-10', 2956000000.00, 'Nhập hàng điện thoại và laptop cho chi nhánh chính', now(), now()),
('PO-2024-002', (SELECT id FROM suppliers WHERE name='Công ty TNHH Phụ kiện Công nghệ Xanh'), (SELECT id FROM branches WHERE name='Chi nhánh Phụ'), 'RECEIVED', '2024-02-15', 246100000.00, 'Nhập phụ kiện công nghệ cho chi nhánh phụ', now(), now()),
('PO-2024-003', (SELECT id FROM suppliers WHERE name='Công ty CP Thiết bị Gia dụng ABC'), (SELECT id FROM branches WHERE name='Chi nhánh Trung tâm'), 'SUBMITTED', '2024-03-05', 514500000.00, 'Nhập thiết bị gia dụng cho chi nhánh trung tâm', now(), now()),
('PO-2024-004', (SELECT id FROM suppliers WHERE name='Công ty CP Đồ gia dụng Nhà bếp Việt'), (SELECT id FROM branches WHERE name='Chi nhánh Phụ'), 'DRAFT', '2024-04-01', 292750000.00, 'Nhập hàng gia dụng nhà bếp cho chi nhánh phụ', now(), now()),
('PO-2024-005', (SELECT id FROM suppliers WHERE name='Công ty TNHH Thiết bị Văn phòng Phú Đạt'), (SELECT id FROM branches WHERE name='Chi nhánh Trung tâm'), 'SUBMITTED', '2024-05-20', 192900000.00, 'Nhập thiết bị văn phòng cho chi nhánh trung tâm', now(), now());

-- Insert purchase order items for PO-2024-001
INSERT INTO purchase_order_items (purchase_order_id, product_id, quantity, cost, subtotal, created_at)
VALUES
((SELECT id FROM purchase_orders WHERE order_number='PO-2024-001'), (SELECT id FROM products WHERE name='iPhone 15 Pro Max 256GB'), 30, 25000000.00, 30*25000000.00, now()),
((SELECT id FROM purchase_orders WHERE order_number='PO-2024-001'), (SELECT id FROM products WHERE name='Samsung Galaxy S24 Ultra 512GB'), 25, 22000000.00, 25*22000000.00, now()),
((SELECT id FROM purchase_orders WHERE order_number='PO-2024-001'), (SELECT id FROM products WHERE name='Xiaomi 14 Pro 512GB'), 35, 13000000.00, 35*13000000.00, now()),
((SELECT id FROM purchase_orders WHERE order_number='PO-2024-001'), (SELECT id FROM products WHERE name='MacBook Pro 14 M3 Pro'), 15, 33000000.00, 15*33000000.00, now()),
((SELECT id FROM purchase_orders WHERE order_number='PO-2024-001'), (SELECT id FROM products WHERE name='Dell XPS 16 Ultra'), 9, 28000000.00, 9*28000000.00, now()),
((SELECT id FROM purchase_orders WHERE order_number='PO-2024-001'), (SELECT id FROM products WHERE name='iPad Pro 12.9 M2'), 20, 18500000.00, 20*18500000.00, now());

-- Insert items for PO-2024-002
INSERT INTO purchase_order_items (purchase_order_id, product_id, quantity, cost, subtotal, created_at)
VALUES
((SELECT id FROM purchase_orders WHERE order_number='PO-2024-002'), (SELECT id FROM products WHERE name='AirPods Pro 2 USB-C'), 40, 3800000.00, 40*3800000.00, now()),
((SELECT id FROM purchase_orders WHERE order_number='PO-2024-002'), (SELECT id FROM products WHERE name='Sạc nhanh 65W GaN'), 80, 550000.00, 80*550000.00, now()),
((SELECT id FROM purchase_orders WHERE order_number='PO-2024-002'), (SELECT id FROM products WHERE name='Loa Bluetooth JBL Flip 6'), 30, 850000.00, 30*850000.00, now()),
((SELECT id FROM purchase_orders WHERE order_number='PO-2024-002'), (SELECT id FROM products WHERE name='Ốp lưng iPhone 15 (cao cấp)'), 100, 150000.00, 100*150000.00, now()),
((SELECT id FROM purchase_orders WHERE order_number='PO-2024-002'), (SELECT id FROM products WHERE name='Cáp sạc USB-C (2m)'), 120, 80000.00, 120*80000.00, now());

-- Insert items for PO-2024-003
INSERT INTO purchase_order_items (purchase_order_id, product_id, quantity, cost, subtotal, created_at)
VALUES
((SELECT id FROM purchase_orders WHERE order_number='PO-2024-003'), (SELECT id FROM products WHERE name='Tủ lạnh Samsung Inverter 450L'), 12, 12500000.00, 12*12500000.00, now()),
((SELECT id FROM purchase_orders WHERE order_number='PO-2024-003'), (SELECT id FROM products WHERE name='Máy giặt LG Inverter 9kg'), 15, 10000000.00, 15*10000000.00, now()),
((SELECT id FROM purchase_orders WHERE order_number='PO-2024-003'), (SELECT id FROM products WHERE name='Điều hòa Daikin Inverter 1.5HP'), 18, 7500000.00, 18*7500000.00, now()),
((SELECT id FROM purchase_orders WHERE order_number='PO-2024-003'), (SELECT id FROM products WHERE name='Máy hút bụi Dyson V15'), 10, 5200000.00, 10*5200000.00, now()),
((SELECT id FROM purchase_orders WHERE order_number='PO-2024-003'), (SELECT id FROM products WHERE name='Quạt điện Senko (cao cấp)'), 50, 550000.00, 50*550000.00, now());

-- Insert items for PO-2024-004
INSERT INTO purchase_order_items (purchase_order_id, product_id, quantity, cost, subtotal, created_at)
VALUES
((SELECT id FROM purchase_orders WHERE order_number='PO-2024-004'), (SELECT id FROM products WHERE name='Nồi cơm điện Zojirushi 1.8L'), 25, 2800000.00, 25*2800000.00, now()),
((SELECT id FROM purchase_orders WHERE order_number='PO-2024-004'), (SELECT id FROM products WHERE name='Bếp từ Sunhouse 2 vùng nấu'), 20, 3200000.00, 20*3200000.00, now()),
((SELECT id FROM purchase_orders WHERE order_number='PO-2024-004'), (SELECT id FROM products WHERE name='Lò vi sóng Sharp 25L'), 30, 2000000.00, 30*2000000.00, now()),
((SELECT id FROM purchase_orders WHERE order_number='PO-2024-004'), (SELECT id FROM products WHERE name='Máy xay sinh tố Philips'), 35, 950000.00, 35*950000.00, now()),
((SELECT id FROM purchase_orders WHERE order_number='PO-2024-004'), (SELECT id FROM products WHERE name='Ấm đun nước siêu tốc'), 50, 350000.00, 50*350000.00, now()),
((SELECT id FROM purchase_orders WHERE order_number='PO-2024-004'), (SELECT id FROM products WHERE name='Bộ nồi chảo chống dính (5 món)'), 40, 1200000.00, 40*1200000.00, now());

-- Insert items for PO-2024-005
INSERT INTO purchase_order_items (purchase_order_id, product_id, quantity, cost, subtotal, created_at)
VALUES
((SELECT id FROM purchase_orders WHERE order_number='PO-2024-005'), (SELECT id FROM products WHERE name='Máy in HP LaserJet MFP203'), 20, 3800000.00, 20*3800000.00, now()),
((SELECT id FROM purchase_orders WHERE order_number='PO-2024-005'), (SELECT id FROM products WHERE name='Máy chiếu Epson EB-FH06'), 8, 10000000.00, 8*10000000.00, now()),
((SELECT id FROM purchase_orders WHERE order_number='PO-2024-005'), (SELECT id FROM products WHERE name='Máy scan Canon DR-C225'), 10, 2500000.00, 10*2500000.00, now()),
((SELECT id FROM purchase_orders WHERE order_number='PO-2024-005'), (SELECT id FROM products WHERE name='Bút bi Thiên Long (hộp 100)'), 50, 50000.00, 50*50000.00, now()),
((SELECT id FROM purchase_orders WHERE order_number='PO-2024-005'), (SELECT id FROM products WHERE name='Sổ tay A5 (da cao cấp)'), 80, 25000.00, 80*25000.00, now()),
((SELECT id FROM purchase_orders WHERE order_number='PO-2024-005'), (SELECT id FROM products WHERE name='Kẹp tài liệu (bộ 10 cái)'), 60, 15000.00, 60*15000.00, now()),
((SELECT id FROM purchase_orders WHERE order_number='PO-2024-005'), (SELECT id FROM products WHERE name='Bàn phím không dây Logitech'), 25, 350000.00, 25*350000.00, now());

COMMIT;
