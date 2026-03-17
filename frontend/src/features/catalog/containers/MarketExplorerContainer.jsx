import { useState } from "react";
import { useSession } from "../../../app/providers/SessionProvider";
import { EmptyState } from "../../../shared/components/ui/EmptyState";
import { SectionCard } from "../../../shared/components/ui/SectionCard";
import { ProductCard } from "../components/ProductCard";
import { useMarketProductsQuery } from "../queries";

export function MarketExplorerContainer() {
  const { userSession, adminSession, hasDualSession } = useSession();
  const [draftCity, setDraftCity] = useState("Karachi");
  const [activeCity, setActiveCity] = useState("Karachi");

  const productsQuery = useMarketProductsQuery({
    city: activeCity,
    userToken: userSession.token,
    adminToken: adminSession.token,
    enabled: hasDualSession && Boolean(activeCity),
  });

  const products = productsQuery.data?.data || [];

  return (
    <SectionCard
      eyebrow="Marketplace"
      title="Browse By City"
      description="The catalog comes from the real backend search endpoint. Product cards route directly into the order and studio flows."
      aside="Because of the current backend middleware, this page requires both the user token and the admin token."
    >
      <form
        className="mb-6 flex flex-col gap-3 md:flex-row"
        onSubmit={(event) => {
          event.preventDefault();
          setActiveCity(draftCity);
        }}
      >
        <input className="field-input flex-1" value={draftCity} onChange={(event) => setDraftCity(event.target.value)} />
        <button className="primary-button" type="submit">
          Load products
        </button>
      </form>
      {!hasDualSession ? (
        <EmptyState title="Dual session required" description="Login as both user and admin on the Journey page first." />
      ) : productsQuery.isLoading ? (
        <p className="text-sm text-stone-500">Loading products for {activeCity}...</p>
      ) : productsQuery.isError ? (
        <p className="text-sm text-rose-600">{productsQuery.error.message}</p>
      ) : products.length ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              editLinkState={(item) => ({ editProduct: item })}
              orderLinkState={(item) => ({ prefillProduct: item })}
            />
          ))}
        </div>
      ) : (
        <EmptyState title="No products found" description="Try another city or seed the demo data first." />
      )}
    </SectionCard>
  );
}
