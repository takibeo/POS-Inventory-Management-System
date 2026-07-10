#!/usr/bin/env node
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

(async function(){
  try {
    const tok = await login();
    const token = tok?.data?.accessToken || tok.accessToken || tok.token || tok;
    console.log('Token length', String(token).length);

    const resp = await fetchJson('/purchase-orders?page=0&size=50', token);
    let list = resp?.data?.content || resp?.data || resp?.content || resp;
    if (!Array.isArray(list) && list && typeof list === 'object') list = Object.values(list);
    console.log('Purchase orders count:', Array.isArray(list)?list.length:0);
    if (Array.isArray(list)) {
      list.slice(0,50).forEach(po => console.log(po.orderNumber || po.order_number || po.order_number, '-', po.status || po.state || ''));
    } else {
      console.log('Response:', resp);
    }
  } catch (err) {
    console.error('Error', err.message || err);
    process.exit(1);
  }
})();
