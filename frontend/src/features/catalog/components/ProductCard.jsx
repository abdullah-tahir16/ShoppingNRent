import { Link } from "react-router-dom";
import { StatusBadge } from "../../../shared/components/ui/StatusBadge";

export function ProductCard({ product, editLinkState, orderLinkState }) {
  return (
    <article className="rounded-3xl border border-stone-200 bg-stone-50 p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-stone-950">{product.name}</h3>
          <p className="mt-1 text-sm text-stone-500">
            {product.category || "Uncategorized"} in {product.city}
          </p>
        </div>
        <StatusBadge tone={product.active ? "success" : "neutral"}>
          {product.active ? "Active" : "Inactive"}
        </StatusBadge>
      </div>
      <p className="mt-4 text-sm leading-7 text-stone-600">
        {product.description || product.details || "No product description available."}
      </p>
      <dl className="mt-5 grid gap-3 text-sm text-stone-600">
        <div className="flex justify-between gap-4">
          <dt>Price</dt>
          <dd className="font-semibold text-stone-950">PKR {product.price}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt>Condition</dt>
          <dd className="font-semibold text-stone-950">{product.condition || "Not set"}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt>Make</dt>
          <dd className="font-semibold text-stone-950">{product.make || "Not set"}</dd>
        </div>
      </dl>
      <div className="mt-5 flex flex-wrap gap-3">
        <Link className="primary-button flex-1" to="/orders" state={orderLinkState(product)}>
          Order this
        </Link>
        <Link className="secondary-button" to="/studio" state={editLinkState(product)}>
          Edit
        </Link>
      </div>
    </article>
  );
}
