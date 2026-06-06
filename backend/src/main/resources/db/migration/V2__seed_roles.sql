INSERT INTO roles (id, name, description) VALUES
                                              (gen_random_uuid(), 'ROLE_ADMIN',
                                               'Quản trị viên hệ thống – toàn quyền'),
                                              (gen_random_uuid(), 'ROLE_MANAGER',
                                               'Quản lý chi nhánh – xem báo cáo, quản lý sản phẩm'),
                                              (gen_random_uuid(), 'ROLE_CASHIER',
                                               'Thu ngân – tạo hóa đơn bán hàng, xem sản phẩm'),
                                              (gen_random_uuid(), 'ROLE_WAREHOUSE',
                                               'Thủ kho – quản lý nhập kho, xem tồn kho')
    ON CONFLICT (name) DO NOTHING;