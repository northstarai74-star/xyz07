import type { CartLine } from "./cart";
import { supabase } from "./supabase";

export type DeliverySpeed = "standard" | "express";
export type PaymentMethod = "upi" | "card" | "netbanking" | "wallet" | "cod";

export type Address = {
  fullName: string;
  phone: string;
  email: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  pincode: string;
};

export type Order = {
  id: string;
  createdAt: string;
  /** The account that placed it, or null for a guest checkout. */
  customerId: string | null;
  lines: CartLine[];
  address: Address;
  delivery: DeliverySpeed;
  payment: PaymentMethod;
  subtotal: number;
  deliveryFee: number;
  total: number;
};

export const FREE_DELIVERY_ABOVE = 999;
export const COD_LIMIT = 10000;

export const deliveryOptions: { id: DeliverySpeed; label: string; eta: string; businessDays: number }[] = [
  { id: "standard", label: "Standard delivery", eta: "3-5 business days", businessDays: 5 },
  { id: "express", label: "Express delivery", eta: "1-2 business days", businessDays: 2 },
];

export const paymentOptions: { id: PaymentMethod; label: string; note: string }[] = [
  { id: "upi", label: "UPI", note: "Google Pay, PhonePe, Paytm or any UPI app" },
  { id: "card", label: "Credit / debit card", note: "Visa, Mastercard, RuPay and Amex" },
  { id: "netbanking", label: "Net banking", note: "All major Indian banks" },
  { id: "wallet", label: "Wallets", note: "Paytm, Amazon Pay, MobiKwik" },
  { id: "cod", label: "Cash on delivery", note: "Pay in cash or UPI when your order arrives" },
];

export const INDIAN_STATES = [
  "Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chandigarh",
  "Chhattisgarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Goa", "Gujarat", "Haryana",
  "Himachal Pradesh", "Jammu and Kashmir", "Jharkhand", "Karnataka", "Kerala", "Ladakh", "Lakshadweep",
  "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Puducherry",
  "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand",
  "West Bengal",
];

export function deliveryFee(subtotal: number, speed: DeliverySpeed) {
  if (speed === "express") return 149;
  return subtotal > FREE_DELIVERY_ABOVE ? 0 : 79;
}

/** Latest arrival date, counting Monday to Saturday as delivery days. */
export function estimatedDelivery(from: Date | string, speed: DeliverySpeed) {
  const days = deliveryOptions.find((o) => o.id === speed)?.businessDays ?? 5;
  const date = new Date(from);
  let added = 0;
  while (added < days) {
    date.setDate(date.getDate() + 1);
    if (date.getDay() !== 0) added++;
  }
  return date.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
}

export function paymentLabel(method: PaymentMethod) {
  return paymentOptions.find((o) => o.id === method)?.label ?? method;
}

const STORAGE_KEY = "ghar-co-orders";

function loadOrders(): Record<string, Order> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Record<string, Order>) : {};
  } catch {
    return {};
  }
}

function cacheOrder(order: Order) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...loadOrders(), [order.id]: order }));
  } catch {
    // Storage unavailable; the confirmation page will not be able to reload this order.
  }
}

/** Table columns are snake_case; the app type is camelCase. */
type OrderRow = {
  id: string;
  created_at: string;
  customer_id: string | null;
  lines: CartLine[];
  address: Address;
  delivery: DeliverySpeed;
  payment: PaymentMethod;
  subtotal: number;
  delivery_fee: number;
  total: number;
};

function toRow(order: Order): OrderRow {
  const { createdAt, customerId, deliveryFee: fee, ...rest } = order;
  return { ...rest, created_at: createdAt, customer_id: customerId, delivery_fee: fee };
}

function fromRow(row: OrderRow): Order {
  const { created_at, customer_id, delivery_fee, ...rest } = row;
  return { ...rest, createdAt: created_at, customerId: customer_id, deliveryFee: delivery_fee };
}

/** The signed-in user, read from the local session — no network round trip. */
async function currentUserId(): Promise<string | null> {
  if (!supabase) return null;
  const { data } = await supabase.auth.getSession();
  return data.session?.user.id ?? null;
}

/**
 * Writes to Supabase when configured, and always caches locally so the
 * confirmation page still renders if the insert fails.
 */
export async function saveOrder(
  details: Omit<Order, "id" | "createdAt" | "customerId">,
): Promise<Order> {
  const order: Order = {
    ...details,
    id: "GC" + Date.now().toString(36).toUpperCase(),
    createdAt: new Date().toISOString(),
    // Stamped here rather than passed in, so a guest checkout stays a guest
    // order and a signed-in one shows up under their account automatically.
    customerId: await currentUserId(),
  };

  cacheOrder(order);

  if (supabase) {
    const { error } = await supabase.from("orders").insert(toRow(order));
    if (error) console.error("Could not save order to Supabase:", error.message);
  }

  return order;
}

export async function getOrder(id: string): Promise<Order | undefined> {
  const cached = loadOrders()[id];
  if (cached) return cached;

  if (supabase) {
    const { data, error } = await supabase.from("orders").select("*").eq("id", id).maybeSingle();
    if (error) console.error("Could not load order from Supabase:", error.message);
    if (data) return fromRow(data as OrderRow);
  }

  return undefined;
}

/**
 * Every order placed while signed in, newest first. Row-level security scopes
 * this to the caller's own orders, so no user filter is needed here.
 */
export async function listMyOrders(): Promise<Order[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Could not load your orders from Supabase:", error.message);
    return [];
  }
  return (data as OrderRow[]).map(fromRow);
}
