import { useBranchContext } from '../contexts/BranchContext';

export default function BranchSelector() {
  const { branches, selectedBranchId, setSelectedBranchId, loading } = useBranchContext();

  return (
    <label className="flex items-center gap-2 text-sm text-slate-600">
      <span className="hidden sm:inline">Chi nhánh</span>
      <select
        value={selectedBranchId ?? ''}
        onChange={(e) => setSelectedBranchId(e.target.value || null)}
        disabled={loading || branches.length === 0}
        className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-slate-900"
      >
        {branches.length === 0 ? (
          <option value="">Không có chi nhánh</option>
        ) : (
          branches.map((branch) => (
            <option key={branch.id} value={branch.id}>
              {branch.name}
            </option>
          ))
        )}
      </select>
    </label>
  );
}
