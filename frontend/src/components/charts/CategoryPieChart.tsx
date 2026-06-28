import {
    Cell,
    Legend,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
} from 'recharts';
import { SkeletonChart } from '../ui/Skeleton';
import type { CategoryBreakdown } from '../../types/report';

type Props = {
    data: CategoryBreakdown[];
    isLoading?: boolean;
};

const COLORS = [
    '#6366f1', '#8b5cf6', '#a78bfa', '#c4b5fd',
    '#10b981', '#34d399', '#3b82f6', '#60a5fa',
    '#f97316', '#fb923c',
];

export default function CategoryPieChart({ data, isLoading = false }: Props) {
    if (isLoading) return <SkeletonChart />;

    if (data.length === 0) {
        return (
            <p className="py-8 text-center text-sm text-slate-500">
                Chưa có dữ liệu danh mục.
            </p>
        );
    }

    return (
        <ResponsiveContainer width="100%" height={280}>
            <PieChart>
                <Pie
                    data={data}
                    dataKey="productCount"
                    nameKey="categoryName"
                    cx="50%"
                    cy="45%"
                    outerRadius={85}
                    label={({ categoryName, percent }) =>
                        percent > 0.05 ? `${(percent * 100).toFixed(0)}%` : ''
                    }
                    labelLine={false}
                >
                    {data.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip
                    formatter={(v: number, name: string) => [v, name]}
                />
                <Legend
                    formatter={(value) => (
                        <span style={{ fontSize: 11, color: '#475569' }}>{value}</span>
                    )}
                />
            </PieChart>
        </ResponsiveContainer>
    );
}