type Size = 'xs' | 'sm' | 'md' | 'lg';

type LoadingSpinnerProps = {
  label?: string;
  size?: Size;
  fullPage?: boolean;
  inline?: boolean;
};

const sizeMap: Record<Size, string> = {
  xs: 'h-3 w-3 border-[1.5px]',
  sm: 'h-4 w-4 border-2',
  md: 'h-8 w-8 border-2',
  lg: 'h-12 w-12 border-[3px]',
};

export default function LoadingSpinner({
                                         label = 'Đang tải...',
                                         size = 'md',
                                         fullPage = false,
                                         inline = false,
                                       }: LoadingSpinnerProps) {
  const spinnerEl = (
      <div
          className={`animate-spin rounded-full border-slate-200
        border-t-slate-700 ${sizeMap[size]}`}
          role="status"
          aria-label={label}
      />
  );

  if (inline) {
    return spinnerEl;
  }

  const content = (
      <div className="flex flex-col items-center justify-center gap-3
      text-slate-600">
        {spinnerEl}
        {label && size !== 'xs' && size !== 'sm' && (
            <p className="text-sm">{label}</p>
        )}
      </div>
  );

  if (fullPage) {
    return (
        <div className="flex min-h-[240px] items-center justify-center">
          {content}
        </div>
    );
  }

  return <div className="py-8 flex justify-center">{content}</div>;
}