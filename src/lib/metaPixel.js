// Meta Pixel — browser-side tracking only (no Conversions API yet).
//
// Reads the pixel ID from VITE_META_PIXEL_ID so nothing is hard-coded here.
// If the env var is missing (e.g. a local dev build with no .env), every
// function below silently no-ops — the storefront must keep working
// whether or not the Pixel is configured.

const PIXEL_ID = import.meta.env.VITE_META_PIXEL_ID;

let initialized = false;

// Injects the standard Meta Pixel base code once. Safe to call more than
// once (guarded by `initialized`) — React 18 StrictMode invokes effects
// twice in development, and this must not create two <script> tags or
// double-fire the initial PageView.
export const initPixel = () => {
  if (initialized || typeof window === "undefined") return;
  if (!PIXEL_ID) {
    console.warn("[metaPixel] VITE_META_PIXEL_ID is not set — Meta Pixel will not load.");
    return;
  }

  /* eslint-disable */
  !(function (f, b, e, v, n, t, s) {
    if (f.fbq) return;
    n = f.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    };
    if (!f._fbq) f._fbq = n;
    n.push = n;
    n.loaded = true;
    n.version = "2.0";
    n.queue = [];
    t = b.createElement(e);
    t.async = true;
    t.src = v;
    s = b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t, s);
  })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
  /* eslint-enable */

  window.fbq("init", PIXEL_ID);
  initialized = true;
};

// Internal guard: every export below routes through this so a missing/failed
// init never throws and never breaks the surrounding page.
const callFbq = (...args) => {
  if (typeof window === "undefined" || typeof window.fbq !== "function") return;
  window.fbq(...args);
};

// Standard PageView — fired once on load and again on every SPA route
// change (see <MetaPixelPageView /> in App.jsx), matching how Meta expects
// single-page apps to report navigation.
export const trackPageView = () => callFbq("track", "PageView");

// Generic standard-event tracker. `eventId` is optional; passing it now
// costs nothing and leaves the same event ready to be deduplicated against
// a future Conversions API call without any further changes here.
export const trackEvent = (eventName, params = {}, eventId) => {
  callFbq("track", eventName, params, eventId ? { eventID: eventId } : undefined);
};

// ─── Standard e-commerce events used across the storefront ────────────────

export const trackViewContent = (product) => {
  if (!product) return;
  trackEvent("ViewContent", {
    content_ids: [String(product.id)],
    content_type: "product",
    content_name: product.name,
    content_category: product.category_name || undefined,
    value: Number(product.final_price ?? product.price ?? 0),
    currency: "PKR",
  });
};

export const trackAddToCart = (product, quantity = 1) => {
  if (!product) return;
  const unitPrice = Number(product.final_price ?? product.price ?? 0);
  trackEvent("AddToCart", {
    content_ids: [String(product.id)],
    content_type: "product",
    content_name: product.name,
    content_category: product.category_name || undefined,
    value: unitPrice * Number(quantity || 1),
    currency: "PKR",
    contents: [{ id: String(product.id), quantity: Number(quantity || 1), item_price: unitPrice }],
  });
};

export const trackInitiateCheckout = (cartItems = []) => {
  if (!cartItems.length) return;
  const value = cartItems.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 1), 0);
  trackEvent("InitiateCheckout", {
    content_ids: cartItems.map((item) => String(item.product_id ?? item.id)),
    content_type: "product",
    contents: cartItems.map((item) => ({
      id: String(item.product_id ?? item.id),
      quantity: Number(item.quantity || 1),
      item_price: Number(item.price || 0),
    })),
    num_items: cartItems.reduce((sum, item) => sum + Number(item.quantity || 1), 0),
    value,
    currency: "PKR",
  });
};

export const trackAddPaymentInfo = (cartItems = [], paymentMethod) => {
  if (!cartItems.length) return;
  const value = cartItems.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 1), 0);
  trackEvent("AddPaymentInfo", {
    content_ids: cartItems.map((item) => String(item.product_id ?? item.id)),
    content_type: "product",
    value,
    currency: "PKR",
    payment_type: paymentMethod || undefined,
  });
};

// `eventId` lets a future Conversions API "Purchase" call (sent from the
// backend, using the same id) be deduplicated against this browser event —
// see the SKILL note in OrderSuccess.jsx for where that hook will go.
// `order.items` can come from two different shapes depending on where the
// order data came from — `lastOrder` (the cart items straight off
// `/cart`, which use `product_id`) or the `/orders` list fallback (which
// uses camelCase `productId`, see order.service.js `customerOrder`). Read
// whichever is present rather than assuming one.
const productIdOf = (item) => item.product_id ?? item.productId ?? item.id;

export const trackPurchase = (order, eventId) => {
  if (!order) return;
  const items = order.items || [];
  trackEvent(
    "Purchase",
    {
      content_ids: items.map((item) => String(productIdOf(item))),
      content_type: "product",
      contents: items.map((item) => ({
        id: String(productIdOf(item)),
        quantity: Number(item.quantity || 1),
        item_price: Number(item.price || 0),
      })),
      num_items: items.reduce((sum, item) => sum + Number(item.quantity || 1), 0),
      value: Number(order.total || 0),
      currency: "PKR",
    },
    eventId
  );
};
