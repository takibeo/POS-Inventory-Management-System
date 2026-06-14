import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

export default function AdminLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900">
            <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-sm">
                <div className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            className="rounded-lg p-1.5 text-slate-600 hover:bg-slate-100 lg:hidden"
                            onClick={() => setSidebarOpen(true)}
                            aria-label="Mở menu"
                        >
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24"
                                 stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                      strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                        <span className="text-base font-bold tracking-tight text-slate-900">
              POS Inventory
            </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="hidden text-sm text-slate-500 sm:block">Admin</span>
                        <div className="flex h-8 w-8 items-center justify-center rounded-full
              bg-slate-900 text-xs font-bold text-white">
                            A
                        </div>
                    </div>
                </div>
            </header>

            <div className="flex">
                {sidebarOpen && (
                    <button
                        type="button"
                        className="fixed inset-0 z-40 bg-slate-900/40 lg:hidden"
                        aria-label="Đóng menu"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}

                <aside className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200
          transform transition-transform duration-200 ease-in-out
          lg:static lg:translate-x-0 lg:z-auto
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
                    <div className="flex items-center justify-between border-b
            border-slate-200 px-4 py-3 lg:hidden">
                        <span className="font-bold text-slate-900">Menu</span>
                        <button
                            type="button"
                            onClick={() => setSidebarOpen(false)}
                            className="rounded-lg p-1 text-slate-500 hover:bg-slate-100"
                            aria-label="Đóng menu"
                        >
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24"
                                 stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                      strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <Sidebar onNavigate={() => setSidebarOpen(false)} />
                </aside>

                <main className="min-w-0 flex-1 p-4 sm:p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}