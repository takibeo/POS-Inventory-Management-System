INSERT INTO branches (id, name, code, address, phone)
VALUES (
           '00000000-0000-0000-0000-000000000001',
           'Chi nhánh trung tâm', 'HQ',
           '123 Nguyễn Huệ, Quận 1, TP.HCM',
           '028-1234-5678'
       ) ON CONFLICT DO NOTHING;

INSERT INTO users (id, username, email, password, full_name, status)
VALUES (
           '00000000-0000-0000-0000-000000000010',
           'admin', 'admin@pos.local',
           '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE36jV0qLkxRPa3oO',
           'System Administrator', 'ACTIVE'
       ) ON CONFLICT (username) DO NOTHING;

INSERT INTO user_roles (user_id, role_id)
SELECT '00000000-0000-0000-0000-000000000010', r.id
FROM roles r WHERE r.name = 'ROLE_ADMIN'
    ON CONFLICT DO NOTHING;

INSERT INTO users (id, username, email, password, full_name, status)
VALUES (
           '00000000-0000-0000-0000-000000000011',
           'manager', 'manager@pos.local',
           '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE36jV0qLkxRPa3oO',
           'Branch Manager', 'ACTIVE'
       ) ON CONFLICT (username) DO NOTHING;

INSERT INTO user_roles (user_id, role_id)
SELECT '00000000-0000-0000-0000-000000000011', r.id
FROM roles r WHERE r.name = 'ROLE_MANAGER'
    ON CONFLICT DO NOTHING;

INSERT INTO users (id, username, email, password, full_name, status)
VALUES (
           '00000000-0000-0000-0000-000000000012',
           'cashier', 'cashier@pos.local',
           '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE36jV0qLkxRPa3oO',
           'Demo Cashier', 'ACTIVE'
       ) ON CONFLICT (username) DO NOTHING;

INSERT INTO user_roles (user_id, role_id)
SELECT '00000000-0000-0000-0000-000000000012', r.id
FROM roles r WHERE r.name = 'ROLE_CASHIER'
    ON CONFLICT DO NOTHING;