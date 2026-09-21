import { createRoute, Link, notFound } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";
import { rootRoute } from "./__root";
import { formatINR } from "@/lib/products";
import { deliveryOptions, estimatedDelivery, getOrder, paymentLabel } from "@/lib/orders";

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: "/order/$orderId",
  loader: async ({ params }) => {
    const order = await getOrder(params.orderId);
    if (!order) throw notFound();
    return { order };
  },
  component: OrderConfirmationPage,
});

function OrderConfirmationPage() {
  const { order } = Route.useLoaderData();
  const { address } = order;
  const firstName = address.fullName.trim().split(/\s+/)[0];
  const speed = deliveryOptions.find((o) => o.id === order.delivery);
  const placedOn = new Date(order.createdAt).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <div className="text-center">
        <CheckCircle2 className="mx-auto size-12 text-green-600" />
        <h1 className="mt-4 font-display text-3xl">Thank you, {firstName}! Your order is confirmed.</h1>
        <p className="mt-3 text-muted-foreground">
          Order <span className="font-semibold text-foreground">{order.id}</span> · placed {placedOn}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          We'll send updates to {address.email} and {address.phone}.
        </p>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-5 text-sm">
          <p className="text-muted-foreground">Arrives by</p>
          <p className="mt-1 font-semibold">{estimatedDelivery(order.createdAt, order.delivery)}</p>
          <p className="text-xs text-muted-foreground">{speed?.label}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5 text-sm">
          <p className="text-muted-foreground">Payment</p>
          <p className="mt-1 font-semibold">{paymentLabel(order.payment)}</p>
          <p className="text-xs text-muted-foreground">
            {order.payment === "cod" ? `Pay ${formatINR(order.total)} on delivery` : "Paid online (demo)"}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5 text-sm">
          <p className="text-muted-foreground">Delivering to</p>
          <p className="mt-1 font-semibold">{address.fullName}</p>
          <p className="text-xs text-muted-foreground">
            {address.line1}
            {address.line2 && `, ${address.line2}`}, {address.city}, {address.state} {address.pincode}
          </p>
        </div>
      </div>

      <section className="mt-6 rounded-xl border border-border bg-card p-6">
        <h2 className="font-display text-xl">Items in this order</h2>
        <ul className="mt-5 space-y-4">
          {order.lines.map((l) => (
            <li key={l.id} className="flex gap-4 text-sm">
              {l.image && <img src={l.image} alt={l.name} className="size-16 rounded-md bg-secondary object-cover" />}
              <div className="flex-1">
                <p className="text-xs uppercase tracking-widest text-muted-foreground">{l.brand}</p>
                <p className="font-medium">{l.name}</p>
                <p className="text-xs text-muted-foreground">
                  Size {l.size} · for {l.wearer} · Qty {l.qty}
                </p>
              </div>
              <p className="font-medium">{formatINR(l.price * l.qty)}</p>
            </li>
          ))}
        </ul>
        <dl className="mt-5 space-y-2 border-t border-border pt-5 text-sm">
          <div className="flex justify-between"><dt className="text-muted-foreground">Subtotal</dt><dd>{formatINR(order.subtotal)}</dd></div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Delivery</dt>
            <dd>{order.deliveryFee === 0 ? "Free" : formatINR(order.deliveryFee)}</dd>
          </div>
          <div className="flex justify-between border-t border-border pt-3 text-base font-semibold">
            <dt>Total</dt><dd>{formatINR(order.total)}</dd>
          </div>
        </dl>
      </section>

      <div className="mt-8 text-center">
        <Link
          to="/"
          className="inline-flex rounded-md bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
        >
          Continue shopping
        </Link>
      </div>
    </div>
  );
}
