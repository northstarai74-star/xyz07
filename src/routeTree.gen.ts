import { rootRoute } from "./routes/__root";
import { Route as IndexRoute } from "./routes/index";
import { Route as AccountRoute } from "./routes/account";
import { Route as CartRoute } from "./routes/cart";
import { Route as CheckoutRoute } from "./routes/checkout";
import { Route as OrderRoute } from "./routes/order.$orderId";
import { Route as ProductRoute } from "./routes/product.$productId";
import { Route as ShopRoute } from "./routes/shop.$audience";

export const routeTree = rootRoute.addChildren([
  IndexRoute,
  ShopRoute,
  ProductRoute,
  CartRoute,
  CheckoutRoute,
  OrderRoute,
  AccountRoute,
]);
