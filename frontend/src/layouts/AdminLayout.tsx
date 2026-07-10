import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import BranchSelector from '../components/BranchSelector';
import { Menu, X, Bell, User, ChevronDown } from 'lucide-react';

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 shadow-sm">
        <div className="flex items-center justify-between px-4 py-3 lg:px-6">
          <div className="flex items-center gap-4">
            <button
              type="button"
              className="rounded-xl p-2 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-all duration-200 lg:hidden"
              onClick={() => setSidebarOpen(true)}
              aria-label="Mở menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center justify-center w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg shadow-indigo-200">
                <span className="text-white font-bold text-sm">P</span>
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                POS Inventory
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <BranchSelector />
            
            {/* Notification button */}
            <button className="relative rounded-xl p-2 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 transition-all duration-200">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full ring-2 ring-white" />
            </button>
            
            {/* User profile */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <div className="flex items-center gap-2 cursor-pointer hover:bg-indigo-50 rounded-xl px-2 py-1.5 transition-all duration-200 group">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-xs font-bold text-white shadow-lg shadow-indigo-200">
                  A
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-slate-700">Admin</p>
                  <p className="text-xs text-slate-400">Quản trị viên</p>
                </div>
                <ChevronDown className="hidden md:block h-4 w-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Overlay */}
        {sidebarOpen && (
          <button
            type="button"
            className="fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-sm lg:hidden animate-fade-in"
            aria-label="Đóng menu"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-72 bg-white/80 backdrop-blur-xl border-r border-slate-200/60 shadow-xl transform transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 lg:z-auto lg:shadow-none lg:bg-transparent lg:backdrop-blur-none lg:border-none ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
        >
          <div className="flex items-center justify-between border-b border-slate-200/60 px-5 py-4 lg:hidden">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg">
                <span className="text-white font-bold text-sm">P</span>
              </div>
              <span className="font-bold text-slate-900">POS Inventory</span>
            </div>
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="rounded-xl p-2 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 transition-all duration-200"
              aria-label="Đóng menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="p-4 lg:p-0 lg:pt-4">
            <Sidebar onNavigate={() => setSidebarOpen(false)} />
          </div>
        </aside>

        {/* Main content */}
        <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Thêm animation */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.2s ease-in-out;
        }
      `}</style>
    </div>
  );
}