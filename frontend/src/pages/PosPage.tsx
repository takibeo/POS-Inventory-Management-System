import { useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Button, EmptyState, LoadingSpinner, PageHeader } from '../components/ui';
import { useBranchContext } from '../contexts/BranchContext';
import authService from '../services/authService';
import branchService from '../services/branchService';
import productService from '../services/productService';
import saleService from '../services/saleService';
import type { Branch } from '../types/branch';
import type { Product } from '../types/product';
import type { SaleInvoice, SaleInvoiceRequest, SaleItem } from '../types/sale';
import type { User } from '../types/auth';

type CartItem = SaleItem & {
  productName: string;
};

type ReceiptItem = CartItem & {
  lineTotal: number;
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
  const printRef = useRef<HTMLDivElement | null>(null);
  const { branches, selectedBranchId, setSelectedBranchId, loading: branchesLoading } = useBranchContext();
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [receiptItems, setReceiptItems] = useState<ReceiptItem[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [lastInvoice, setLastInvoice] = useState<SaleInvoice | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const branchesQuery = useQuery<Branch[], Error>({
    queryKey: ['branches', 'pos'],
    queryFn: branchService.getBranches,
    retry: false,
  });

  const { data: products = [], isLoading: productsLoading, isError: productsError } = useQuery<Product[], Error>({
    queryKey: ['products'],
    queryFn: productService.getProducts,
    retry: false,
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
    if (selectedBranchId) {
      setValue('branchId', selectedBranchId);
    }
  }, [selectedBranchId, setValue]);

  useEffect(() => {
    if (!selectedBranchId && branches.length > 0) {
      setSelectedBranchId(branches[0].id);
    }
  }, [branches, selectedBranchId, setSelectedBranchId]);

  const selectedBranch = useMemo(
    () => branches.find((branch) => branch.id === selectedBranchId) ?? null,
    [branches, selectedBranchId]
  );

  const amountPaid = watch('amountPaid') || 0;
  const tax = watch('tax') || 0;
  const discount = watch('discount') || 0;

  const filteredProducts = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return products.slice(0, 12);
    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(keyword) ||
        product.sku.toLowerCase().includes(keyword)
    );
  }, [products, search]);

  const suggestionProducts = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return [];
    return products
      .filter(
        (product) =>
          product.name.toLowerCase().includes(keyword) ||
          product.sku.toLowerCase().includes(keyword)
      )
      .slice(0, 5);
  }, [products, search]);

  const subtotal = cart.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity - (item.discount ?? 0),
    0
  );
  const totalAmount = Math.max(subtotal + tax - discount, 0);
  const changeAmount = Math.max(amountPaid - totalAmount, 0);

  const createSaleMutation = useMutation({
    mutationFn: (payload: SaleInvoiceRequest) => saleService.createSale(payload),
    onSuccess: (invoice) => {
      toast.success('Tạo hóa đơn thành công.');
      setLastInvoice(invoice);
      setCart([]);
      reset({ ...defaultValues, branchId: selectedBranchId ?? branches[0]?.id ?? '' });
      setSearch('');
      setShowSuggestions(false);
      if (selectedBranchId) {
        setValue('branchId', selectedBranchId);
      }
    },
    onError: () => toast.error('Không thể tạo hóa đơn.'),
  });

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.productId === product.id);
      if (existing) {
        return prev.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
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
    setSearch('');
    setShowSuggestions(false);
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
      prev.map((item) =>
        item.productId === productId ? { ...item, discount: discountValue } : item
      )
    );
  };

  const removeItem = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.productId !== productId));
  };

  const printInvoice = () => {
    window.print();
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

    if (values.amountPaid < 0 || values.tax < 0 || values.discount < 0) {
      toast.error('Vui lòng nhập số tiền hợp lệ.');
      return;
    }

    const receiptSnapshot = cart.map((item) => ({
      ...item,
      lineTotal: item.unitPrice * item.quantity - (item.discount ?? 0),
    }));
    setReceiptItems(receiptSnapshot);

    createSaleMutation.mutate({
      branchId: values.branchId,
      cashierId: currentUser.id,
      customerName: values.customerName || undefined,
      paymentMethod: values.paymentMethod,
      tax: values.tax,
      discount: values.discount,
      amountPaid: values.amountPaid,
      items: cart.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        discount: item.discount ?? 0,
      })),
    });
  };

  const branchLabel = selectedBranch?.name ?? '—';

  const isBranchDataLoading = branchesLoading || branchesQuery.isLoading;
  const isBranchDataError = branchesQuery.isError;

  return (
    <div className="space-y-6 print:bg-white print:text-black">
      <PageHeader
        title="POS bán hàng"
        description="Tìm sản phẩm, thêm vào giỏ và tạo hóa đơn từ backend thực tế."
      />

      {isBranchDataError && (
        <EmptyState
          variant="error"
          title="Không tải được danh sách chi nhánh"
          description="Vui lòng kiểm tra API chi nhánh trước khi tiếp tục bán hàng."
        />
      )}

      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr] print:hidden">
        <div className="space-y-6">
          <div className="ui-card space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="ui-label">Chi nhánh</label>
                <select
                  {...register('branchId', { required: 'Vui lòng chọn chi nhánh' })}
                  className="ui-input"
                  disabled={isBranchDataLoading}
                  onChange={(event) => {
                    setValue('branchId', event.target.value, { shouldValidate: true });
                    setSelectedBranchId(event.target.value || null);
                  }}
                >
                  <option value="">Chọn chi nhánh</option>
                  {(branchesQuery.data ?? branches).map((branch) => (
                    <option key={branch.id} value={branch.id}>
                      {branch.name} ({branch.code})
                    </option>
                  ))}
                </select>
                {errors.branchId && (
                  <p className="mt-1 text-sm text-red-600">{errors.branchId.message}</p>
                )}
              </div>
              <div>
                <label className="ui-label">Thu ngân</label>
                <input
                  value={currentUser?.fullName ?? currentUser?.username ?? 'Đang tải...'}
                  readOnly
                  className="ui-input"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <label className="ui-label">Phương thức thanh toán</label>
                <select
                  {...register('paymentMethod', {
                    required: 'Vui lòng chọn phương thức thanh toán',
                  })}
                  className="ui-input"
                >
                  <option value="CASH">Tiền mặt</option>
                  <option value="CARD">Thẻ</option>
                  <option value="TRANSFER">Chuyển khoản</option>
                </select>
                {errors.paymentMethod && (
                  <p className="mt-1 text-sm text-red-600">{errors.paymentMethod.message}</p>
                )}
              </div>
              <div>
                <label className="ui-label">Khách hàng</label>
                <input
                  {...register('customerName', {
                    maxLength: { value: 120, message: 'Tên khách hàng quá dài' },
                  })}
                  className="ui-input"
                  placeholder="Tên khách hàng"
                />
                {errors.customerName && (
                  <p className="mt-1 text-sm text-red-600">{errors.customerName.message}</p>
                )}
              </div>
              <div>
                <label className="ui-label">Tiền khách đưa</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  inputMode="decimal"
                  {...register('amountPaid', {
                    valueAsNumber: true,
                    min: { value: 0, message: 'Tiền khách đưa không được âm' },
                  })}
                  className="ui-input"
                />
                {errors.amountPaid && (
                  <p className="mt-1 text-sm text-red-600">{errors.amountPaid.message}</p>
                )}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="ui-label">Thuế</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  inputMode="decimal"
                  {...register('tax', {
                    valueAsNumber: true,
                    min: { value: 0, message: 'Thuế không được âm' },
                  })}
                  className="ui-input"
                />
                {errors.tax && <p className="mt-1 text-sm text-red-600">{errors.tax.message}</p>}
              </div>
              <div>
                <label className="ui-label">Giảm giá hóa đơn</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  inputMode="decimal"
                  {...register('discount', {
                    valueAsNumber: true,
                    min: { value: 0, message: 'Giảm giá không được âm' },
                  })}
                  className="ui-input"
                />
                {errors.discount && (
                  <p className="mt-1 text-sm text-red-600">{errors.discount.message}</p>
                )}
              </div>
            </div>
          </div>

          <div className="ui-card space-y-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-lg font-semibold">Tìm sản phẩm</h3>
                <p className="text-sm text-slate-500">Gõ tên hoặc SKU để thêm nhanh vào giỏ.</p>
              </div>
              <div className="relative md:max-w-sm">
                <input
                  value={search}
                  onChange={(event) => {
                    setSearch(event.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => {
                    window.setTimeout(() => setShowSuggestions(false), 150);
                  }}
                  className="ui-input w-full"
                  placeholder="Nhập tên hoặc SKU"
                />
                {showSuggestions && suggestionProducts.length > 0 && (
                  <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
                    {suggestionProducts.map((product) => (
                      <button
                        type="button"
                        key={product.id}
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => addToCart(product)}
                        className="flex w-full items-center justify-between gap-3 border-b border-slate-100 px-4 py-3 text-left transition last:border-b-0 hover:bg-slate-50"
                      >
                        <div>
                          <p className="font-medium text-slate-900">{product.name}</p>
                          <p className="text-xs text-slate-500">SKU: {product.sku}</p>
                        </div>
                        <span className="text-sm font-semibold text-slate-900">
                          {formatMoney(product.price)} đ
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {productsLoading ? (
              <LoadingSpinner label="Đang tải danh sách sản phẩm..." />
            ) : productsError ? (
              <EmptyState
                variant="error"
                title="Không tải được sản phẩm"
                description="Vui lòng kiểm tra API sản phẩm rồi thử lại."
              />
            ) : (
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {filteredProducts.map((product) => (
                  <button
                    type="button"
                    key={product.id}
                    onClick={() => addToCart(product)}
                    className="rounded-xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:border-slate-900 hover:shadow-md"
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
            )}
          </div>
        </div>

        <div className="ui-card space-y-4 self-start">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Giỏ hàng</h3>
            <span className="text-sm text-slate-500">{cart.length} mặt hàng</span>
          </div>

          {cart.length === 0 ? (
            <EmptyState
              title="Giỏ hàng đang trống"
              description="Hãy chọn sản phẩm ở bên trái để bắt đầu tạo hóa đơn."
            />
          ) : (
            <div className="space-y-3">
              {cart.map((item) => (
                <div key={item.productId} className="rounded-xl border border-slate-200 p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium">{item.productName}</p>
                      <p className="text-sm text-slate-500">{formatMoney(item.unitPrice)} đ</p>
                    </div>
                    <button
                      type="button"
                      className="text-sm text-red-600 hover:text-red-700"
                      onClick={() => removeItem(item.productId)}
                    >
                      Xóa
                    </button>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-3">
                    <div>
                      <label className="ui-label">Số lượng</label>
                      <input
                        type="number"
                        min={1}
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.productId, Number(e.target.value))}
                        className="ui-input"
                      />
                    </div>
                    <div>
                      <label className="ui-label">Giảm giá</label>
                      <input
                        type="number"
                        min={0}
                        step="0.01"
                        value={item.discount ?? 0}
                        onChange={(e) => updateDiscount(item.productId, Number(e.target.value))}
                        className="ui-input"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="space-y-2 border-t border-slate-200 pt-4 text-sm">
            <div className="flex justify-between">
              <span>Tạm tính</span>
              <span>{formatMoney(subtotal)} đ</span>
            </div>
            <div className="flex justify-between">
              <span>Thuế</span>
              <span>{formatMoney(tax)} đ</span>
            </div>
            <div className="flex justify-between">
              <span>Giảm giá</span>
              <span>{formatMoney(discount)} đ</span>
            </div>
            <div className="flex justify-between text-base font-semibold">
              <span>Tổng cộng</span>
              <span>{formatMoney(totalAmount)} đ</span>
            </div>
            <div className="flex justify-between">
              <span>Tiền thừa</span>
              <span>{formatMoney(changeAmount)} đ</span>
            </div>
          </div>

          <Button
            type="button"
            className="w-full"
            disabled={
              isSubmitting ||
              createSaleMutation.isPending ||
              isBranchDataLoading ||
              isBranchDataError
            }
            onClick={handleSubmit(onSubmit)}
          >
            Hoàn tất thanh toán
          </Button>
        </div>
      </div>

      {lastInvoice && (
        <div ref={printRef} className="ui-card space-y-4 print:block">
          <div className="flex items-center justify-between print:hidden">
            <h3 className="text-lg font-semibold">Hóa đơn gần nhất</h3>
            <Button type="button" variant="secondary" onClick={printInvoice}>
              In hóa đơn
            </Button>
          </div>

          <div className="hidden print:block">
            <h2 className="text-xl font-bold">HÓA ĐƠN BÁN HÀNG</h2>
            <p>Mã hóa đơn: {lastInvoice.invoiceNumber}</p>
            <p>Chi nhánh: {branchLabel}</p>
            <p>Thu ngân: {currentUser?.fullName ?? currentUser?.username ?? '—'}</p>
            <p>Khách hàng: {lastInvoice.customerName || 'Khách lẻ'}</p>
          </div>

          <div className="grid gap-4 rounded-lg bg-slate-50 p-4 print:bg-transparent sm:grid-cols-2 xl:grid-cols-4">
            <div>
              <p className="text-sm text-slate-600">Mã hóa đơn</p>
              <p className="font-semibold">{lastInvoice.invoiceNumber}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Tổng cộng</p>
              <p className="font-semibold">{formatMoney(lastInvoice.totalAmount)} đ</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Tiền khách đưa</p>
              <p className="font-semibold">{formatMoney(lastInvoice.amountPaid)} đ</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Tiền thừa</p>
              <p className="font-semibold">{formatMoney(lastInvoice.changeAmount)} đ</p>
            </div>
          </div>

          <div>
            <h4 className="mb-2 font-semibold">Danh sách sản phẩm</h4>
            <div className="space-y-2">
              {receiptItems.map((item, index) => (
                <div
                  key={`${item.productId}-${index}`}
                  className="flex items-center justify-between border-b border-slate-200 py-2"
                >
                  <div>
                    <p className="font-medium">{item.productName}</p>
                    <p className="text-sm text-slate-500">
                      SL: {item.quantity} x {formatMoney(item.unitPrice)} đ
                    </p>
                  </div>
                  <p className="font-semibold">{formatMoney(item.lineTotal)} đ</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
