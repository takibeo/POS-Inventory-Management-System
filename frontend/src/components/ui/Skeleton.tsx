import type { CSSProperties } from 'react';

type SkeletonProps = {
    className?: string;
    style?: CSSProperties;
};

export function Skeleton({ className = '', style }: SkeletonProps) {
    return (
        <div
            className={`animate-pulse rounded bg-slate-200 ${className}`}
            style={style}
            aria-hidden
        />
    );
}

export function SkeletonRows({ rows = 5 }: { rows?: number }) {
    return (
        <div className="space-y-3">
            {Array.from({ length: rows }).map((_, i) => (
                <div key={i} className="flex gap-4 px-4 py-3">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-4 w-1/5" />
                    <Skeleton className="h-4 w-1/6 ml-auto" />
                </div>
            ))}
        </div>
    );
}

export function SkeletonCard() {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-3">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-3 w-20" />
        </div>
    );
}

export function SkeletonChart() {
    return (
        <div className="space-y-2 p-2">
            <div className="flex items-end gap-2 h-48">
                {Array.from({ length: 12 }).map((_, i) => (
                    <Skeleton
                        key={i}
                        className="flex-1"
                        style={{ height: `${((i * 17 + 30) % 80) + 20}%` }}
                    />
                ))}
            </div>
            <Skeleton className="h-3 w-full" />
        </div>
    );
}