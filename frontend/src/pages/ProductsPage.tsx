import { useQuery } from '@tanstack/react-query';
import productService from '../services/productService';
import type { Product } from '../types/product';

export default function ProductsPage() {
  const { data, isLoading, error } = useQuery<Product[], Error>(['products'], productService.getProducts);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Quản lý sản phẩm</h2>
          <p className="text-sm text-slate-500">Danh sách sản phẩm hiện có trong hệ thống.</p>
        </div>
      </div>

      {isLoading && <p>Đang tải sản phẩm...</p>}
      {error && <p className="text-sm text-red-600">Không thể tải danh sách sản phẩm.</p>}

      {data && data.length > 0 ? (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-3">SKU</th>
                <th className="px-4 py-3">Tên</th>
                <th className="px-4 py-3">Giá</th>
                <th className="px-4 py-3">Đơn vị</th>
                <th className="px-4 py-3">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {data.map((product) => (
                <tr key={product.id}>
                  <td className="px-4 py-3">{product.sku}</td>
                  <td className="px-4 py-3">{product.name}</td>
                  <td className="px-4 py-3">{product.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</td>
                  <td className="px-4 py-3">{product.unit ?? 'N/A'}</td>
                  <td className="px-4 py-3">{product.isActive ? 'Hoạt động' : 'Không hoạt động'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        !isLoading && <p>Chưa có sản phẩm nào trong hệ thống.</p>
      )}
    </div>
  );
}
