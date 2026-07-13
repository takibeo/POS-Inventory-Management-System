#!/usr/bin/env node
import process from 'process';
const BASE = process.env.VITE_API_BASE_URL || process.env.API_BASE_URL || 'http://localhost:8080/api';

async function login() {
  const res = await fetch(`${BASE}/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username: 'admin', password: 'admin123' }) });
  if (!res.ok) throw new Error(`login failed ${res.status}`);
  return res.json();
}

(async function(){
  try {
    const tok = await login();
    const token = tok?.data?.accessToken || tok.accessToken || tok.token || tok;
    console.log('Token length', String(token).length);

    const res = await fetch(`${BASE}/reports/low-stock`, { headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();
    console.log('Status', res.status);
    console.log('Low-stock count:', Array.isArray(data)?data.length:Object.keys(data).length);
    console.log(JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error', err.message || err);
    process.exit(1);
  }
})();
