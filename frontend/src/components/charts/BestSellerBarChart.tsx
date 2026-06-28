import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import { SkeletonChart } from '../ui/Skeleton';
import type { BestSeller } from '../../types/report';

type Props = {
    data: BestSeller[];
    isLoading?: boolean;
};

const COLORS = ['#f97316', '#fb923c', '#fdba74', '#fed7aa', '#ffedd5'];

export default function BestSellerBarChart({ data, isLoading = false }: Props) {
    if (isLoading) return <SkeletonChart />;

    const top5 = data.slice(0, 5);

    if (top5.length === 0) {
        return (
            <p className="py-8 text-center text-sm text-slate-500">
                Chưa có dữ liệu sản phẩm bán chạy.
            </p>
        );
    }

    return (
        <ResponsiveContainer width="100%" height={280}>
            <BarChart
                data={top5}
                margin={{ top: 5, right: 10, left: 0, bottom: 40 }}
            >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                    dataKey="productName"
                    tick={{ fontSize: 11 }}
                    angle={-20}
                    textAnchor="end"
                    interval={0}
                />
                <YAxis tick={{ fontSize: 11 }} width={40} />
                <Tooltip
                    formatter={(v: number) => [v.toLocaleString(), 'Đã bán']}
                />
                <Bar dataKey="quantitySold" radius={[6, 6, 0, 0]}>
                    {top5.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
}