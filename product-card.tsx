import { Link } from "@tanstack/react-router";
import { Star } from "lucide-react";
import { formatINR, type Product } from "@/lib/products";

export function ProductCard({ product }: { product: Product }) {
  const off = Math.round(((product.mrp - product.price) / product.mrp) * 100);

  return (
    <Link
      to="/product/$productId"
      params={{ productId: product.id }}
      className="group block overflow-hidden rounded-xl border border-border/70 bg-card transition-shadow hover:shadow-[var(--shadow-soft)]"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-secondary">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-full bg-accent px-2.5 py-1 text-[11px] font-semibold text-accent-foreground">
          {off}% off
        </span>
      </div>
      <div className="space-y-1 p-4">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">{product.brand}</p>
        <h3 className="truncate text-sm font-medium text-foreground">{product.name}</h3>
        <div className="flex items-baseline gap-2">
          <span className="text-base font-semibold">{formatINR(product.price)}</span>
          <span className="text-xs text-muted-foreground line-through">{formatINR(product.mrp)}</span>
        </div>
        <p className="flex items-center gap-1 text-xs text-muted-foreground">
          <Star className="size-3.5 fill-primary text-primary" />
          {product.rating} · {product.reviews} reviews
        </p>
      </div>
    </Link>
  );
}
