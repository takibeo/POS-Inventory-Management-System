export function formatCurrency(value: number) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatAxisValue(value: number) {
  return new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 0 }).format(value);
}

export function formatDateShort(value: string | Date) {
  const date = typeof value === 'string' ? new Date(value) : value;
  return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
}

export const STATUS_LABEL: Record<string, string> = {
  DRAFT: 'Nháp',
  SUBMITTED: 'Đã gửi',
  RECEIVED: 'Đã nhận',
  ACTIVE: 'Hoạt động',
  INACTIVE: 'Ngừng',
  PENDING: 'Chờ xử lý',
  COMPLETED: 'Hoàn tất',
};

export const STATUS_BADGE: Record<string, string> = {
  DRAFT: 'ui-badge-yellow',
  SUBMITTED: 'ui-badge-blue',
  RECEIVED: 'ui-badge-green',
  ACTIVE: 'ui-badge-green',
  INACTIVE: 'ui-badge-slate',
  PENDING: 'ui-badge-yellow',
  COMPLETED: 'ui-badge-green',
};
