import { STATUS_BADGE, STATUS_LABEL } from '../../utils/formatters';

type BadgeProps = {
    status: string;
    label?: string;
};

export default function Badge({ status, label }: BadgeProps) {
    const cls = STATUS_BADGE[status] ?? 'ui-badge-slate';
    const text = label ?? STATUS_LABEL[status] ?? status;
    return <span className={`ui-badge ${cls}`}>{text}</span>;
}