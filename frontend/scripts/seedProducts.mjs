#!/usr/bin/env node
/*
  Seed products via backend API using admin account.
  Usage: node frontend/scripts/seedProducts.mjs
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

async function getSuppliers(token) {
  const res = await fetch(`${BASE}/suppliers`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`Get suppliers failed: ${res.status} ${await res.text()}`);
  return res.json();
}

async function createProduct(token, product) {
  const res = await fetch(`${BASE}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(product),
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Create product failed: ${res.status} ${txt}`);
  }
  return res.json();
}

const products = [
  {
    sku: 'SP001',
    name: 'iPhone 15 Pro Max 256GB',
    description: 'Màn hình 6.7 inch, chip A17 Pro, camera 48MP, màu Titan Tự Nhiên',
    categoryId: undefined,
    supplierName: 'Công ty TNHH Điện tử Việt Nam',
    price: 29990000,
    cost: 25000000,
    unit: 'cái',
    reorderLevel: 5,
    isActive: true,
  },
  {
    sku: 'SP002',
    name: 'Samsung Galaxy S24 Ultra 512GB',
    description: 'Màn hình 6.8 inch, chip Snapdragon 8 Gen 3, camera 200MP, màu Titan Vàng',
    categoryId: undefined,
    supplierName: 'Công ty TNHH Điện tử Việt Nam',
    price: 26990000,
    cost: 22000000,
    unit: 'cái',
    reorderLevel: 5,
    isActive: true,
  },
  {
    sku: 'SP003',
    name: 'Xiaomi 14 Pro 512GB',
    description: 'Màn hình 6.73 inch, chip Snapdragon 8 Gen 3, camera Leica 50MP',
    categoryId: undefined,
    supplierName: 'Công ty TNHH Điện tử Việt Nam',
    price: 15990000,
    cost: 13000000,
    unit: 'cái',
    reorderLevel: 3,
    isActive: true,
  },
  {
    sku: 'SP004',
    name: 'OPPO Find X7 Ultra 512GB',
    description: 'Màn hình 6.82 inch, chip Snapdragon 8 Gen 3, camera 50MP, sạc nhanh 100W',
    categoryId: undefined,
    supplierName: 'Công ty TNHH Điện tử Việt Nam',
    price: 19990000,
    cost: 16000000,
    unit: 'cái',
    reorderLevel: 3,
    isActive: true,
  },
  {
    sku: 'SP005',
    name: 'MacBook Pro 14 inch M3 Pro 18GB',
    description: 'Chip M3 Pro, RAM 18GB, SSD 512GB, màn hình Liquid Retina XDR',
    categoryId: undefined,
    supplierName: 'Công ty TNHH Điện tử Việt Nam',
    price: 39990000,
    cost: 33000000,
    unit: 'cái',
    reorderLevel: 3,
    isActive: true,
  },
  {
    sku: 'SP006',
    name: 'Dell XPS 16 Intel Ultra 9',
    description: 'Intel Core Ultra 9, RAM 32GB, SSD 1TB, màn hình 4K OLED',
    categoryId: undefined,
    supplierName: 'Công ty TNHH Điện tử Việt Nam',
    price: 34990000,
    cost: 28000000,
    unit: 'cái',
    reorderLevel: 3,
    isActive: true,
  },
  {
    sku: 'SP007',
    name: 'iPad Pro 12.9 inch M2 256GB',
    description: 'Chip M2, RAM 8GB, màn hình Liquid Retina XDR, hỗ trợ Apple Pencil',
    categoryId: undefined,
    supplierName: 'Công ty TNHH Điện tử Việt Nam',
    price: 22990000,
    cost: 18500000,
    unit: 'cái',
    reorderLevel: 3,
    isActive: true,
  },
  {
    sku: 'SP008',
    name: 'AirPods Pro 2 USB-C',
    description: 'Tai nghe true wireless, chống ồn chủ động, chip H2, sạc USB-C',
    categoryId: undefined,
    supplierName: 'Công ty TNHH Phụ kiện Công nghệ Xanh',
    price: 4990000,
    cost: 3800000,
    unit: 'cái',
    reorderLevel: 10,
    isActive: true,
  },
  {
    sku: 'SP009',
    name: 'Sạc nhanh 65W GaN 3 cổng',
    description: 'Sạc nhanh GaN, 3 cổng (2 USB-C, 1 USB-A), hỗ trợ PD/PPS/QC',
    categoryId: undefined,
    supplierName: 'Công ty TNHH Phụ kiện Công nghệ Xanh',
    price: 890000,
    cost: 550000,
    unit: 'cái',
    reorderLevel: 20,
    isActive: true,
  },
  {
    sku: 'SP010',
    name: 'Loa Bluetooth JBL Flip 6',
    description: 'Loa di động chống nước IP67, pin 12h, âm thanh stereo',
    categoryId: undefined,
    supplierName: 'Công ty TNHH Phụ kiện Công nghệ Xanh',
    price: 1290000,
    cost: 850000,
    unit: 'cái',
    reorderLevel: 10,
    isActive: true,
  },
  {
    sku: 'SP011',
    name: 'Tủ lạnh Samsung Inverter 450L',
    description: 'Dung tích 450L, công nghệ Inverter, làm lạnh đa chiều, kháng khuẩn',
    categoryId: undefined,
    supplierName: 'Công ty Cổ phần Thiết bị Gia dụng ABC',
    price: 15990000,
    cost: 12500000,
    unit: 'cái',
    reorderLevel: 2,
    isActive: true,
  },
  {
    sku: 'SP012',
    name: 'Máy giặt LG Inverter 9kg',
    description: 'Công nghệ Inverter, giặt hơi nước Steam, tiết kiệm điện, kháng khuẩn',
    categoryId: undefined,
    supplierName: 'Công ty Cổ phần Thiết bị Gia dụng ABC',
    price: 12990000,
    cost: 10000000,
    unit: 'cái',
    reorderLevel: 2,
    isActive: true,
  },
  {
    sku: 'SP013',
    name: 'Điều hòa Daikin Inverter 1.5HP',
    description: 'Công suất 1.5HP, công nghệ Inverter, lọc không khí, tiết kiệm điện',
    categoryId: undefined,
    supplierName: 'Công ty Cổ phần Thiết bị Gia dụng ABC',
    price: 9990000,
    cost: 7500000,
    unit: 'cái',
    reorderLevel: 3,
    isActive: true,
  },
  {
    sku: 'SP014',
    name: 'Nồi cơm điện Zojirushi 1.8L',
    description: 'Dung tích 1.8L, công nghệ nấu thông minh, giữ ấm 24h',
    categoryId: undefined,
    supplierName: 'Công ty Cổ phần Đồ gia dụng Nhà bếp Việt',
    price: 3990000,
    cost: 2800000,
    unit: 'cái',
    reorderLevel: 5,
    isActive: true,
  },
  {
    sku: 'SP015',
    name: 'Bếp từ Sunhouse 2 vùng nấu',
    description: '2 vùng nấu, mặt kính cường lực, 9 mức công suất, hẹn giờ',
    categoryId: undefined,
    supplierName: 'Công ty Cổ phần Đồ gia dụng Nhà bếp Việt',
    price: 4490000,
    cost: 3200000,
    unit: 'cái',
    reorderLevel: 5,
    isActive: true,
  },
];

async function run() {
  try {
    console.log('Logging in...');
    const tokenResp = await login('admin', 'admin123');
    const accessToken = tokenResp?.data?.accessToken || tokenResp.accessToken || tokenResp.token || tokenResp.jwt || tokenResp;
    if (!accessToken) throw new Error('No access token');

    const supplierResp = await getSuppliers(accessToken);
    // normalize possible shapes: { success,data:[...]} or { content:[...] } or raw array
    let supplierList = supplierResp?.data?.content || supplierResp?.data || supplierResp?.content || supplierResp;
    if (!Array.isArray(supplierList)) {
      // sometimes API wraps single object
      if (supplierList && typeof supplierList === 'object') {
        // try to extract values
        supplierList = Object.values(supplierList);
      } else {
        supplierList = [];
      }
    }
    const supplierMap = new Map();
    supplierList.forEach((s) => supplierMap.set(s.name, s.id));

    for (const p of products) {
      const payload = {
        sku: p.sku,
        name: p.name,
        description: p.description,
        categoryId: p.categoryId,
        supplierId: supplierMap.get(p.supplierName) ?? undefined,
        price: p.price,
        cost: p.cost,
        unit: p.unit,
        reorderLevel: p.reorderLevel,
        isActive: p.isActive,
      };
      try {
        const created = await createProduct(accessToken, payload);
        console.log('Created product:', created?.data?.name ?? created?.name ?? JSON.stringify(created));
      } catch (err) {
        console.error('Failed to create product', p.sku, err.message ?? err);
      }
    }
    console.log('Done.');
  } catch (err) {
    console.error('Seed failed:', err.message ?? err);
    process.exit(1);
  }
}

run();
