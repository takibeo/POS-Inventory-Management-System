import {
    CartesianGrid,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import { formatAxisValue, formatCurrency, formatDateShort } from '../../utils/formatters';
import { SkeletonChart } from '../ui/Skeleton';
import type { RevenueTrend } from '../../types/report';

type Props = {
    data: RevenueTrend[];
    isLoading?: boolean;
};

export default function RevenueLineChart({ data, isLoading = false }: Props) {
    if (isLoading) return <SkeletonChart />;

    if (data.length === 0) {
        return (
            <p className="py-8 text-center text-sm text-slate-500">
                Chưa có dữ liệu doanh thu.
            </p>
        );
    }

    return (
        <ResponsiveContainer width="100%" height={280}>
            <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                    dataKey="date"
                    tickFormatter={formatDateShort}
                    tick={{ fontSize: 11 }}
                    interval="preserveStartEnd"
                />
                <YAxis
                    tickFormatter={formatAxisValue}
                    tick={{ fontSize: 11 }}
                    width={50}
                />
                <Tooltip
                    formatter={(v: number) => [formatCurrency(v), 'Doanh thu']}
                    labelFormatter={(label: string) => `Ngày ${formatDateShort(label)}`}
                />
                <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 5 }}
                />
            </LineChart>
        </ResponsiveContainer>
    );
}