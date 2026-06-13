import type { ReactNode } from 'react';
import Button from './Button';

type ExtraAction = {
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
};

type TableRowActionsProps = {
    onEdit?: () => void;
    onDelete?: () => void;
    isLoading?: boolean;
    extraActions?: ExtraAction[];
};

export default function TableRowActions({
                                            onEdit,
                                            onDelete,
                                            isLoading = false,
                                            extraActions = [],
                                        }: TableRowActionsProps) {
    if (isLoading) {
        return (
            <div className="flex gap-2">
                <div className="h-7 w-14 animate-pulse rounded-lg bg-slate-200" />
                <div className="h-7 w-14 animate-pulse rounded-lg bg-slate-200" />
            </div>
        );
    }

    return (
        <div className="flex flex-wrap gap-2">
            {extraActions.map((action) => (
                <Button
                    key={action.label}
                    variant={action.variant ?? 'secondary'}
                    className="px-3 py-1 text-xs"
                    onClick={action.onClick}
                >
                    {action.label}
                </Button>
            ))}
            {onEdit && (
                <Button variant="secondary" className="px-3 py-1 text-xs" onClick={onEdit}>
                    Sửa
                </Button>
            )}
            {onDelete && (
                <Button variant="danger" className="px-3 py-1 text-xs" onClick={onDelete}>
                    Xóa
                </Button>
            )}
        </div>
    );
}