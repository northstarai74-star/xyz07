import { createRoute, Link } from "@tanstack/react-router";
import { rootRoute } from "./__root";
import { ArrowRight, Sparkles, Truck, RefreshCcw, Wallet } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { products } from "@/lib/products";
import blazerIvory from "@/assets/blazer-ivory.png";
import trousersBlack from "@/assets/trousers-black.png";
import shirtWhite from "@/assets/shirt-white.png";
import shirtBlack from "@/assets/shirt-black.png";
import kidsSetCocoa from "@/assets/kids-set-cocoa.png";
import kidsSetRose from "@/assets/kids-set-rose.png";

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
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

// Tilts are alternated by hand rather than computed, so the collage looks
// arranged rather than evenly fanned.
const heroImages = [
  { src: blazerIvory, alt: "Ivory tailored blazer", tilt: "-rotate-2" },
  { src: shirtBlack, alt: "Black classic fit shirt", tilt: "rotate-1 sm:translate-y-8" },
  { src: kidsSetRose, alt: "Rose corduroy kids set", tilt: "rotate-2" },
  { src: trousersBlack, alt: "Black wide-leg trousers", tilt: "-rotate-1 sm:translate-y-8" },
];

const ribbon = [
  { icon: Truck, text: "Free delivery above ₹999" },
  { icon: RefreshCcw, text: "Free size exchange in 15 days" },
  { icon: Wallet, text: "Cash on delivery" },
  { icon: Sparkles, text: "Matching sets for four" },
];

const categories = [
  { audience: "women" as const, label: "Women", img: blazerIvory, note: "Kurta sets, dresses, tailoring" },
  { audience: "men" as const, label: "Men", img: shirtWhite, note: "Kurtas, shirts, denim" },
  { audience: "kids" as const, label: "Kids", img: kidsSetCocoa, note: "Boys, girls, infants" },
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
  // Two full rows of four; new arrivals lead the catalogue, so they show first.
  const trending = products.filter((p) => p.images).slice(0, 8);

  return (
    <div>
      {/* Hero */}
      <section>
        <div className="relative overflow-hidden bg-ink">
          <BlockPrint />
          <div className="relative mx-auto grid w-full max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 md:py-24 lg:grid-cols-2">
            <div className="max-w-xl text-ink-foreground">
              <p className="flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-accent">
                <span aria-hidden className="h-px w-8 bg-accent" />
                New season collection
              </p>
              <h1 className="mt-5 font-display text-4xl leading-tight sm:text-5xl md:text-6xl">
                Dress the whole family in{" "}
                <span className="relative inline-block whitespace-nowrap">
                  one order
                  <Swash />
                </span>
              </h1>
              <p className="mt-6 max-w-md text-base text-ink-foreground/85">
                Everyday and festive clothing for men, women and kids — from ₹299 to ₹1,999, with
                matching sets when the occasion calls for it.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/shop/$audience"
                  params={{ audience: "family" }}
                  className="rounded-md bg-accent px-7 py-3.5 text-sm font-semibold text-accent-foreground transition-transform hover:-translate-y-0.5"
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

            <div className="relative">
              <div className="grid grid-cols-2 gap-3 sm:gap-5">
                {heroImages.map((img) => (
                  <img
                    key={img.alt}
                    src={img.src}
                    alt={img.alt}
                    className={`aspect-[4/5] w-full rounded-xl bg-secondary object-cover shadow-xl ring-1 ring-ink-foreground/10 transition-transform duration-500 hover:rotate-0 ${img.tilt}`}
                  />
                ))}
              </div>
              <PriceSticker />
            </div>
          </div>
        </div>

        <Ribbon />
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
              className="group relative block overflow-hidden rounded-xl bg-secondary"
            >
              <div className="aspect-[4/5] overflow-hidden">
                <img
                  src={c.img}
                  alt={c.label}
                  loading="lazy"
                  className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              {/* Scrim so the label stays readable whatever the photo does behind it. */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink via-ink/70 to-transparent p-6 pt-16 text-ink-foreground">
                <h3 className="font-display text-2xl">{c.label}</h3>
                <p className="mt-1 text-sm text-ink-foreground/80">{c.note}</p>
                <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-accent">
                  Shop now
                  <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Family sets feature */}
      <section className="bg-secondary/60 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="max-w-2xl">
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
        <div className="mt-8 grid grid-cols-2 gap-5 lg:grid-cols-4">
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

/**
 * A block-print buti tiled across the hero — the motif the "one print, four
 * outfits" pitch is about. Kept at a low opacity so it reads as texture.
 */
function BlockPrint() {
  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute inset-0 size-full text-ink-foreground/[0.08]"
    >
      <defs>
        <pattern id="buti" width="56" height="56" patternUnits="userSpaceOnUse">
          <g fill="currentColor">
            {/* One teardrop petal, turned four times about the centre. */}
            {[0, 90, 180, 270].map((deg) => (
              <path
                key={deg}
                d="M28 28C24.5 23 24.5 18 28 13C31.5 18 31.5 23 28 28Z"
                transform={`rotate(${deg} 28 28)`}
              />
            ))}
            <circle cx="28" cy="28" r="2.5" />
            {/* Corner dots land between the flowers once the tile repeats. */}
            <circle cx="0" cy="0" r="1.8" />
            <circle cx="56" cy="0" r="1.8" />
            <circle cx="0" cy="56" r="1.8" />
            <circle cx="56" cy="56" r="1.8" />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#buti)" />
    </svg>
  );
}

/** Hand-drawn underline under the last three words of the headline. */
function Swash() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 200 10"
      preserveAspectRatio="none"
      className="absolute -bottom-1 left-0 h-2 w-full text-accent"
    >
      <path
        d="M3 7.5C46 2.5 120 1.5 197 4.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function PriceSticker() {
  return (
    <div
      aria-hidden
      // Hangs off the collage's bottom-left corner rather than sitting over a
      // garment, so it never hides what it is pricing.
      // Flush with the collage on phones - the hero clips its overflow, so a
      // negative offset here would shave a flat edge off the circle. Only from
      // sm up, where there is room in the gutter, does it hang outside.
      className="absolute -bottom-6 left-0 flex size-24 -rotate-12 flex-col items-center justify-center rounded-full bg-accent text-center text-accent-foreground shadow-lg sm:-left-10 sm:size-28"
    >
      <span className="text-[10px] uppercase tracking-widest">from</span>
      <span className="font-display text-2xl font-semibold leading-none sm:text-3xl">₹299</span>
    </div>
  );
}

function Ribbon() {
  return (
    <div className="overflow-hidden bg-accent py-3 text-accent-foreground">
      {/* Two identical halves; the track slides exactly 50% so the loop is seamless. */}
      <div className="flex w-max animate-marquee">
        {[0, 1].map((copy) => (
          <ul key={copy} aria-hidden={copy === 1} className="flex shrink-0 items-center">
            {ribbon.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-2.5 whitespace-nowrap px-6 text-sm font-medium">
                <Icon className="size-4" />
                {text}
                <span aria-hidden className="ml-6 size-1.5 rotate-45 bg-accent-foreground/40" />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}
