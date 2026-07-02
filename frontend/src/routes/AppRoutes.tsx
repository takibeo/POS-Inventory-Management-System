import { lazy, Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { LoadingSpinner } from '../components/ui';
import AuthLayout from '../layouts/AuthLayout';
import AdminLayout from '../layouts/AdminLayout';
import ProtectedRoute from '../components/ProtectedRoute';
import { BranchProvider } from '../contexts/BranchContext';

const LoginPage = lazy(() => import('../pages/LoginPage'));
const DashboardPage = lazy(() => import('../pages/DashboardPage'));
const ProductsPage = lazy(() => import('../pages/ProductsPage'));
const CategoriesPage = lazy(() => import('../pages/CategoriesPage'));
const SuppliersPage = lazy(() => import('../pages/SuppliersPage'));
const InventoryPage = lazy(() => import('../pages/InventoryPage'));
const PurchaseOrdersPage = lazy(() => import('../pages/PurchaseOrdersPage'));
const BranchesPage = lazy(() => import('../pages/BranchesPage'));
const ReportsPage = lazy(() => import('../pages/ReportsPage'));
const PosPage = lazy(() => import('../pages/PosPage'));
const StockMovementLog = lazy(() => import('../pages/StockMovementLog'));

function RouteFallback() {
  return <LoadingSpinner fullPage label="Đang tải trang..." />;
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route
              element={
                <BranchProvider>
                  <AdminLayout />
                </BranchProvider>
              }
            >
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/pos" element={<PosPage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/categories" element={<CategoriesPage />} />
              <Route path="/suppliers" element={<SuppliersPage />} />
              <Route path="/inventory" element={<InventoryPage />} />
              <Route path="/purchase-orders" element={<PurchaseOrdersPage />} />
              <Route path="/branches" element={<BranchesPage />} />
              <Route path="/reports" element={<ReportsPage />} />
              <Route path="/stock-movement" element={<StockMovementLog />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
