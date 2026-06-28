import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Button, PageHeader } from '../components/ui';
import authService from '../services/authService';
import branchService from '../services/branchService';
import productService from '../services/productService';
import saleService from '../services/saleService';
import type { Branch } from '../types/branch';
import type { Product } from '../types/product';
import type { SaleInvoice, SaleItem } from '../types/sale';
import type { User } from '../types/auth';

type CartItem = SaleItem & {
  productName: string;
};

type PosFormValues = {
  branchId: string;
  paymentMethod: string;
  customerName: string;
  amountPaid: number;
  tax: number;
  discount: number;
};

const defaultValues: PosFormValues = {
  branchId: '',
  paymentMethod: 'CASH',
  customerName: '',
  amountPaid: 0,
  tax: 0,
  discount: 0,
};

function formatMoney(value: number) {
  return new Intl.NumberFormat('vi-VN').format(value);
}

export default function PosPage() {
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const { data: branches = [] } = useQuery<Branch[], Error>({
    queryKey: ['branches'],
    queryFn: branchService.getBranches,
  });

  const { data: products = [] } = useQuery<Product[], Error>({
    queryKey: ['products'],
    queryFn: productService.getProducts,
  });

  useEffect(() => {
    authService.getCurrentUser().then(setCurrentUser).catch(() => setCurrentUser(null));
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<PosFormValues>({ defaultValues });

  useEffect(() => {
    if (branches.length > 0 && !watch('branchId')) {
      setValue('branchId', branches[0].id);
    }
  }, [branches, setValue, watch]);

  const selectedBranchId = watch('branchId');
  const amountPaid = watch('amountPaid') || 0;
  const tax = watch('tax') || 0;
  const discount = watch('discount') || 0;

  const filteredProducts = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return products.slice(0, 12);
    return products.filter((product) => {
      return (
        product.name.toLowerCase().includes(keyword) ||
        product.sku.toLowerCase().includes(keyword)
      );
    });
  }, [products, search]);

  const subtotal = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity - (item.discount ?? 0), 0);
  const totalAmount = Math.max(subtotal + tax - discount, 0);
  const changeAmount = Math.max(amountPaid - totalAmount, 0);

  const createSaleMutation = useMutation({
    mutationFn: (payload: SaleInvoice) => saleService.createSale(payload),
    onSuccess: () => {
      toast.success('Tạo hóa đơn thành công.');
      setCart([]);
      reset(defaultValues);
      if (branches.length > 0) setValue('branchId', branches[0].id);
    },
    onError: () => toast.error('Không thể tạo hóa đơn.'),
  });

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.productId === product.id);
      if (existing) {
        return prev.map((item) =>
          item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          productName: product.name,
          quantity: 1,
          unitPrice: product.price,
          discount: 0,
        },
      ];
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    setCart((prev) =>
      prev
        .map((item) => (item.productId === productId ? { ...item, quantity } : item))
        .filter((item) => item.quantity > 0)
    );
  };

  const updateDiscount = (productId: string, discountValue: number) => {
    setCart((prev) =>
      prev.map((item) => (item.productId === productId ? { ...item, discount: discountValue } : item))
    );
  };

  const removeItem = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.productId !== productId));
  };

  const onSubmit = (values: PosFormValues) => {
    if (!currentUser?.id) {
      toast.error('Không xác định được thu ngân hiện tại.');
      return;
    }

    if (cart.length === 0) {
      toast.error('Vui lòng thêm ít nhất một sản phẩm.');
      return;
    }

    createSaleMutation.mutate({
      id: '',
      invoiceNumber: '',
      branchId: values.branchId,
      cashierId: currentUser.id,
      customerName: values.customerName || undefined,
      totalAmount: totalAmount,
      paymentMethod: values.paymentMethod,
      amountPaid: values.amountPaid,
      changeAmount: changeAmount,
      items: cart.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        discount: item.discount ?? 0,
      })),
      status: 'PAID',
    } as SaleInvoice);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="POS bán hàng"
        description="Tìm sản phẩm, thêm vào giỏ và tạo hóa đơn từ backend thực tế."
      />

      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <div className="space-y-6">
          <div className="ui-card space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="ui-label">Chi nhánh</label>
                <select {...register('branchId', { required: 'Vui lòng chọn chi nhánh' })} className="ui-input">
                  <option value="">Chọn chi nhánh</option>
                  {branches.map((branch) => (
                    <option key={branch.id} value={branch.id}>
                      {branch.name} ({branch.code})
                    </option>
                  ))}
                </select>
                {errors.branchId && <p className="mt-1 text-sm text-red-600">{errors.branchId.message}</p>}
              </div>
              <div>
                <label className="ui-label">Thu ngân</label>
                <input value={currentUser?.fullName ?? currentUser?.username ?? 'Đang tải...'} readOnly className="ui-input" />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <label className="ui-label">Phương thức thanh toán</label>
                <select {...register('paymentMethod', { required: 'Vui lòng chọn phương thức thanh toán' })} className="ui-input">
                  <option value="CASH">Tiền mặt</option>
                  <option value="CARD">Thẻ</option>
                  <option value="TRANSFER">Chuyển khoản</option>
                </select>
              </div>
              <div>
                <label className="ui-label">Khách hàng</label>
                <input {...register('customerName')} className="ui-input" placeholder="Tên khách hàng" />
              </div>
              <div>
                <label className="ui-label">Tiền khách đưa</label>
                <input type="number" step="0.01" {...register('amountPaid', { valueAsNumber: true })} className="ui-input" />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="ui-label">Thuế</label>
                <input type="number" step="0.01" {...register('tax', { valueAsNumber: true })} className="ui-input" />
              </div>
              <div>
                <label className="ui-label">Giảm giá hóa đơn</label>
                <input type="number" step="0.01" {...register('discount', { valueAsNumber: true })} className="ui-input" />
              </div>
            </div>
          </div>

          <div className="ui-card space-y-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <h3 className="text-lg font-semibold">Tìm sản phẩm</h3>
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="ui-input md:max-w-sm"
                placeholder="Nhập tên hoặc SKU"
              />
            </div>

            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {filteredProducts.map((product) => (
                <button
                  type="button"
                  key={product.id}
                  onClick={() => addToCart(product)}
                  className="rounded-xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:border-slate-900"
                >
                  <p className="font-semibold">{product.name}</p>
                  <p className="text-sm text-slate-500">SKU: {product.sku}</p>
                  <p className="mt-2 text-sm font-medium text-slate-900">
                    {formatMoney(product.price)} đ
                  </p>
                </button>
              ))}
              {filteredProducts.length === 0 && (
                <p className="text-sm text-slate-500">Không tìm thấy sản phẩm phù hợp.</p>
              )}
            </div>
          </div>
        </div>

        <div className="ui-card space-y-4 self-start">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Giỏ hàng</h3>
            <span className="text-sm text-slate-500">{cart.length} mặt hàng</span>
          </div>

          {cart.length === 0 ? (
            <p className="text-sm text-slate-500">Giỏ hàng đang trống.</p>
          ) : (
            <div className="space-y-3">
              {cart.map((item) => (
                <div key={item.productId} className="rounded-xl border border-slate-200 p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium">{item.productName}</p>
                      <p className="text-sm text-slate-500">{formatMoney(item.unitPrice)} đ</p>
                    </div>
                    <button type="button" className="text-sm text-red-600" onClick={() => removeItem(item.productId)}>
                      Xóa
                    </button>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-3">
                    <div>
                      <label className="ui-label">Số lượng</label>
                      <input type="number" min={1} value={item.quantity} onChange={(e) => updateQuantity(item.productId, Number(e.target.value))} className="ui-input" />
                    </div>
                    <div>
                      <label className="ui-label">Giảm giá</label>
                      <input type="number" min={0} step="0.01" value={item.discount ?? 0} onChange={(e) => updateDiscount(item.productId, Number(e.target.value))} className="ui-input" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="border-t border-slate-200 pt-4 space-y-2 text-sm">
            <div className="flex justify-between"><span>Tạm tính</span><span>{formatMoney(subtotal)} đ</span></div>
            <div className="flex justify-between"><span>Thuế</span><span>{formatMoney(tax)} đ</span></div>
            <div className="flex justify-between"><span>Giảm giá</span><span>{formatMoney(discount)} đ</span></div>
            <div className="flex justify-between text-base font-semibold"><span>Tổng cộng</span><span>{formatMoney(totalAmount)} đ</span></div>
            <div className="flex justify-between"><span>Tiền thừa</span><span>{formatMoney(changeAmount)} đ</span></div>
          </div>

          <Button
            type="button"
            className="w-full"
            disabled={isSubmitting || createSaleMutation.isPending}
            onClick={handleSubmit(onSubmit)}
          >
            Hoàn tất thanh toán
          </Button>
        </div>
      </div>
    </div>
  );
}
