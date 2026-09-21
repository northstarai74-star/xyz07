import { createRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type ChangeEvent, type FormEvent, type InputHTMLAttributes } from "react";
import { Lock } from "lucide-react";
import { rootRoute } from "./__root";
import { useCart } from "@/lib/cart";
import { formatINR } from "@/lib/products";
import {
  COD_LIMIT,
  deliveryFee,
  deliveryOptions,
  estimatedDelivery,
  INDIAN_STATES,
  paymentOptions,
  saveOrder,
  type Address,
  type DeliverySpeed,
  type PaymentMethod,
} from "@/lib/orders";

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: "/checkout",
  component: CheckoutPage,
});

const emptyAddress: Address = {
  fullName: "",
  phone: "",
  email: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  pincode: "",
};

type Errors = Partial<Record<keyof Address, string>>;

function validate(a: Address): Errors {
  const errors: Errors = {};
  const digits = a.phone.replace(/\D/g, "");
  const mobile = digits.length === 12 && digits.startsWith("91") ? digits.slice(2) : digits;

  if (a.fullName.trim().length < 2) errors.fullName = "Enter the recipient's full name";
  if (!/^[6-9]\d{9}$/.test(mobile)) errors.phone = "Enter a valid 10-digit Indian mobile number";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(a.email.trim())) errors.email = "Enter a valid email address";
  if (a.line1.trim().length < 5) errors.line1 = "Enter your flat, house number and street";
  if (a.city.trim().length < 2) errors.city = "Enter your city";
  if (!a.state) errors.state = "Select your state";
  if (!/^[1-9]\d{5}$/.test(a.pincode.trim())) errors.pincode = "Enter a valid 6-digit pincode";
  return errors;
}

function CheckoutPage() {
  const { lines, subtotal, clear } = useCart();
  const navigate = useNavigate();
  const [address, setAddress] = useState<Address>(emptyAddress);
  const [errors, setErrors] = useState<Errors>({});
  const [delivery, setDelivery] = useState<DeliverySpeed>("standard");
  const [payment, setPayment] = useState<PaymentMethod>("upi");
  const [placing, setPlacing] = useState(false);

  const fee = deliveryFee(subtotal, delivery);
  const total = subtotal + fee;
  const codAvailable = total <= COD_LIMIT;
  const selectedPayment = payment === "cod" && !codAvailable ? "upi" : payment;

  if (lines.length === 0 && !placing) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="font-display text-3xl">Nothing to check out yet</h1>
        <p className="mt-3 text-muted-foreground">Add something to your family cart first.</p>
        <Link
          to="/"
          className="mt-8 inline-flex rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90"
        >
          Continue shopping
        </Link>
      </div>
    );
  }

  const update = (key: keyof Address) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setAddress((prev) => ({ ...prev, [key]: e.target.value }));
    if (errors[key]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  };

  async function placeOrder(e: FormEvent) {
    e.preventDefault();
    const found = validate(address);
    setErrors(found);
    const firstInvalid = Object.keys(found)[0];
    if (firstInvalid) {
      document.getElementById(`field-${firstInvalid}`)?.focus();
      return;
    }

    setPlacing(true);
    // Stand-in for the payment gateway round trip.
    await new Promise((resolve) => setTimeout(resolve, 900));
    const order = await saveOrder({
      lines,
      address,
      delivery,
      payment: selectedPayment,
      subtotal,
      deliveryFee: fee,
      total,
    });
    await navigate({ to: "/order/$orderId", params: { orderId: order.id } });
    clear();
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <nav className="mb-4 text-xs text-muted-foreground">
        <Link to="/cart" className="hover:text-primary">Cart</Link>
        <span className="px-2">/</span>
        <span className="text-foreground">Checkout</span>
      </nav>
      <h1 className="font-display text-3xl">Checkout</h1>

      <form
        id="checkout-form"
        onSubmit={placeOrder}
        noValidate
        className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]"
      >
        <div className="space-y-6">
          <section className="rounded-xl border border-border bg-card p-6">
            <h2 className="font-display text-xl">1. Delivery address</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Field id="fullName" label="Full name" autoComplete="name" value={address.fullName} onChange={update("fullName")} error={errors.fullName} className="sm:col-span-2" />
              <Field id="phone" label="Mobile number" type="tel" inputMode="tel" autoComplete="tel" placeholder="10-digit mobile number" value={address.phone} onChange={update("phone")} error={errors.phone} />
              <Field id="email" label="Email" type="email" autoComplete="email" placeholder="For your order updates" value={address.email} onChange={update("email")} error={errors.email} />
              <Field id="line1" label="Address" autoComplete="address-line1" placeholder="Flat, house no., building, street" value={address.line1} onChange={update("line1")} error={errors.line1} className="sm:col-span-2" />
              <Field id="line2" label="Area / landmark (optional)" autoComplete="address-line2" value={address.line2} onChange={update("line2")} className="sm:col-span-2" />
              <Field id="city" label="City" autoComplete="address-level2" value={address.city} onChange={update("city")} error={errors.city} />
              <div>
                <label htmlFor="field-state" className="text-sm font-medium">State</label>
                <select
                  id="field-state"
                  autoComplete="address-level1"
                  value={address.state}
                  onChange={update("state")}
                  aria-invalid={!!errors.state}
                  aria-describedby={errors.state ? "field-state-error" : undefined}
                  className={`mt-1.5 w-full rounded-md border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary ${errors.state ? "border-red-500" : "border-border"}`}
                >
                  <option value="">Select state</option>
                  {INDIAN_STATES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                {errors.state && <p id="field-state-error" className="mt-1 text-xs text-red-600">{errors.state}</p>}
              </div>
              <Field id="pincode" label="Pincode" inputMode="numeric" maxLength={6} autoComplete="postal-code" value={address.pincode} onChange={update("pincode")} error={errors.pincode} />
            </div>
          </section>

          <section className="rounded-xl border border-border bg-card p-6">
            <h2 className="font-display text-xl">2. Delivery speed</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {deliveryOptions.map((o) => {
                const optionFee = deliveryFee(subtotal, o.id);
                return (
                  <label
                    key={o.id}
                    className={`flex cursor-pointer gap-3 rounded-lg border p-4 text-sm ${delivery === o.id ? "border-primary ring-1 ring-primary" : "border-border"}`}
                  >
                    <input
                      type="radio"
                      name="delivery"
                      value={o.id}
                      checked={delivery === o.id}
                      onChange={() => setDelivery(o.id)}
                      className="mt-0.5 accent-primary"
                    />
                    <span className="flex-1">
                      <span className="flex justify-between font-medium">
                        {o.label}
                        <span>{optionFee === 0 ? "Free" : formatINR(optionFee)}</span>
                      </span>
                      <span className="mt-1 block text-xs text-muted-foreground">
                        {o.eta} · arrives by {estimatedDelivery(new Date(), o.id)}
                      </span>
                    </span>
                  </label>
                );
              })}
            </div>
            {subtotal <= 999 && (
              <p className="mt-3 text-xs text-muted-foreground">
                Add {formatINR(1000 - subtotal)} more for free standard delivery.
              </p>
            )}
          </section>

          <section className="rounded-xl border border-border bg-card p-6">
            <h2 className="font-display text-xl">3. Payment</h2>
            <div className="mt-5 space-y-3">
              {paymentOptions.map((o) => {
                const disabled = o.id === "cod" && !codAvailable;
                return (
                  <label
                    key={o.id}
                    className={`flex gap-3 rounded-lg border p-4 text-sm ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"} ${selectedPayment === o.id ? "border-primary ring-1 ring-primary" : "border-border"}`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={o.id}
                      checked={selectedPayment === o.id}
                      disabled={disabled}
                      onChange={() => setPayment(o.id)}
                      className="mt-0.5 accent-primary"
                    />
                    <span>
                      <span className="block font-medium">{o.label}</span>
                      <span className="mt-1 block text-xs text-muted-foreground">
                        {disabled ? `Available on orders up to ${formatINR(COD_LIMIT)}` : o.note}
                      </span>
                    </span>
                  </label>
                );
              })}
            </div>
            <p className="mt-4 rounded-md bg-secondary p-3 text-xs text-muted-foreground">
              Demo store: no money is taken. Once a payment gateway such as Razorpay or Stripe is
              connected, online payments open its secure page, so card and bank details never touch
              this site.
            </p>
          </section>
        </div>

        <aside className="h-fit rounded-xl border border-border bg-card p-6 lg:sticky lg:top-24">
          <h2 className="font-display text-xl">Order summary</h2>
          <ul className="mt-5 space-y-4">
            {lines.map((l) => (
              <li key={l.id} className="flex gap-3 text-sm">
                {l.image && <img src={l.image} alt={l.name} className="size-14 rounded-md bg-secondary object-cover" />}
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{l.name}</p>
                  <p className="text-xs text-muted-foreground">
                    Size {l.size} · for {l.wearer} · Qty {l.qty}
                  </p>
                </div>
                <p className="font-medium">{formatINR(l.price * l.qty)}</p>
              </li>
            ))}
          </ul>

          <dl className="mt-5 space-y-3 border-t border-border pt-5 text-sm">
            <div className="flex justify-between"><dt className="text-muted-foreground">Subtotal</dt><dd>{formatINR(subtotal)}</dd></div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Delivery</dt>
              <dd>{fee === 0 ? "Free" : formatINR(fee)}</dd>
            </div>
            <div className="flex justify-between border-t border-border pt-3 text-base font-semibold">
              <dt>Total</dt><dd>{formatINR(total)}</dd>
            </div>
          </dl>
          <p className="mt-3 text-xs text-muted-foreground">
            Arrives by {estimatedDelivery(new Date(), delivery)} · free size exchange in 15 days
          </p>

          <button
            type="submit"
            form="checkout-form"
            disabled={placing}
            className="mt-6 w-full rounded-md bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-wait disabled:opacity-60"
          >
            {placing
              ? "Placing your order…"
              : selectedPayment === "cod"
                ? `Place order · ${formatINR(total)}`
                : `Pay ${formatINR(total)}`}
          </button>
          <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
            <Lock className="size-3.5" /> Secure checkout
          </p>
        </aside>
      </form>
    </div>
  );
}

function Field({
  id,
  label,
  error,
  className = "",
  ...props
}: { id: keyof Address; label: string; error?: string; className?: string } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className={className}>
      <label htmlFor={`field-${id}`} className="text-sm font-medium">{label}</label>
      <input
        id={`field-${id}`}
        name={id}
        aria-invalid={!!error}
        aria-describedby={error ? `field-${id}-error` : undefined}
        className={`mt-1.5 w-full rounded-md border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary ${error ? "border-red-500" : "border-border"}`}
        {...props}
      />
      {error && <p id={`field-${id}-error`} className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
