#!/usr/bin/env node
/*
  Seed 5 suppliers via backend API.
  Usage: node frontend/scripts/seedSuppliers.mjs
  Requires backend running at http://localhost:8080
*/
import process from 'process';

const BASE = process.env.VITE_API_BASE_URL || process.env.API_BASE_URL || 'http://localhost:8080/api';

async function login(username, password) {
  const res = await fetch(`${BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) throw new Error(`Login failed: ${res.status} ${await res.text()}`);
  return res.json();
}

async function createSupplier(token, supplier) {
  const res = await fetch(`${BASE}/suppliers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(supplier),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Create supplier failed: ${res.status} ${text}`);
  }
  return res.json();
}

const suppliers = [
  {
    name: 'Công ty TNHH Điện tử Việt Nam',
    contactName: 'Nguyễn Văn An',
    phone: '0901234567',
    email: 'contact@vietnamtech.vn',
    address: '123 Nguyễn Trãi, Quận 1, TP.HCM',
    notes: 'Chuyên cung cấp điện thoại, laptop và linh kiện điện tử',
  },
  {
    name: 'Công ty Cổ phần Thiết bị Gia dụng ABC',
    contactName: 'Trần Thị Bình',
    phone: '0987654321',
    email: 'sales@abcappliance.com',
    address: '456 Lê Lợi, Quận 3, TP.HCM',
    notes: 'Nhà phân phối tủ lạnh, máy giặt, điều hòa chính hãng',
  },
  {
    name: 'Công ty TNHH Phụ kiện Công nghệ Xanh',
    contactName: 'Lê Văn Cường',
    phone: '0912345678',
    email: 'info@greenaccessory.com',
    address: '789 Nguyễn Huệ, Quận 4, TP.HCM',
    notes: 'Cung cấp phụ kiện công nghệ: sạc, tai nghe, ốp lưng, cáp',
  },
  {
    name: 'Công ty Cổ phần Đồ gia dụng Nhà bếp Việt',
    contactName: 'Phạm Thị Dung',
    phone: '0978456123',
    email: 'order@vietkitchen.com',
    address: '321 Lý Tự Trọng, Quận 5, TP.HCM',
    notes: 'Chuyên nồi cơm điện, bếp từ, máy xay, lò vi sóng',
  },
  {
    name: 'Công ty TNHH Thiết bị Văn phòng Phú Đạt',
    contactName: 'Hoàng Văn Em',
    phone: '0934567890',
    email: 'sales@phudat-office.com',
    address: '654 Cách Mạng Tháng 8, Quận 10, TP.HCM',
    notes: 'Cung cấp máy in, máy chiếu, văn phòng phẩm',
  },
];

async function run() {
  try {
    console.log('Logging in with admin/admin123...');
    const tokenResp = await login('admin', 'admin123');
    const accessToken = tokenResp?.data?.accessToken || tokenResp.accessToken || tokenResp.token || tokenResp.jwt || tokenResp;
    if (!accessToken) throw new Error('No access token received');

    for (const s of suppliers) {
      try {
        const created = await createSupplier(accessToken, s);
        console.log('Created:', created.name ?? created.id ?? JSON.stringify(created));
      } catch (err) {
        console.error('Failed to create', s.name, err.message ?? err);
      }
    }
    console.log('Seeding complete.');
  } catch (err) {
    console.error('Seeding failed:', err.message ?? err);
    process.exit(1);
  }
}

run();
