export function EmptyState({ title, description }) {
  return (
    <div className="rounded-3xl border border-dashed border-stone-200 bg-stone-50 p-8 text-center">
      <h3 className="text-lg font-semibold text-stone-900">{title}</h3>
      <p className="mt-2 text-sm leading-7 text-stone-600">{description}</p>
    </div>
  );
}
