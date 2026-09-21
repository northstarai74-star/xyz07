import { Link } from "@tanstack/react-router";
import { ShoppingBag, Search, Heart } from "lucide-react";
import { useCart } from "@/lib/cart";

const nav = [
  { audience: "women", label: "Women" },
  { audience: "men", label: "Men" },
  { audience: "kids", label: "Kids" },
  { audience: "family", label: "Family Sets" },
] as const;

export function SiteHeader() {
  const { count } = useCart();

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-4 sm:px-6">
        <Link to="/" className="font-display text-xl tracking-[0.18em] text-foreground uppercase">
          Ghar<span className="text-primary">&amp;</span>Co
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {nav.map((n) => (
            <Link
              key={n.audience}
              to="/shop/$audience"
              params={{ audience: n.audience }}
              className="text-sm font-medium tracking-wide text-muted-foreground transition-colors hover:text-primary"
              activeProps={{ className: "text-primary" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1">
          <button
            type="button"
            aria-label="Search"
            className="rounded-full p-2 text-foreground/80 transition-colors hover:bg-secondary hover:text-primary"
          >
            <Search className="size-5" />
          </button>
          <button
            type="button"
            aria-label="Wishlist"
            className="rounded-full p-2 text-foreground/80 transition-colors hover:bg-secondary hover:text-primary"
          >
            <Heart className="size-5" />
          </button>
          <Link
            to="/cart"
            aria-label="Cart"
            className="relative rounded-full p-2 text-foreground/80 transition-colors hover:bg-secondary hover:text-primary"
          >
            <ShoppingBag className="size-5" />
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex size-5 items-center justify-center rounded-full bg-primary text-[11px] font-semibold text-primary-foreground">
                {count}
              </span>
            )}
          </Link>
        </div>
      </div>

      <div className="flex items-center justify-center gap-4 overflow-x-auto border-t border-border/60 px-4 py-2 md:hidden">
        {nav.map((n) => (
          <Link
            key={n.audience}
            to="/shop/$audience"
            params={{ audience: n.audience }}
            className="whitespace-nowrap text-sm text-muted-foreground"
            activeProps={{ className: "text-primary" }}
          >
            {n.label}
          </Link>
        ))}
      </div>
    </header>
  );
}
