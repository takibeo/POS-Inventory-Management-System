-- Update default users password to the correct bcrypt hash for 'admin123'
UPDATE users
SET password = '$2a$10$QR1CxQCaKWsQjYtFOGqYrej7RSpcbcQ..C/ICdbz1OSHjVgoCk7s2'
WHERE username IN ('admin', 'manager', 'cashier');
