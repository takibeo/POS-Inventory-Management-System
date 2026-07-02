import {
    AreaChart,
    Area,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
    Legend,
} from 'recharts';
import { formatAxisValue, formatCurrency, formatDateShort } from '../../utils/formatters';
import { SkeletonChart } from '../ui/Skeleton';
import type { ProfitTrend } from '../../types/report';

type Props = {
    data: ProfitTrend[];
    isLoading?: boolean;
};

export default function ProfitLineChart({ data, isLoading = false }: Props) {
    if (isLoading) return <SkeletonChart />;

    if (data.length === 0) {
        return (
            <p className="py-8 text-center text-sm text-slate-500">
                Chưa có dữ liệu lợi nhuận.
            </p>
        );
    }

    return (
        <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                    dataKey="date"
                    tickFormatter={formatDateShort}
                    tick={{ fontSize: 11, fill: '#94a3b8' }}
                    interval="preserveStartEnd"
                    axisLine={false}
                    tickLine={false}
                />
                <YAxis
                    tickFormatter={formatAxisValue}
                    tick={{ fontSize: 11, fill: '#94a3b8' }}
                    width={55}
                    axisLine={false}
                    tickLine={false}
                />
                <Tooltip
                    formatter={(v: number) => [formatCurrency(v), 'Lợi nhuận']}
                    labelFormatter={(label: string) => `Ngày ${formatDateShort(label)}`}
                    contentStyle={{
                        borderRadius: '10px',
                        border: '1px solid #e2e8f0',
                        fontSize: 12,
                    }}
                />
                <Legend
                    formatter={() => 'Lợi nhuận'}
                    wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
                />
                <Area
                    type="monotone"
                    dataKey="profit"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    fill="#10b98120"
                    dot={false}
                    activeDot={{ r: 5, strokeWidth: 0 }}
                />
            </AreaChart>
        </ResponsiveContainer>
    );
}