import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ShoppingBag, Search, Heart, User, LogOut, Package } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/lib/cart";
import { displayName, useAuth } from "@/lib/auth";

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
          <AccountMenu />
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

function AccountMenu() {
  const { user, loading, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: MouseEvent) {
      if (!menuRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  // Signed out (and while the saved session is still being read): a plain link,
  // so the header does not flicker between two different controls on load.
  if (loading || !user) {
    return (
      <Link
        to="/account"
        aria-label="Sign in"
        className="rounded-full p-2 text-foreground/80 transition-colors hover:bg-secondary hover:text-primary"
      >
        <User className="size-5" />
      </Link>
    );
  }

  async function handleSignOut() {
    setOpen(false);
    const { error } = await signOut();
    if (error) toast.error(error);
    else toast.success("Signed out. See you soon!");
  }

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Account menu for ${user.email}`}
        className="flex size-9 items-center justify-center rounded-full bg-secondary text-sm font-semibold uppercase text-foreground transition-colors hover:text-primary"
      >
        {user.email?.charAt(0) ?? <User className="size-5" />}
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-11 w-56 overflow-hidden rounded-lg border border-border bg-background py-1 shadow-lg"
        >
          <div className="border-b border-border px-4 py-3">
            <p className="text-sm font-medium">{displayName(user)}</p>
            <p className="truncate text-xs text-muted-foreground">{user.email}</p>
          </div>
          <Link
            to="/account"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors hover:bg-secondary"
          >
            <Package className="size-4" /> Your orders
          </Link>
          <button
            type="button"
            role="menuitem"
            onClick={handleSignOut}
            className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm transition-colors hover:bg-secondary"
          >
            <LogOut className="size-4" /> Sign out
          </button>
        </div>
      )}
    </div>
  );
}
