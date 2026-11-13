export function AlertBanner({
  message,
  onDismiss,
}: {
  message: string;
  onDismiss?: () => void;
}) {
  return (
    <div
      className="flex items-start justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
      role="alert"
    >
      <span>{message}</span>
      {onDismiss ? (
        <button type="button" onClick={onDismiss} className="font-medium opacity-70 hover:opacity-100">
          Dismiss
        </button>
      ) : null}
    </div>
  );
}
