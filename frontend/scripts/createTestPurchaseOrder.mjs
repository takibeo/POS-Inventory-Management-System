#!/usr/bin/env node
/* Create one test purchase order to diagnose failures. */
import process from 'process';
const BASE = process.env.VITE_API_BASE_URL || process.env.API_BASE_URL || 'http://localhost:8080/api';

async function login() {
  const res = await fetch(`${BASE}/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username: 'admin', password: 'admin123' }) });
  if (!res.ok) throw new Error(`login failed ${res.status}`);
  return res.json();
}

async function fetchJson(path, token) {
  const res = await fetch(`${BASE}${path}`, { headers: { Authorization: `Bearer ${token}` } });
  const text = await res.text();
  try { return JSON.parse(text); } catch { return text; }
}

async function postJson(path, token, body) {
  const res = await fetch(`${BASE}${path}`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(body) });
  const text = await res.text();
  return { status: res.status, body: text };
}

(async function(){
  try {
    console.log('Login...');
    const tok = await login();
    const token = tok?.data?.accessToken || tok.accessToken || tok.token || tok;
    console.log('Token length', String(token).length);

    const suppliersResp = await fetchJson('/suppliers', token);
    let suppliers = suppliersResp?.data?.content || suppliersResp?.data || suppliersResp?.content || suppliersResp;
    if (!Array.isArray(suppliers) && suppliers && typeof suppliers === 'object') suppliers = Object.values(suppliers);
    console.log('Suppliers count', Array.isArray(suppliers)?suppliers.length:0);

    const branchesResp = await fetchJson('/branches', token);
    let branches = branchesResp?.data?.content || branchesResp?.data || branchesResp?.content || branchesResp;
    if (!Array.isArray(branches) && branches && typeof branches === 'object') branches = Object.values(branches);
    console.log('Branches count', Array.isArray(branches)?branches.length:0);

    const productsResp = await fetchJson('/products', token);
    let products = productsResp?.data?.content || productsResp?.data || productsResp?.content || productsResp;
    if (!Array.isArray(products) && products && typeof products === 'object') products = Object.values(products);
    console.log('Products count', Array.isArray(products)?products.length:0);

    if (!Array.isArray(suppliers) || suppliers.length===0) throw new Error('No suppliers');
    if (!Array.isArray(branches) || branches.length===0) throw new Error('No branches');
    if (!Array.isArray(products) || products.length===0) throw new Error('No products');

    const payload = {
      supplierId: suppliers[0].id,
      branchId: branches[0].id,
      notes: 'Test order from script',
      items: [{ productId: products[0].id, quantity: 2, cost: products[0].cost ?? 100000 }]
    };

    console.log('Posting purchase order...', payload);
    const res = await postJson('/purchase-orders', token, payload);
    console.log('Status', res.status);
    console.log('Body', res.body);
  } catch (err) {
    console.error('Error', err.message || err);
    process.exit(1);
  }
})();
