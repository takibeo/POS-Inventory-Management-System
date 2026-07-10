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
import { 
  Search, 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  Printer,
  CreditCard,
  Landmark,
  Users,
  Store,
  User as UserIcon,
  Receipt,
  Tag,
  Percent
} from 'lucide-react';

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
  const [activeTab, setActiveTab] = useState<'products' | 'cart'>('products');

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
  const paymentMethod = watch('paymentMethod') || 'CASH';

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
    setActiveTab('cart');
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

  // Payment method icons
  const getPaymentIcon = (method: string) => {
    switch(method) {
      case 'CASH': return <Landmark className="w-4 h-4" />;
      case 'CARD': return <CreditCard className="w-4 h-4" />;
      case 'TRANSFER': return <Landmark className="w-4 h-4" />;
      default: return <CreditCard className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6 print:bg-white print:text-black">
      {/* Page Header với gradient */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 p-6 shadow-lg">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full blur-xl" />
        
        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <ShoppingCart className="w-6 h-6" />
              POS bán hàng
            </h1>
            <p className="text-emerald-100 text-sm mt-1">
              Tìm sản phẩm, thêm vào giỏ và tạo hóa đơn
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-lg">
              <Store className="w-4 h-4 text-emerald-100" />
              <span className="text-white text-sm font-medium">{branchLabel}</span>
            </div>
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-lg">
              <UserIcon className="w-4 h-4 text-emerald-100" />
              <span className="text-white text-sm font-medium">
                {currentUser?.fullName ?? currentUser?.username ?? 'Loading...'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {isBranchDataError && (
        <EmptyState
          variant="error"
          title="Không tải được danh sách chi nhánh"
          description="Vui lòng kiểm tra API chi nhánh trước khi tiếp tục bán hàng."
        />
      )}

      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr] print:hidden">
        {/* Left Column - Products */}
        <div className="space-y-6">
          {/* Search & Filters */}
          <div className="ui-card space-y-4">
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2">
                <Search className="w-5 h-5 text-slate-400" />
              </div>
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
                className="ui-input w-full pl-10"
                placeholder="Tìm kiếm sản phẩm theo tên hoặc SKU..."
              />
              {showSuggestions && suggestionProducts.length > 0 && (
                <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
                  {suggestionProducts.map((product) => (
                    <button
                      type="button"
                      key={product.id}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => addToCart(product)}
                      className="flex w-full items-center justify-between gap-3 border-b border-slate-100 px-4 py-3 text-left transition hover:bg-emerald-50 last:border-b-0"
                    >
                      <div>
                        <p className="font-medium text-slate-900">{product.name}</p>
                        <p className="text-xs text-slate-500">SKU: {product.sku}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold text-emerald-600">
                          {formatMoney(product.price)} đ
                        </span>
                        <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                          Còn {product.stockQuantity}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
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
                    className="group relative rounded-xl border border-slate-200 bg-white p-4 text-left transition-all hover:border-emerald-400 hover:shadow-md hover:-translate-y-0.5"
                  >
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                        Thêm
                      </span>
                    </div>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-semibold text-slate-900 text-sm line-clamp-2">
                          {product.name}
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5">SKU: {product.sku}</p>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <p className="text-sm font-bold text-emerald-600">
                        {formatMoney(product.price)} đ
                      </p>
                      <p className="text-xs text-slate-400">
                        Còn: {product.stockQuantity}
                      </p>
                    </div>
                    <div className="mt-2 w-full bg-slate-100 rounded-full h-1">
                      <div 
                        className="bg-emerald-500 rounded-full h-1 transition-all duration-300"
                        style={{ width: `${Math.min((product.stockQuantity / 100) * 100, 100)}%` }}
                      />
                    </div>
                  </button>
                ))}
                {filteredProducts.length === 0 && (
                  <div className="col-span-full text-center py-8">
                    <p className="text-sm text-slate-500">Không tìm thấy sản phẩm phù hợp.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Cart */}
        <div className="space-y-6">
          {/* Cart Summary */}
          <div className="ui-card space-y-4 sticky top-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <ShoppingCart className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Giỏ hàng</h3>
                  <p className="text-xs text-slate-500">{cart.length} mặt hàng</p>
                </div>
              </div>
              {cart.length > 0 && (
                <button
                  type="button"
                  onClick={() => setCart([])}
                  className="text-xs text-red-600 hover:text-red-700 font-medium"
                >
                  Xóa tất cả
                </button>
              )}
            </div>

            {cart.length === 0 ? (
              <div className="py-8 text-center">
                <div className="inline-flex p-4 bg-slate-100 rounded-full mb-3">
                  <ShoppingCart className="w-8 h-8 text-slate-400" />
                </div>
                <p className="text-sm font-medium text-slate-600">Giỏ hàng trống</p>
                <p className="text-xs text-slate-400 mt-1">Chọn sản phẩm để bắt đầu</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div key={item.productId} className="group rounded-xl border border-slate-200 p-3 hover:border-emerald-200 transition-colors">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-slate-900 truncate">
                          {item.productName}
                        </p>
                        <p className="text-xs text-emerald-600 font-medium">
                          {formatMoney(item.unitPrice)} đ
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item.productId)}
                        className="text-slate-400 hover:text-red-600 transition-colors p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="mt-3 grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-slate-500 font-medium">SL</label>
                        <div className="flex items-center gap-1 mt-0.5">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.productId, Math.max(1, item.quantity - 1))}
                            className="p-1 rounded border border-slate-200 hover:bg-slate-50 transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <input
                            type="number"
                            min={1}
                            value={item.quantity}
                            onChange={(e) => updateQuantity(item.productId, Number(e.target.value))}
                            className="w-12 text-center text-sm border-0 focus:ring-0 bg-transparent"
                          />
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            className="p-1 rounded border border-slate-200 hover:bg-slate-50 transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="text-xs text-slate-500 font-medium">Giảm giá</label>
                        <div className="relative mt-0.5">
                          <input
                            type="number"
                            min={0}
                            step="0.01"
                            value={item.discount ?? 0}
                            onChange={(e) => updateDiscount(item.productId, Number(e.target.value))}
                            className="ui-input w-full text-sm pl-7"
                          />
                          <Percent className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Totals */}
            {cart.length > 0 && (
              <>
                <div className="border-t border-slate-200 pt-3 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Tạm tính</span>
                    <span className="font-medium">{formatMoney(subtotal)} đ</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Thuế</span>
                    <span className="font-medium">{formatMoney(tax)} đ</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Giảm giá</span>
                    <span className="font-medium text-red-600">-{formatMoney(discount)} đ</span>
                  </div>
                  <div className="flex justify-between text-base font-bold pt-2 border-t border-slate-200">
                    <span>Tổng cộng</span>
                    <span className="text-emerald-600">{formatMoney(totalAmount)} đ</span>
                  </div>
                  {amountPaid > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Tiền thừa</span>
                      <span className="font-medium text-emerald-600">{formatMoney(changeAmount)} đ</span>
                    </div>
                  )}
                </div>

                {/* Payment Form */}
                <div className="space-y-3 pt-2">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium text-slate-600">PT Thanh toán</label>
                      <select
                        {...register('paymentMethod')}
                        className="ui-input text-sm"
                      >
                        <option value="CASH">💵 Tiền mặt</option>
                        <option value="CARD">💳 Thẻ</option>
                        <option value="TRANSFER">🏦 Chuyển khoản</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-slate-600">Khách hàng</label>
                      <input
                        {...register('customerName')}
                        className="ui-input text-sm"
                        placeholder="Tên khách hàng"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium text-slate-600">Tiền khách đưa</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        inputMode="decimal"
                        {...register('amountPaid', {
                          valueAsNumber: true,
                          min: { value: 0, message: 'Không được âm' },
                        })}
                        className="ui-input text-sm"
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-slate-600">Giảm giá</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        inputMode="decimal"
                        {...register('discount', {
                          valueAsNumber: true,
                          min: { value: 0, message: 'Không được âm' },
                        })}
                        className="ui-input text-sm"
                        placeholder="0"
                      />
                    </div>
                  </div>

                  <Button
                    type="button"
                    className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold"
                    disabled={
                      isSubmitting ||
                      createSaleMutation.isPending ||
                      isBranchDataLoading ||
                      isBranchDataError ||
                      cart.length === 0
                    }
                    onClick={handleSubmit(onSubmit)}
                  >
                    {createSaleMutation.isPending ? (
                      <div className="flex items-center gap-2">
                        <LoadingSpinner className="w-4 h-4" />
                        Đang xử lý...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Receipt className="w-4 h-4" />
                        Hoàn tất thanh toán
                      </div>
                    )}
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Invoice Preview */}
      {lastInvoice && (
        <div ref={printRef} className="ui-card space-y-4 print:block">
          <div className="flex items-center justify-between print:hidden">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <Receipt className="w-5 h-5 text-emerald-600" />
              </div>
              <h3 className="text-lg font-semibold">Hóa đơn gần nhất</h3>
            </div>
            <Button type="button" variant="secondary" onClick={printInvoice} className="flex items-center gap-2">
              <Printer className="w-4 h-4" />
              In hóa đơn
            </Button>
          </div>

          <div className="hidden print:block text-center mb-6">
            <h2 className="text-2xl font-bold">HÓA ĐƠN BÁN HÀNG</h2>
            <p className="text-sm text-slate-500">Mã: {lastInvoice.invoiceNumber}</p>
          </div>

          <div className="grid gap-3 rounded-xl bg-slate-50 p-4 print:bg-transparent sm:grid-cols-2 xl:grid-cols-4">
            <div className="flex flex-col">
              <span className="text-xs text-slate-500 uppercase tracking-wider">Mã hóa đơn</span>
              <span className="font-semibold text-slate-900">{lastInvoice.invoiceNumber}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-slate-500 uppercase tracking-wider">Tổng cộng</span>
              <span className="font-semibold text-emerald-600 text-lg">{formatMoney(lastInvoice.totalAmount)} đ</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-slate-500 uppercase tracking-wider">Tiền khách đưa</span>
              <span className="font-semibold text-slate-900">{formatMoney(lastInvoice.amountPaid)} đ</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-slate-500 uppercase tracking-wider">Tiền thừa</span>
              <span className="font-semibold text-emerald-600">{formatMoney(lastInvoice.changeAmount)} đ</span>
            </div>
          </div>

          <div className="print:mt-4">
            <h4 className="mb-3 font-semibold text-slate-900 flex items-center gap-2">
              <Tag className="w-4 h-4" />
              Danh sách sản phẩm
            </h4>
            <div className="space-y-2">
              {receiptItems.map((item, index) => (
                <div
                  key={`${item.productId}-${index}`}
                  className="flex items-center justify-between border-b border-slate-100 py-2 last:border-0"
                >
                  <div>
                    <p className="font-medium text-slate-900">{item.productName}</p>
                    <p className="text-xs text-slate-500">
                      SL: {item.quantity} x {formatMoney(item.unitPrice)} đ
                      {item.discount > 0 && (
                        <span className="ml-2 text-red-500">-{formatMoney(item.discount)} đ</span>
                      )}
                    </p>
                  </div>
                  <p className="font-semibold text-emerald-600">{formatMoney(item.lineTotal)} đ</p>
                </div>
              ))}
            </div>
          </div>

          <div className="print:mt-4 grid grid-cols-2 gap-2 text-sm border-t border-slate-200 pt-4">
            <div>
              <p className="text-slate-500">Chi nhánh</p>
              <p className="font-medium">{branchLabel}</p>
            </div>
            <div>
              <p className="text-slate-500">Thu ngân</p>
              <p className="font-medium">{currentUser?.fullName ?? currentUser?.username ?? '—'}</p>
            </div>
            <div className="col-span-2">
              <p className="text-slate-500">Khách hàng</p>
              <p className="font-medium">{lastInvoice.customerName || 'Khách lẻ'}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}