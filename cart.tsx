import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { useCart } from "@/lib/cart";
import { formatINR } from "@/lib/products";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your Family Cart | Ghar & Co" },
      {
        name: "description",
        content:
          "Review your family cart at Ghar & Co: clothes for men, women and kids in one order, with COD and free size exchange.",
      },
      { property: "og:title", content: "Your Family Cart | Ghar & Co" },
      {
        property: "og:description",
        content: "One cart for the whole family, with cash on delivery and free size exchange.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { lines, setQty, remove, subtotal } = useCart();
  const shipping = subtotal > 999 || subtotal === 0 ? 0 : 79;

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="font-display text-3xl">Your family cart is empty</h1>
        <p className="mt-3 text-muted-foreground">
          Start with a matching set, or shop each family member separately.
        </p>
        <Link
          to="/shop/$audience"
          params={{ audience: "family" }}
          className="mt-8 inline-flex rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90"
        >
          Shop family sets
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl">Your family cart</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {lines.length} item{lines.length > 1 ? "s" : ""} · one delivery for the whole family
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
        <ul className="space-y-4">
          {lines.map((l) => (
            <li key={l.id} className="flex gap-4 rounded-xl border border-border bg-card p-4">
              <img src={l.image} alt={l.name} loading="lazy" className="size-24 rounded-md object-cover" />
              <div className="flex-1">
                <p className="text-xs uppercase tracking-widest text-muted-foreground">{l.brand}</p>
                <h2 className="text-sm font-medium">{l.name}</h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  Size {l.size} · for {l.wearer}
                </p>
                <div className="mt-3 flex items-center gap-3">
                  <div className="flex items-center rounded-md border border-border">
                    <button onClick={() => setQty(l.id, l.qty - 1)} className="px-3 py-1 text-sm" aria-label="Decrease quantity">–</button>
                    <span className="min-w-8 text-center text-sm">{l.qty}</span>
                    <button onClick={() => setQty(l.id, l.qty + 1)} className="px-3 py-1 text-sm" aria-label="Increase quantity">+</button>
                  </div>
                  <button onClick={() => remove(l.id)} className="text-xs text-muted-foreground hover:text-destructive">
                    Remove
                  </button>
                </div>
              </div>
              <p className="text-sm font-semibold">{formatINR(l.price * l.qty)}</p>
            </li>
          ))}
        </ul>

        <aside className="h-fit rounded-xl border border-border bg-card p-6">
          <h2 className="font-display text-xl">Order summary</h2>
          <dl className="mt-5 space-y-3 text-sm">
            <div className="flex justify-between"><dt className="text-muted-foreground">Subtotal</dt><dd>{formatINR(subtotal)}</dd></div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Delivery</dt>
              <dd>{shipping === 0 ? "Free" : formatINR(shipping)}</dd>
            </div>
            <div className="flex justify-between border-t border-border pt-3 text-base font-semibold">
              <dt>Total</dt><dd>{formatINR(subtotal + shipping)}</dd>
            </div>
          </dl>
          <button
            onClick={() =>
              toast("Checkout coming next", {
                description: "Payments (UPI, cards, COD) can be switched on when you're ready.",
              })
            }
            className="mt-6 w-full rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90"
          >
            Proceed to checkout
          </button>
          <p className="mt-3 text-center text-xs text-muted-foreground">UPI · Cards · Net banking · Wallets · COD</p>
        </aside>
      </div>
    </div>
  );
}
