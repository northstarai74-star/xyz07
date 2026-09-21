import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { Star, Truck, RefreshCcw, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { ProductCard } from "@/components/product-card";
import { useCart } from "@/lib/cart";
import { formatINR, getProduct, products } from "@/lib/products";

export const Route = createFileRoute("/product/$productId")({
  loader: ({ params }) => {
    const product = getProduct(params.productId);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => {
    const p = loaderData?.product;
    const title = p ? `${p.name} by ${p.brand} | Ghar & Co` : "Product | Ghar & Co";
    const description = p
      ? `${p.description} ${formatINR(p.price)}. Free size exchange within 15 days.`
      : "Shop family fashion at Ghar & Co.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "product" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: ProductPage,
});

const wearers = ["Me", "Partner", "Son", "Daughter"];

function ProductPage() {
  const { product } = Route.useLoaderData();
  const { add } = useCart();
  const [size, setSize] = useState(product.sizes[0] ?? "Free size");
  const [color, setColor] = useState(product.colors[0] ?? "As shown");
  const [wearer, setWearer] = useState(wearers[0] ?? "Me");

  const off = Math.round(((product.mrp - product.price) / product.mrp) * 100);
  const similar = products.filter((p) => p.audience === product.audience && p.id !== product.id).slice(0, 3);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <nav className="mb-6 text-xs text-muted-foreground">
        <Link to="/" className="hover:text-primary">Home</Link>
        <span className="px-2">/</span>
        <Link to="/shop/$audience" params={{ audience: product.audience }} className="hover:text-primary capitalize">
          {product.audience}
        </Link>
        <span className="px-2">/</span>
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        <div className="overflow-hidden rounded-xl border border-border bg-secondary">
          <img src={product.image} alt={product.name} className="w-full object-cover" />
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{product.brand}</p>
          <h1 className="mt-2 font-display text-3xl leading-snug">{product.name}</h1>

          <p className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-1 rounded-full bg-secondary px-2 py-1 text-foreground">
              <Star className="size-3.5 fill-primary text-primary" />
              {product.rating}
            </span>
            {product.reviews} verified reviews
          </p>

          <div className="mt-5 flex items-baseline gap-3">
            <span className="text-3xl font-semibold">{formatINR(product.price)}</span>
            <span className="text-muted-foreground line-through">{formatINR(product.mrp)}</span>
            <span className="font-medium text-primary">{off}% off</span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Inclusive of all taxes</p>

          <p className="mt-6 text-sm leading-relaxed text-muted-foreground">{product.description}</p>

          <div className="mt-7">
            <h2 className="text-sm font-semibold">Colour</h2>
            <div className="mt-2 flex flex-wrap gap-2">
              {product.colors.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`rounded-full border px-3 py-1.5 text-xs ${
                    color === c ? "border-primary bg-primary text-primary-foreground" : "border-border"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold">Size</h2>
              <button
                type="button"
                onClick={() => toast("Size chart", { description: "Measurements in inches, model wears size M." })}
                className="text-xs text-primary underline-offset-4 hover:underline"
              >
                Size chart
              </button>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`min-w-14 rounded-md border px-3 py-2 text-sm ${
                    size === s ? "border-primary bg-primary text-primary-foreground" : "border-border"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <h2 className="text-sm font-semibold">Who is this for?</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Tag the family member so one order stays easy to sort at home.
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {wearers.map((w) => (
                <button
                  key={w}
                  onClick={() => setWearer(w)}
                  className={`rounded-full border px-3 py-1.5 text-xs ${
                    wearer === w ? "border-primary bg-primary text-primary-foreground" : "border-border"
                  }`}
                >
                  {w}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => {
              add({
                productId: product.id,
                name: product.name,
                brand: product.brand,
                size,
                price: product.price,
                image: product.image,
                wearer,
              });
              toast.success("Added to your family cart", {
                description: `${product.name} · ${size} · for ${wearer}`,
              });
            }}
            className="mt-8 w-full rounded-md bg-primary px-6 py-3.5 text-sm font-semibold tracking-wide text-primary-foreground transition-opacity hover:opacity-90"
          >
            Add to family cart
          </button>

          <dl className="mt-8 grid gap-4 rounded-xl border border-border bg-card p-5 text-sm sm:grid-cols-2">
            <div><dt className="text-muted-foreground">Fabric</dt><dd className="font-medium">{product.fabric}</dd></div>
            <div><dt className="text-muted-foreground">Occasion</dt><dd className="font-medium">{product.occasion}</dd></div>
            <div><dt className="text-muted-foreground">Wash care</dt><dd className="font-medium">Gentle machine wash, cold</dd></div>
            <div><dt className="text-muted-foreground">Delivery</dt><dd className="font-medium">3-5 days across India</dd></div>
          </dl>

          <ul className="mt-5 grid gap-3 text-sm text-muted-foreground sm:grid-cols-3">
            <li className="flex items-center gap-2"><Truck className="size-4 text-primary" /> Cash on delivery</li>
            <li className="flex items-center gap-2"><RefreshCcw className="size-4 text-primary" /> Free size exchange</li>
            <li className="flex items-center gap-2"><ShieldCheck className="size-4 text-primary" /> 15-day returns</li>
          </ul>
        </div>
      </div>

      {similar.length > 0 && (
        <section className="mt-20">
          <h2 className="font-display text-2xl">You may also like</h2>
          <div className="mt-6 grid grid-cols-2 gap-5 lg:grid-cols-3">
            {similar.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
