import { NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const links = [
  { path: '/dashboard', label: 'Dashboard' },
  { path: '/pos', label: 'POS' },
  { path: '/products', label: 'Products' },
  { path: '/categories', label: 'Categories' },
  { path: '/suppliers', label: 'Suppliers' },
  { path: '/inventory', label: 'Inventory' },
  { path: '/purchase-orders', label: 'Purchase Orders' },
  { path: '/branches', label: 'Branches' },
  { path: '/reports', label: 'Reports' },
];

export default function Sidebar() {
  const { hasRole } = useAuth();

  const visibleLinks = links.filter((link) => {
    if (link.path === '/branches' || link.path === '/reports') {
      return hasRole('ADMIN') || hasRole('MANAGER');
    }
    if (link.path === '/inventory' || link.path === '/purchase-orders') {
      return hasRole('ADMIN') || hasRole('MANAGER') || hasRole('WAREHOUSE');
    }
    return true;
  });

  return (
    <aside className="w-64 shrink-0 border-r border-slate-200 bg-white p-4">
      <nav className="space-y-2">
        {visibleLinks.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) =>
              `block rounded-xl px-3 py-2 text-sm font-medium ${isActive ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100'}`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
