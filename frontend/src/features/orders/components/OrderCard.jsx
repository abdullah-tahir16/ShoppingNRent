import { StatusBadge } from "../../../shared/components/ui/StatusBadge";

export function OrderCard({ order, onInspect, onDelete, deleting }) {
  return (
    <article className="rounded-3xl border border-stone-200 bg-stone-50 p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-stone-950">{order.name}</h3>
          <p className="mt-1 text-sm text-stone-500">{order.referenceId || order._id}</p>
        </div>
        <StatusBadge tone="success">{order.order_status}</StatusBadge>
      </div>
      <dl className="mt-4 grid gap-3 text-sm text-stone-600">
        <div className="flex justify-between gap-4">
          <dt>Total</dt>
          <dd className="font-semibold text-stone-950">PKR {order.total_price}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt>Category</dt>
          <dd className="font-semibold text-stone-950">{order.category}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt>Seller</dt>
          <dd className="font-semibold text-stone-950">{order.seller}</dd>
        </div>
      </dl>
      <div className="mt-5 flex flex-wrap gap-3">
        <button className="primary-button flex-1" type="button" onClick={() => onInspect(order._id)}>
          Inspect
        </button>
        <button className="secondary-button" type="button" disabled={deleting} onClick={() => onDelete(order._id)}>
          Delete
        </button>
      </div>
    </article>
  );
}
