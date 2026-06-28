import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';

type SidebarProps = {
  onNavigate?: () => void;
};

const links = [
  { path: '/dashboard', label: 'Dashboard' },
  { path: '/pos', label: 'POS' },
  { path: '/products', label: 'Sản phẩm' },
  { path: '/categories', label: 'Danh mục' },
  { path: '/suppliers', label: 'Nhà cung cấp' },
  { path: '/inventory', label: 'Tồn kho' },
  { path: '/purchase-orders', label: 'Đơn nhập kho' },
  { path: '/branches', label: 'Chi nhánh' },
  { path: '/reports', label: 'Báo cáo' },
  { path: '/stock-movement', label: 'Lịch sử tồn kho' },
];

const STORAGE_KEY = 'sidebar-collapsed';

export default function Sidebar({ onNavigate }: SidebarProps) {
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, String(collapsed));
    } catch {
      // ignore
    }
  }, [collapsed]);

  return (
    <nav className="h-full overflow-y-auto space-y-1 p-4">
      {links.map((link) => (
        <NavLink
          key={link.path}
          to={link.path}
          onClick={onNavigate}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
              isActive ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`
          }
        >
          {link.label}
        </NavLink>
      ))}
    </nav>
  );
}
