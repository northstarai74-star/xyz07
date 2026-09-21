import { createRoute, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { rootRoute } from "./__root";
import { ProductCard } from "@/components/product-card";
import { audienceMeta, byAudience, getProduct, type Audience, type Product } from "@/lib/products";

/** Separate pieces cut to match, shown while a section has nothing of its own. */
const matchingPair = ["w9", "k8"].map(getProduct).filter((p): p is Product => !!p);

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: "/shop/$audience",
  loader: ({ params }) => {
    if (!(params.audience in audienceMeta)) throw notFound();
    return { audience: params.audience as Audience };
  },
  component: ShopPage,
});

function ShopPage() {
  const { audience } = Route.useLoaderData();
  const meta = audienceMeta[audience];
  const all = byAudience(audience);
  const available = Array.from(new Set(all.map((p) => p.occasion)));
  const [occasion, setOccasion] = useState<string | null>(null);
  const shown = occasion ? all.filter((p) => p.occasion === occasion) : all;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-4xl">{meta.label}</h1>
      <p className="mt-2 text-muted-foreground">{meta.blurb}</p>

      {all.length === 0 ? (
        <section className="mt-10 rounded-xl border border-border bg-card p-6 sm:p-8">
          <h2 className="font-display text-2xl">New sets are on the way</h2>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
            Until they land, these pieces are cut to match — the same bottle green and gold crest
            buttons, sized for her and for her daughter.
          </p>
          <div className="mt-6 grid grid-cols-2 gap-5 lg:grid-cols-3">
            {matchingPair.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      ) : (
        <>
          <div className="mt-6 flex flex-wrap gap-2">
            {[null, ...available].map((o) => (
              <button
                key={o ?? "all"}
                onClick={() => setOccasion(o)}
                className={`rounded-full border px-4 py-2 text-sm ${
                  occasion === o ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card"
                }`}
              >
                {o ?? "All"}
              </button>
            ))}
          </div>

          <div className="mt-8 grid grid-cols-2 gap-5 lg:grid-cols-3">
            {shown.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
