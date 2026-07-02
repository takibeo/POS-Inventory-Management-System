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

type LabelProps = {
    cx: number;
    cy: number;
    midAngle: number;
    innerRadius: number;
    outerRadius: number;
    percent: number;
};

const RADIAN = Math.PI / 180;

function CustomLabel({ cx, cy, midAngle, innerRadius, outerRadius, percent }: LabelProps) {
    if (percent < 0.05) return null;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return (
        <text x={x} y={y} fill="white" textAnchor="middle"
              dominantBaseline="central" style={{ fontSize: 11, fontWeight: 600 }}>
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    );
}

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
                    innerRadius={55}
                    outerRadius={90}
                    labelLine={false}
                    label={CustomLabel}
                >
                    {data.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip
                    formatter={(v: number, name: string) => [v + ' sản phẩm', name]}
                    contentStyle={{
                        borderRadius: '10px',
                        border: '1px solid #e2e8f0',
                        fontSize: 12,
                    }}
                />
                <Legend
                    formatter={(value) => (
                        <span style={{ fontSize: 11, color: '#475569' }}>{value}</span>
                    )}
                    wrapperStyle={{ paddingTop: 8 }}
                />
            </PieChart>
        </ResponsiveContainer>
    );
}