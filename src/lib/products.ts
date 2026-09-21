import blazerIvory from "@/assets/blazer-ivory.png";
import blazerBlack from "@/assets/blazer-black.png";
import trousersIvory from "@/assets/trousers-ivory.png";
import trousersBlack from "@/assets/trousers-black.png";
import shirtWhite from "@/assets/shirt-white.png";
import shirtBlack from "@/assets/shirt-black.png";
import kidsSetCocoa from "@/assets/kids-set-cocoa.png";
import kidsSetRose from "@/assets/kids-set-rose.png";
import blazerDbGreen from "@/assets/blazer-db-green.jpg";
import blazerDbBlack from "@/assets/blazer-db-black.jpg";
import blazerDbBlackS from "@/assets/blazer-db-black-s.jpg";
import blazerDbBlackL from "@/assets/blazer-db-black-l.jpg";
import girlsBlazerGreen from "@/assets/girls-blazer-green.jpg";
import mensBlazerBlack from "@/assets/mens-blazer-black.jpg";
import mensBlazerBlackS from "@/assets/mens-blazer-black-s.jpg";
import mensBlazerBlackM from "@/assets/mens-blazer-black-m.jpg";
import mensBlazerBlackL from "@/assets/mens-blazer-black-l.jpg";
import babyShirtBlue from "@/assets/baby-shirt-blue.jpg";
import babyShirtBlueM from "@/assets/baby-shirt-blue-m.jpg";
import babyShirtBlueL from "@/assets/baby-shirt-blue-l.jpg";
import babyFrockBlue from "@/assets/baby-frock-blue.jpg";
import babyFrockBlueS from "@/assets/baby-frock-blue-s.jpg";
import babyFrockBlueM from "@/assets/baby-frock-blue-m.jpg";

export type Audience = "men" | "women" | "kids" | "family";

export type Product = {
  id: string;
  name: string;
  brand: string;
  audience: Audience;
  category: string;
  occasion: string;
  price: number;
  mrp: number;
  rating: number;
  reviews: number;
  fabric: string;
  sizes: string[];
  colors: string[];
  /** One photo per entry in `colors`, in the same order. */
  images?: string[];
  /**
   * Colour -> size -> a photo of that exact size, with back view and
   * close-ups. These have the size printed on them, so they are only ever
   * shown when that size is selected; other sizes fall back to `images`.
   */
  sizeImages?: Record<string, Record<string, string>>;
  description: string;
};

function make(
  id: string,
  name: string,
  brand: string,
  audience: Audience,
  category: string,
  occasion: string,
  price: number,
  mrp: number,
  rating: number,
  reviews: number,
  fabric: string,
  sizes: string[],
  colors: string[],
  description: string,
): Product {
  return {
    id,
    name,
    brand,
    audience,
    category,
    occasion,
    price,
    mrp,
    rating,
    reviews,
    fabric,
    sizes,
    colors,
    description,
  };
}

/** One standard size scale across the whole catalogue. */
const standardSizes = ["XS", "S", "M", "L", "XL", "XXL"];

export const products: Product[] = [
  // New arrivals first: the homepage's "Trending now" takes the first eight products with photos.
  { ...make("w9", "Double-Breasted Crest Button Blazer", "Nira", "women", "Blazers", "Office", 2299, 3999, 4.7, 126, "Poly viscose crepe", standardSizes, ["Bottle Green", "Black"], "A sculpted double-breasted blazer with sharp lapels, flap pockets and six crest-embossed gold buttons. The bottle green matches our girls' blazer."), images: [blazerDbGreen, blazerDbBlack], sizeImages: { Black: { S: blazerDbBlackS, L: blazerDbBlackL } } },
  { ...make("m8", "Two-Button Crest Blazer", "Nira", "men", "Blazers", "Office", 2499, 4299, 4.5, 204, "Poly wool blend", standardSizes, ["Black"], "A single-breasted black blazer with notch lapels, a welt chest pocket and gold crest buttons down the front and on the cuffs."), images: [mensBlazerBlack], sizeImages: { Black: { S: mensBlazerBlackS, M: mensBlazerBlackM, L: mensBlazerBlackL } } },
  { ...make("k8", "Girls Double-Breasted Blazer", "Nira Kids", "kids", "Girls", "Party", 1299, 2199, 4.6, 88, "Poly viscose crepe", standardSizes, ["Bottle Green"], "A mini version of our women's double-breasted blazer, with gold crest buttons and three-quarter sleeves. Pair the two for a mother-daughter look."), images: [girlsBlazerGreen] },
  { ...make("k9", "Baby Boy Oxford Shirt", "Nira Kids", "kids", "Infants", "Casual", 549, 899, 4.6, 173, "Cotton oxford", standardSizes, ["Blue"], "A soft cotton oxford shirt with an embroidered teddy patch, a turn-down collar and roll-up cuffs."), images: [babyShirtBlue], sizeImages: { Blue: { M: babyShirtBlueM, L: babyShirtBlueL } } },
  { ...make("k10", "Baby Girl Floral Tulle Frock", "Nira Kids", "kids", "Girls", "Party", 899, 1499, 4.7, 219, "Cotton blend, tulle overlay", standardSizes, ["Blue"], "Flutter sleeves, flower buttons and a tulle skirt scattered with daisies, finished with a tie-back bow. Soft cotton-blend lining sits against the skin."), images: [babyFrockBlue], sizeImages: { Blue: { S: babyFrockBlueS, M: babyFrockBlueM } } },

  { ...make("w7", "Tailored Single-Button Blazer", "Nira", "women", "Blazers", "Office", 1999, 3499, 4.6, 318, "Poly viscose crepe", standardSizes, ["Ivory", "Black"], "A sharply cut single-button blazer with notch lapels, flap pockets and a nipped-in waist."), images: [blazerIvory, blazerBlack] },
  { ...make("w8", "High-Rise Wide-Leg Trousers", "Nira", "women", "Trousers", "Office", 1499, 2499, 4.5, 402, "Poly viscose crepe", standardSizes, ["Ivory", "Black"], "Pressed front pleats and a clean wide leg. Pair with the matching blazer for a full suit."), images: [trousersIvory, trousersBlack] },
  { ...make("m7", "Classic Fit Cotton Shirt", "Nira", "men", "Shirts", "Office", 999, 1699, 4.4, 655, "Cotton rich poplin", standardSizes, ["White", "Black"], "A crisp long-sleeve shirt with a spread collar, chest pocket and buttoned cuffs."), images: [shirtWhite, shirtBlack] },
  { ...make("k7", "Corduroy Shirt Jacket Set", "Nira Kids", "kids", "Infants", "Casual", 1199, 1999, 4.7, 244, "Cotton corduroy", standardSizes, ["Cocoa", "Rose"], "Three pieces: a soft corduroy shirt jacket, an embroidered cotton tee and drawstring joggers."), images: [kidsSetCocoa, kidsSetRose] },
];

export const audienceMeta: Record<
  Exclude<Audience, "family"> | "family",
  { label: string; blurb: string }
> = {
  men: { label: "Men", blurb: "Kurtas, shirts, denim and everyday essentials." },
  women: { label: "Women", blurb: "Kurta sets, dresses, tailoring and festive wear." },
  kids: { label: "Kids", blurb: "Boys, girls and infants, in standard sizes XS to XXL." },
  family: { label: "Family Sets", blurb: "Matching outfits for everyone, in one order." },
};

export const occasions = ["Casual", "Office", "Festive", "Wedding", "Party", "Sports", "School"];

export function getProduct(id: string) {
  return products.find((p) => p.id === id);
}

export function byAudience(a: string) {
  return products.filter((p) => p.audience === a);
}

export function formatINR(n: number) {
  return "₹" + n.toLocaleString("en-IN");
}
