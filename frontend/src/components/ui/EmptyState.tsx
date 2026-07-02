import type { ReactNode } from 'react';

type EmptyStateVariant = 'empty' | 'error' | 'search';

type EmptyStateProps = {
    title?: string;
    description?: string;
    action?: ReactNode;
    variant?: EmptyStateVariant;
};

const config = {
    empty: {
        bg: 'bg-slate-50',
        border: 'border-slate-200',
        iconBg: 'bg-slate-100',
        iconColor: 'text-slate-400',
        titleColor: 'text-slate-700',
        descColor: 'text-slate-500',
        icon: (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        ),
        defaultTitle: 'Chưa có dữ liệu',
        defaultDesc: 'Hãy thêm mục mới để bắt đầu sử dụng tính năng này.',
    },
    error: {
        bg: 'bg-red-50',
        border: 'border-red-200',
        iconBg: 'bg-red-100',
        iconColor: 'text-red-500',
        titleColor: 'text-red-800',
        descColor: 'text-red-600',
        icon: (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        ),
        defaultTitle: 'Không thể tải dữ liệu',
        defaultDesc: 'Đã xảy ra lỗi khi kết nối với máy chủ. Vui lòng thử lại.',
    },
    search: {
        bg: 'bg-slate-50',
        border: 'border-slate-200',
        iconBg: 'bg-slate-100',
        iconColor: 'text-slate-400',
        titleColor: 'text-slate-700',
        descColor: 'text-slate-500',
        icon: (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0015.803 15.803z" />
        ),
        defaultTitle: 'Không tìm thấy kết quả',
        defaultDesc: 'Thử thay đổi từ khóa hoặc bộ lọc để tìm kiếm lại.',
    },
};

export default function EmptyState({
                                       title,
                                       description,
                                       action,
                                       variant = 'empty',
                                   }: EmptyStateProps) {
    const c = config[variant];

    return (
        <div className={`flex flex-col items-center justify-center rounded-xl
      border border-dashed ${c.border} ${c.bg} px-6 py-12 text-center`}>
            <div className={`mb-4 flex h-14 w-14 items-center justify-center
        rounded-2xl ${c.iconBg} ${c.iconColor}`}>
                <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24"
                     stroke="currentColor" aria-hidden>
                    {c.icon}
                </svg>
            </div>
            <h3 className={`text-base font-semibold ${c.titleColor}`}>
                {title ?? c.defaultTitle}
            </h3>
            <p className={`mt-1.5 max-w-sm text-sm ${c.descColor}`}>
                {description ?? c.defaultDesc}
            </p>
            {action && <div className="mt-5">{action}</div>}
        </div>
    );
}