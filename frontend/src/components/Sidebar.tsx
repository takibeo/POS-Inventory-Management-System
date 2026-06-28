import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';

type SidebarProps = {
  onNavigate?: () => void;
};

const links = [
  {
    path: '/dashboard', label: 'Dashboard',
    icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    ),
  },
  {
    path: '/pos', label: 'POS',
    icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
    ),
  },
  {
    path: '/products', label: 'Sản phẩm',
    icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
    ),
  },
  {
    path: '/categories', label: 'Danh mục',
    icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
    ),
  },
  {
    path: '/suppliers', label: 'Nhà cung cấp',
    icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    ),
  },
  {
    path: '/inventory', label: 'Tồn kho',
    icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
    ),
  },
  {
    path: '/purchase-orders', label: 'Đơn nhập kho',
    icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
    ),
  },
  {
    path: '/branches', label: 'Chi nhánh',
    icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    ),
  },
  {
    path: '/reports', label: 'Báo cáo',
    icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    ),
  },
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
      <nav className="flex h-full flex-col overflow-y-auto">
        {/* Nút collapse — chỉ hiện trên desktop */}
        <div className="hidden lg:flex justify-end px-3 pt-3">
          <button
              type="button"
              onClick={() => setCollapsed((c) => !c)}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100
            hover:text-slate-600 transition"
              aria-label={collapsed ? 'Mở rộng menu' : 'Thu gọn menu'}
              title={collapsed ? 'Mở rộng' : 'Thu gọn'}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24"
                 stroke="currentColor">
              {collapsed ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              )}
            </svg>
          </button>
        </div>

        <div className="flex-1 space-y-1 p-3">
          {links.map((link) => (
              <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={onNavigate}
                  title={collapsed ? link.label : undefined}
                  className={({ isActive }) =>
                      `flex items-center rounded-xl px-3 py-2.5 text-sm font-medium
              transition-colors ${collapsed ? 'justify-center' : 'gap-3'}
              ${isActive
                          ? 'bg-slate-900 text-white'
                          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                      }`
                  }
              >
                <svg className="h-4 w-4 shrink-0" fill="none"
                     viewBox="0 0 24 24" stroke="currentColor">
                  {link.icon}
                </svg>
                {!collapsed && link.label}
              </NavLink>
          ))}
        </div>
      </nav>
  );
}
