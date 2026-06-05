import Button from './Button';

type TableRowActionsProps = {
  onEdit: () => void;
  onDelete: () => void;
};

export default function TableRowActions({ onEdit, onDelete }: TableRowActionsProps) {
  return (
    <div className="flex gap-2">
      <Button variant="secondary" className="px-3 py-1" onClick={onEdit}>
        Sửa
      </Button>
      <Button variant="danger" className="px-3 py-1" onClick={onDelete}>
        Xóa
      </Button>
    </div>
  );
}
