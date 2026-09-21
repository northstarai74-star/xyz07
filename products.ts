import menImg from "@/assets/cat-men.jpg";
import womenImg from "@/assets/cat-women.jpg";
import kidsImg from "@/assets/cat-kids.jpg";
import matchingImg from "@/assets/matching-sets.jpg";

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
  image: string;
  description: string;
};

const img: Record<Audience, string> = {
  men: menImg,
  women: womenImg,
  kids: kidsImg,
  family: matchingImg,
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
    image: img[audience],
    description,
  };
}

const adultSizes = ["XS", "S", "M", "L", "XL", "XXL"];
const kidSizes = ["2-3y", "4-5y", "6-7y", "8-9y", "10-11y", "12-13y"];

export const products: Product[] = [
  make("m1", "Handloom Cotton Kurta", "Aangan", "men", "Ethnic Wear", "Festive", 1499, 2299, 4.4, 812, "Pure cotton", adultSizes, ["Marigold", "Indigo", "Ivory"], "A breathable handloom kurta with a mandarin collar, cut for all-day festive comfort."),
  make("m2", "Linen Blend Casual Shirt", "Nira", "men", "Shirts", "Casual", 999, 1699, 4.2, 431, "Linen blend", adultSizes, ["Sand", "Sage", "Sky"], "Soft linen-blend shirt with a relaxed collar and easy half-tuck length."),
  make("m3", "Everyday Cotton T-Shirt", "Nira", "men", "T-Shirts", "Casual", 499, 899, 4.1, 1270, "Combed cotton", adultSizes, ["Black", "White", "Rust"], "Mid-weight combed cotton tee that holds shape after every wash."),
  make("m4", "Slim Fit Stretch Jeans", "Rango", "men", "Jeans", "Casual", 1699, 2799, 4.3, 604, "Cotton stretch denim", adultSizes, ["Mid blue", "Charcoal"], "Slim-fit denim with 2% stretch so it moves with you through long days."),
  make("m5", "Bandhgala Nehru Jacket", "Aangan", "men", "Ethnic Wear", "Wedding", 1999, 3499, 4.6, 289, "Silk blend", adultSizes, ["Indigo", "Wine"], "Textured silk-blend Nehru jacket that layers over any kurta for wedding season."),
  make("m6", "Active Training Shorts", "Rango", "men", "Sportswear", "Sports", 699, 1199, 4.0, 358, "Recycled polyester", adultSizes, ["Black", "Navy"], "Quick-dry shorts with zip pockets and a soft inner brief."),

  make("w1", "Block Print Kurta Set", "Aangan", "women", "Kurta Sets", "Festive", 1799, 2999, 4.5, 1522, "Cotton mulmul", adultSizes, ["Blush", "Marigold", "Indigo"], "Three-piece kurta set with hand block print, straight pants and a matching dupatta."),
  make("w2", "Chanderi Anarkali", "Aangan", "women", "Ethnic Wear", "Wedding", 2499, 4199, 4.6, 604, "Chanderi silk", adultSizes, ["Gold", "Emerald"], "Floor-length Anarkali in lightweight Chanderi with a soft flare."),
  make("w3", "Cotton A-Line Dress", "Nira", "women", "Dresses", "Casual", 1199, 1999, 4.2, 743, "Cotton poplin", adultSizes, ["Ivory", "Olive"], "Easy A-line dress with side pockets and a tie waist."),
  make("w4", "Relaxed Straight Jeans", "Rango", "women", "Jeans", "Casual", 1599, 2599, 4.1, 388, "Rigid denim", adultSizes, ["Light blue", "Black"], "High-rise straight jeans in a structured denim that keeps its line."),
  make("w5", "Office Tailored Trousers", "Nira", "women", "Trousers", "Office", 1399, 2299, 4.3, 265, "Viscose blend", adultSizes, ["Charcoal", "Beige"], "Fluid tailored trousers with a comfort waistband for long desk days."),
  make("w6", "Everyday Cotton Top", "Nira", "women", "Tops", "Casual", 599, 1099, 4.0, 912, "Cotton jersey", adultSizes, ["White", "Rust", "Sage"], "A soft cotton top that layers under jackets and works on its own."),

  make("k1", "Boys Festive Kurta Pyjama", "Aangan Kids", "kids", "Boys", "Festive", 899, 1599, 4.4, 431, "Cotton silk", kidSizes, ["Mint", "Ivory"], "Lightweight kurta pyjama set that survives running, dancing and second helpings."),
  make("k2", "Girls Sharara Set", "Aangan Kids", "kids", "Girls", "Festive", 1199, 1999, 4.5, 366, "Georgette", kidSizes, ["Mint", "Lemon"], "Twirl-friendly sharara set with an embroidered top and soft dupatta."),
  make("k3", "Kids Cotton Play T-Shirt", "Nira Kids", "kids", "Boys", "Casual", 349, 699, 4.2, 1088, "Cotton", kidSizes, ["Yellow", "Blue", "Red"], "Skin-friendly cotton tee with a tag-free neck."),
  make("k4", "School Uniform Shirt", "Nira Kids", "kids", "School Wear", "School", 449, 799, 4.1, 512, "Poly cotton", kidSizes, ["White", "Sky"], "Easy-wash uniform shirt that stays crisp through the week."),
  make("k5", "Girls Party Frock", "Aangan Kids", "kids", "Girls", "Party", 999, 1799, 4.3, 274, "Tulle", kidSizes, ["Pink", "Mint"], "Layered party frock with a soft lining so it never scratches."),
  make("k6", "Infant Muslin Set", "Nira Kids", "kids", "Infants", "Casual", 599, 999, 4.6, 198, "Muslin cotton", ["0-3m", "3-6m", "6-12m", "12-18m"], ["Ivory", "Peach"], "Double-gauze muslin set that gets softer with every wash."),

  make("f1", "Family Block Print Set of 4", "Aangan", "family", "Matching Sets", "Festive", 5499, 8999, 4.7, 341, "Cotton mulmul", ["Family bundle"], ["Marigold & Indigo"], "One print, four outfits: kurta for him, kurta set for her, and two kidswear pieces sized to your family."),
  make("f2", "Diwali Family Edit of 4", "Aangan", "family", "Matching Sets", "Festive", 6499, 10999, 4.6, 187, "Silk blend", ["Family bundle"], ["Wine & Gold"], "A coordinated festive set for four, styled to photograph beautifully together."),
  make("f3", "Weekend Tee Family Pack", "Nira", "family", "Matching Sets", "Casual", 1799, 2999, 4.3, 421, "Combed cotton", ["Family bundle"], ["Ecru", "Black"], "Four matching cotton tees for holidays, birthdays and lazy Sundays."),
  make("f4", "Wedding Family Coordinates", "Aangan", "family", "Matching Sets", "Wedding", 8999, 14999, 4.8, 96, "Chanderi silk", ["Family bundle"], ["Emerald & Gold"], "Ceremony-ready outfits for four in one palette, so nobody has to shop twice."),
];

export const audienceMeta: Record<
  Exclude<Audience, "family"> | "family",
  { label: string; blurb: string }
> = {
  men: { label: "Men", blurb: "Kurtas, shirts, denim and everyday essentials." },
  women: { label: "Women", blurb: "Kurta sets, dresses, tailoring and festive wear." },
  kids: { label: "Kids", blurb: "Boys, girls and infants, sized 0 to 13 years." },
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
