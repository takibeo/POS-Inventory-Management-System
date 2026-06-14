import type { ReactNode } from 'react';

type EmptyStateVariant = 'empty' | 'error';

type EmptyStateProps = {
    title?: string;
    description?: string;
    action?: ReactNode;
    variant?: EmptyStateVariant;
};

const config = {
    empty: {
        bg: 'bg-slate-50',
        border: 'border-slate-300',
        iconBg: 'bg-slate-200',
        iconColor: 'text-slate-500',
        titleColor: 'text-slate-800',
        descColor: 'text-slate-500',
        icon: (
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
        ),
    },
    error: {
        bg: 'bg-red-50',
        border: 'border-red-200',
        iconBg: 'bg-red-100',
        iconColor: 'text-red-500',
        titleColor: 'text-red-800',
        descColor: 'text-red-600',
        icon: (
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
            />
        ),
    },
};

export default function EmptyState({
                                       title,
                                       description,
                                       action,
                                       variant = 'empty',
                                   }: EmptyStateProps) {
    const c = config[variant];

    const defaultTitle = variant === 'error'
        ? 'Đã xảy ra lỗi'
        : 'Chưa có dữ liệu';

    const defaultDesc = variant === 'error'
        ? 'Không thể tải dữ liệu. Vui lòng thử lại.'
        : 'Hãy thêm mục mới để bắt đầu.';

    return (
        <div
            className={`flex flex-col items-center justify-center rounded-xl border border-dashed
        ${c.border} ${c.bg} px-6 py-12 text-center`}
        >
            <div
                className={`mb-3 flex h-12 w-12 items-center justify-center
          rounded-full ${c.iconBg} ${c.iconColor}`}
            >
                <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden
                >
                    {c.icon}
                </svg>
            </div>
            <h3 className={`text-base font-semibold ${c.titleColor}`}>
                {title ?? defaultTitle}
            </h3>
            <p className={`mt-1 max-w-sm text-sm ${c.descColor}`}>
                {description ?? defaultDesc}
            </p>
            {action && <div className="mt-4">{action}</div>}
        </div>
    );
}