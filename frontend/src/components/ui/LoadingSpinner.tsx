type LoadingSpinnerProps = {
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  fullPage?: boolean;
};

const sizeClasses = {
  sm: 'h-5 w-5 border-2',
  md: 'h-8 w-8 border-2',
  lg: 'h-12 w-12 border-[3px]',
};

export default function LoadingSpinner({
  label = 'Đang tải...',
  size = 'md',
  fullPage = false,
}: LoadingSpinnerProps) {
  const spinner = (
    <div className="flex flex-col items-center justify-center gap-3 text-slate-600">
      <div
        className={`animate-spin rounded-full border-slate-200 border-t-slate-900 ${sizeClasses[size]}`}
        role="status"
        aria-label={label}
      />
      {label && <p className="text-sm">{label}</p>}
    </div>
  );

  if (fullPage) {
    return <div className="flex min-h-[240px] items-center justify-center">{spinner}</div>;
  }

  return <div className="py-8">{spinner}</div>;
}
