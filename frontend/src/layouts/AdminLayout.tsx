import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="bg-white border-b border-slate-200 p-4 shadow-sm">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <h1 className="text-xl font-semibold">POS Inventory</h1>
          <div>Admin</div>
        </div>
      </header>
      <div className="mx-auto flex max-w-7xl">
        <Sidebar />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
