import { Outlet } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8">
        <Outlet />
      </div>
    </div>
  );
}
