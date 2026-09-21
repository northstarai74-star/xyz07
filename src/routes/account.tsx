import { createRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent, type InputHTMLAttributes } from "react";
import { LogOut, MailCheck, Package } from "lucide-react";
import { toast } from "sonner";
import { rootRoute } from "./__root";
import { displayName, useAuth } from "@/lib/auth";
import { formatINR } from "@/lib/products";
import { estimatedDelivery, listMyOrders, paymentLabel, type Order } from "@/lib/orders";

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: "/account",
  component: AccountPage,
});

function AccountPage() {
  const { user, loading, configured } = useAuth();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      {loading ? (
        <p className="py-16 text-center text-sm text-muted-foreground">Checking your session…</p>
      ) : !configured ? (
        <NotConfigured />
      ) : user ? (
        <SignedIn />
      ) : (
        <AuthForm />
      )}
    </div>
  );
}

function NotConfigured() {
  return (
    <div className="rounded-xl border border-border bg-card p-6 text-center">
      <h1 className="font-display text-2xl">Accounts aren't switched on</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        This copy of the site has no Supabase connection. Add <code>VITE_SUPABASE_URL</code> and{" "}
        <code>VITE_SUPABASE_ANON_KEY</code> to a <code>.env</code> file and restart the dev server.
      </p>
    </div>
  );
}

function SignedIn() {
  const { user, signOut } = useAuth();
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    let active = true;
    listMyOrders().then((rows) => {
      if (active) setOrders(rows);
    });
    return () => {
      active = false;
    };
  }, [user?.id]);

  async function handleSignOut() {
    setLeaving(true);
    const { error } = await signOut();
    setLeaving(false);
    if (error) toast.error(error);
    else toast.success("Signed out. See you soon!");
  }

  return (
    <>
      <div className="flex flex-wrap items-center gap-4 rounded-xl border border-border bg-card p-6">
        <div className="flex size-12 items-center justify-center rounded-full bg-secondary font-display text-lg uppercase">
          {user!.email?.charAt(0) ?? "?"}
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="font-display text-2xl">Hello, {displayName(user!)}</h1>
          <p className="truncate text-sm text-muted-foreground">{user!.email}</p>
        </div>
        <button
          type="button"
          onClick={handleSignOut}
          disabled={leaving}
          className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-secondary disabled:opacity-60"
        >
          <LogOut className="size-4" />
          {leaving ? "Signing out…" : "Sign out"}
        </button>
      </div>

      <section className="mt-6 rounded-xl border border-border bg-card p-6">
        <h2 className="font-display text-xl">Your orders</h2>

        {orders === null ? (
          <p className="mt-5 text-sm text-muted-foreground">Loading your orders…</p>
        ) : orders.length === 0 ? (
          <div className="mt-5 text-center">
            <Package className="mx-auto size-10 text-muted-foreground" />
            <p className="mt-3 text-sm text-muted-foreground">
              No orders yet. Anything you buy while signed in will show up here.
            </p>
            <Link
              to="/"
              className="mt-6 inline-flex rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90"
            >
              Start shopping
            </Link>
          </div>
        ) : (
          <ul className="mt-5 divide-y divide-border">
            {orders.map((o) => (
              <li key={o.id} className="flex flex-wrap items-center gap-4 py-4 first:pt-0 last:pb-0">
                <div className="flex -space-x-3">
                  {o.lines.slice(0, 3).map(
                    (l) =>
                      l.image && (
                        <img
                          key={l.id}
                          src={l.image}
                          alt={l.name}
                          className="size-12 rounded-md border-2 border-card bg-secondary object-cover"
                        />
                      ),
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{o.id}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(o.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}{" "}
                    · {o.lines.length} item{o.lines.length > 1 ? "s" : ""} · {paymentLabel(o.payment)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Arrives by {estimatedDelivery(o.createdAt, o.delivery)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{formatINR(o.total)}</p>
                  <Link
                    to="/order/$orderId"
                    params={{ orderId: o.id }}
                    className="text-xs text-primary hover:underline"
                  >
                    View details
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}

function AuthForm() {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [sentTo, setSentTo] = useState<string | null>(null);

  function switchTo(next: "signin" | "signup") {
    setMode(next);
    setError(null);
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Enter a valid email address");
      return;
    }
    if (password.length < 6) {
      setError("Your password needs at least 6 characters");
      return;
    }

    setBusy(true);
    if (mode === "signin") {
      const { error: err } = await signIn(email, password);
      setBusy(false);
      if (err) setError(err);
      else toast.success("Signed in");
      return;
    }

    const { error: err, needsConfirmation } = await signUp(email, password);
    setBusy(false);
    if (err) setError(err);
    else if (needsConfirmation) setSentTo(email.trim());
    else toast.success("Account created");
  }

  if (sentTo) {
    return (
      <div className="rounded-xl border border-border bg-card p-8 text-center">
        <MailCheck className="mx-auto size-10 text-green-600" />
        <h1 className="mt-4 font-display text-2xl">Confirm your email</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          We've sent a confirmation link to <span className="font-medium text-foreground">{sentTo}</span>.
          Open it and you'll be signed in.
        </p>
        <button
          type="button"
          onClick={() => {
            setSentTo(null);
            switchTo("signin");
          }}
          className="mt-6 text-sm text-primary hover:underline"
        >
          Back to sign in
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md">
      <h1 className="text-center font-display text-3xl">
        {mode === "signin" ? "Welcome back" : "Create your account"}
      </h1>
      <p className="mt-2 text-center text-sm text-muted-foreground">
        {mode === "signin"
          ? "Sign in to see your orders and check out faster."
          : "Keep your orders and addresses in one place."}
      </p>

      <div className="mt-8 rounded-xl border border-border bg-card p-6">
        <div className="mb-6 grid grid-cols-2 gap-1 rounded-lg bg-secondary p-1 text-sm font-medium">
          {(["signin", "signup"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => switchTo(m)}
              // #f5f5f5 against #fff is too faint on its own, so the selected
              // tab also carries the border and the darker text.
              className={`rounded-md border py-2 transition-colors ${
                mode === m
                  ? "border-border bg-background text-foreground shadow-sm"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {m === "signin" ? "Sign in" : "Create account"}
            </button>
          ))}
        </div>

        <form onSubmit={submit} noValidate className="space-y-4">
          <Field
            id="email"
            label="Email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Field
            id="password"
            label="Password"
            type="password"
            autoComplete={mode === "signin" ? "current-password" : "new-password"}
            placeholder={mode === "signup" ? "At least 6 characters" : undefined}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && (
            <p role="alert" className="rounded-md bg-red-50 p-3 text-xs text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-wait disabled:opacity-60"
          >
            {busy ? "Just a moment…" : mode === "signin" ? "Sign in" : "Create account"}
          </button>
        </form>
      </div>

      <p className="mt-5 text-center text-xs text-muted-foreground">
        You don't need an account to shop —{" "}
        <Link to="/cart" className="text-primary hover:underline">
          checking out as a guest
        </Link>{" "}
        works too.
      </p>
    </div>
  );
}

function Field({
  id,
  label,
  ...props
}: { id: string; label: string } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label htmlFor={`field-${id}`} className="text-sm font-medium">
        {label}
      </label>
      <input
        id={`field-${id}`}
        name={id}
        required
        className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
        {...props}
      />
    </div>
  );
}
