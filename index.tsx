import { createFileRoute, Link } from "@tanstack/react-router";
import { Sparkles, Truck, RefreshCcw, Wallet } from "lucide-react";
import heroImg from "@/assets/hero-family.jpg";
import menImg from "@/assets/cat-men.jpg";
import womenImg from "@/assets/cat-women.jpg";
import kidsImg from "@/assets/cat-kids.jpg";
import matchingImg from "@/assets/matching-sets.jpg";
import { ProductCard } from "@/components/product-card";
import { products } from "@/lib/products";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ghar & Co | Family Fashion for Men, Women & Kids" },
      {
        name: "description",
        content:
          "Everyday and festive clothing for men, women and kids from ₹299. Matching family sets, free size exchange, cash on delivery across India.",
      },
      { property: "og:title", content: "Ghar & Co | Family Fashion for Men, Women & Kids" },
      {
        property: "og:description",
        content: "One cart for the whole family: everyday and festive clothing from ₹299.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

const categories = [
  {
    audience: "women" as const,
    label: "Women",
    img: womenImg,
    note: "Kurta sets, dresses, tailoring",
  },
  { audience: "men" as const, label: "Men", img: menImg, note: "Kurtas, shirts, denim" },
  { audience: "kids" as const, label: "Kids", img: kidsImg, note: "Boys, girls, infants" },
] as const;

const occasions = ["Casual", "Office", "Festive", "Wedding", "Party", "School"];

const reviews = [
  {
    name: "Priyanka, Pune",
    text: "Ordered Diwali outfits for all four of us in one go. Everything arrived together and the sizes were right.",
  },
  {
    name: "Rahul, Jaipur",
    text: "The size exchange was genuinely free. Swapped my kurta from M to L in three days.",
  },
  {
    name: "Fatima, Hyderabad",
    text: "Kids' clothes are soft and hold up after washing. Prices are sensible for how often they outgrow things.",
  },
];

function Home() {
  const trending = products.filter((p) => p.rating >= 4.3).slice(0, 6);
  const familySets = products.filter((p) => p.audience === "family").slice(0, 4);

  return (
    <div>
      {/* Hero */}
      <section className="relative">
        <div className="relative h-[520px] w-full overflow-hidden md:h-[620px]">
          <img
            src={heroImg}
            alt="A family of four in coordinated festive ethnic wear"
            width={1920}
            height={1088}
            className="size-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ink/80 via-ink/40 to-transparent" />
          <div className="absolute inset-0 flex items-center">
            <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
              <div className="max-w-xl text-ink-foreground">
                <p className="text-xs uppercase tracking-[0.3em] text-accent">
                  New season collection
                </p>
                <h1 className="mt-4 font-display text-4xl leading-tight sm:text-5xl md:text-6xl">
                  Dress the whole family in one order
                </h1>
                <p className="mt-5 text-base text-ink-foreground/85">
                  Everyday and festive clothing for men, women and kids — from ₹299 to ₹1,999, with
                  matching sets when the occasion calls for it.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    to="/shop/$audience"
                    params={{ audience: "family" }}
                    className="rounded-md bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                  >
                    Shop family sets
                  </Link>
                  <Link
                    to="/shop/$audience"
                    params={{ audience: "women" }}
                    className="rounded-md border border-ink-foreground/40 px-7 py-3.5 text-sm font-semibold text-ink-foreground transition-colors hover:bg-ink-foreground/10"
                  >
                    Shop new arrivals
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <ul className="mx-auto grid max-w-7xl gap-4 px-4 py-6 text-sm text-muted-foreground sm:grid-cols-4 sm:px-6">
          <li className="flex items-center gap-2">
            <Truck className="size-4 text-primary" /> Free delivery above ₹999
          </li>
          <li className="flex items-center gap-2">
            <RefreshCcw className="size-4 text-primary" /> Free size exchange in 15 days
          </li>
          <li className="flex items-center gap-2">
            <Wallet className="size-4 text-primary" /> Cash on delivery
          </li>
          <li className="flex items-center gap-2">
            <Sparkles className="size-4 text-primary" /> Matching sets for four
          </li>
        </ul>
      </section>

      {/* Shop by category */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <h2 className="font-display text-3xl">Shop by category</h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-3">
          {categories.map((c) => (
            <Link
              key={c.audience}
              to="/shop/$audience"
              params={{ audience: c.audience }}
              className="group relative overflow-hidden rounded-xl"
            >
              <img
                src={c.img}
                alt={c.label}
                loading="lazy"
                width={912}
                height={1200}
                className="aspect-[3/4] w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/75 to-transparent" />
              <div className="absolute bottom-0 p-6 text-ink-foreground">
                <h3 className="font-display text-2xl">{c.label}</h3>
                <p className="text-sm text-ink-foreground/80">{c.note}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Family sets feature */}
      <section className="bg-secondary/60 py-16">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2">
          <img
            src={matchingImg}
            alt="Matching block print kurta sets for a family of four laid out on linen"
            loading="lazy"
            width={1408}
            height={912}
            className="rounded-xl object-cover"
          />
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-primary">The family edit</p>
            <h2 className="mt-4 font-display text-3xl leading-snug sm:text-4xl">
              One print. Four outfits. One delivery.
            </h2>
            <p className="mt-4 text-muted-foreground">
              Pick a festive palette and we size it for everyone at home — him, her, and the kids.
              No more chasing four separate orders before a wedding or Diwali.
            </p>
            <Link
              to="/shop/$audience"
              params={{ audience: "family" }}
              className="mt-7 inline-flex rounded-md bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
            >
              Explore family sets
            </Link>
            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {familySets.map((p) => (
                <Link
                  key={p.id}
                  to="/product/$productId"
                  params={{ productId: p.id }}
                  className="text-xs text-muted-foreground hover:text-primary"
                >
                  {p.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trending */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="flex items-end justify-between">
          <h2 className="font-display text-3xl">Trending now</h2>
          <Link
            to="/shop/$audience"
            params={{ audience: "women" }}
            className="text-sm text-primary hover:underline"
          >
            View all
          </Link>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-5 lg:grid-cols-3">
          {trending.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Occasions */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
        <h2 className="font-display text-3xl">Shop by occasion</h2>
        <div className="mt-6 flex flex-wrap gap-3">
          {occasions.map((o) => (
            <Link
              key={o}
              to="/shop/$audience"
              params={{ audience: "women" }}
              className="rounded-full border border-border bg-card px-5 py-2.5 text-sm transition-colors hover:border-primary hover:text-primary"
            >
              {o}
            </Link>
          ))}
        </div>
      </section>

      {/* Reviews */}
      <section className="bg-secondary/60 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h2 className="font-display text-3xl">What families say</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {reviews.map((r) => (
              <blockquote key={r.name} className="rounded-xl border border-border bg-card p-6">
                <p className="text-sm leading-relaxed text-muted-foreground">“{r.text}”</p>
                <footer className="mt-4 text-xs font-medium uppercase tracking-widest">
                  {r.name}
                </footer>
              </blockquote>
            ))}
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            Sample reviews written for this demo — replace them with real customer feedback before
            launch.
          </p>
        </div>
      </section>
    </div>
  );
}
