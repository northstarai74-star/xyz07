import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border bg-secondary/50">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
        <div>
          <p className="font-display text-lg uppercase tracking-[0.18em]">
            Ghar<span className="text-primary">&amp;</span>Co
          </p>
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">
            Everyday and festive clothing for the whole family, from ₹299 to ₹1,999 — one cart, one delivery.
          </p>
        </div>
        <div>
          <h2 className="text-sm font-semibold tracking-wide">Shop</h2>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/shop/$audience" params={{ audience: "women" }} className="hover:text-primary">Women</Link></li>
            <li><Link to="/shop/$audience" params={{ audience: "men" }} className="hover:text-primary">Men</Link></li>
            <li><Link to="/shop/$audience" params={{ audience: "kids" }} className="hover:text-primary">Kids</Link></li>
            <li><Link to="/shop/$audience" params={{ audience: "family" }} className="hover:text-primary">Family Sets</Link></li>
          </ul>
        </div>
        <div>
          <h2 className="text-sm font-semibold tracking-wide">Help</h2>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>Size &amp; fit guide</li>
            <li>Free size exchange in 15 days</li>
            <li>Track your order</li>
            <li>Cash on delivery available</li>
          </ul>
        </div>
        <div>
          <h2 className="text-sm font-semibold tracking-wide">Delivery</h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Ships across India. Free delivery on orders above ₹999. UPI, cards, net banking, wallets and COD.
          </p>
        </div>
      </div>
      <div className="border-t border-border/70 px-4 py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Ghar &amp; Co. Sample catalogue for a demo storefront.
      </div>
    </footer>
  );
}
