import { useEffect } from 'react';
import LoadingSpinner from './LoadingSpinner';

type ConfirmModalProps = {
  isOpen: boolean;
  title?: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isLoading?: boolean;
  variant?: 'danger' | 'warning' | 'primary';
  onConfirm: () => void;
  onCancel: () => void;
};

const variantConfig = {
  danger: {
    iconBg: 'bg-red-100',
    iconColor: 'text-red-600',
    btnClass: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
  },
  warning: {
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
    btnClass: 'bg-amber-500 hover:bg-amber-600 focus:ring-amber-400',
  },
  primary: {
    iconBg: 'bg-slate-100',
    iconColor: 'text-slate-700',
    btnClass: 'bg-slate-900 hover:bg-slate-700 focus:ring-slate-500',
  },
};

export default function ConfirmModal({
                                       isOpen,
                                       title = 'Xác nhận',
                                       message,
                                       confirmLabel = 'Xác nhận',
                                       cancelLabel = 'Hủy',
                                       isLoading = false,
                                       variant = 'danger',
                                       onConfirm,
                                       onCancel,
                                     }: ConfirmModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isLoading) onCancel();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isOpen, isLoading, onCancel]);

  if (!isOpen) return null;

  const vc = variantConfig[variant];

  return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <button
            type="button"
            className="absolute inset-0 bg-slate-900/40"
            aria-label="Đóng hộp thoại"
            onClick={isLoading ? undefined : onCancel}
        />
        <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-modal-title"
            className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
        >
          <div className="flex items-start gap-4">
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center
            rounded-full ${vc.iconBg} ${vc.iconColor}`}>
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24"
                   stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                />
              </svg>
            </div>
            <div className="flex-1">
              <h3 id="confirm-modal-title"
                  className="text-base font-semibold text-slate-900">
                {title}
              </h3>
              <p className="mt-1 text-sm text-slate-600">{message}</p>
            </div>
          </div>

          {isLoading ? (
              <div className="mt-4">
                <LoadingSpinner label="Đang xử lý..." size="sm" />
              </div>
          ) : (
              <div className="mt-6 flex justify-end gap-3">
                <button
                    type="button"
                    onClick={onCancel}
                    className="rounded-xl border border-slate-300 bg-white px-4 py-2
                text-sm font-semibold text-slate-700 transition hover:border-slate-900"
                >
                  {cancelLabel}
                </button>
                <button
                    type="button"
                    onClick={onConfirm}
                    className={`rounded-xl px-4 py-2 text-sm font-semibold text-white
                transition focus:outline-none focus:ring-2 focus:ring-offset-2
                ${vc.btnClass}`}
                >
                  {confirmLabel}
                </button>
              </div>
          )}
        </div>
      </div>
  );
}