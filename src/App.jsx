import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";

import About from "./pages/About";
import Home from "./pages/Home";
import Shops from "./pages/Shops";
import MainLayout from "./components/layout/MainLayout";
import Contact from "./pages/Contact";
import ScrollToTop from "./components/ScrollToTop";
import ProductDetails from "./pages/ProductDetails";
import ProtectedRoute from "./components/protection/ProtectedRoute";
import Dashboard from "./components/user/Dashboard";
// The admin panel is a separate chunk, only downloaded when an admin URL is
// opened — none of its code or text ships with the shop.
const AdminAuthRoutes = lazy(() => import("./components/admin/entry").then((m) => ({ default: m.AdminAuthRoutes })));
const AdminDashboardRoutes = lazy(() => import("./components/admin/entry").then((m) => ({ default: m.AdminDashboardRoutes })));
import CartPage from "./pages/CartPage";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import SafepayReturn from "./pages/SafepayReturn";
import Returns from "./pages/Returns";
import ReturnStatus from "./pages/ReturnStatus";
import Orders from "./pages/Orders";
import OrderDetail from "./pages/OrderDetail";
import Wishlist from "./pages/Wishlist";
import FAQ from "./pages/FAQ";
import ShippingReturns from "./pages/ShippingReturns";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import CookieSettings from "./pages/CookieSettings";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";
import GoogleAuthCallback from "./pages/GoogleAuthCallback";

import { lazy, Suspense, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "./features/products/productsThunks";
import { fetchCart } from "./features/cart/cartThunks";
import { fetchCMSData, fetchStoreInfo } from "./features/site/siteThunks";
import { fetchWishlist } from "./features/wishlist/wishlistThunks";
import { trackPageView } from "./lib/metaPixel.js";

const isAdminPath = (pathname) => pathname === "/admin" || pathname.startsWith("/admin/") || pathname.startsWith("/adminDashboard");

// Fires a Meta Pixel PageView on every client-side route change. The base
// code injected in main.jsx only ever reports the first load, so a SPA has
// to send its own PageView per navigation — this is the one place that does
// it for the whole storefront, admin routes included.
const MetaPixelPageView = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    trackPageView();
  }, [pathname]);

  return null;
};

// Loads what the shop needs (catalogue, cart, CMS, store info, wishlist).
// Skipped inside the admin panel, which never acts as a shopper; it runs
// the first time the visitor lands on a shop page.
const StorefrontBootstrap = () => {
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const inShop = !isAdminPath(pathname);
  const started = useRef(false);

  useEffect(() => {
    if (!inShop || started.current) return;
    started.current = true;
    dispatch(fetchProducts());
    dispatch(fetchCart());
    dispatch(fetchCMSData());
    dispatch(fetchStoreInfo());
  }, [inShop, dispatch]);

  // Keyed on auth state — the wishlist is only meaningful (and only
  // fetchable) once a customer is logged in, and should re-sync
  // immediately after login rather than waiting for a page visit.
  useEffect(() => {
    if (inShop && isAuthenticated) dispatch(fetchWishlist());
  }, [inShop, isAuthenticated, dispatch]);

  return null;
};

const App = () => {
  return (
    <BrowserRouter>
    <ScrollToTop/>
    <MetaPixelPageView/>
    <StorefrontBootstrap/>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/shops" element={<Shops />} />
          <Route path="/shop/:slug" element={<ProductDetails />} />
          <Route path='/contact' element={<Contact/>} />
          <Route path="/cart" element={<CartPage/>} />
          <Route path="/order-success/:orderId" element={<OrderSuccess/>} />
          <Route path="/payment/safepay/return" element={<SafepayReturn/>} />
          <Route path="/returns" element={<Returns/>} />
          <Route path="/returns/:rma" element={<ReturnStatus/>} />
          <Route path="/wishlist" element={<Wishlist/>} />
          <Route path="/faq" element={<FAQ/>} />
          <Route path="/shipping-returns" element={<ShippingReturns/>} />
          <Route path="/privacy-policy" element={<PrivacyPolicy/>} />
          <Route path="/terms-of-service" element={<TermsOfService/>} />
          <Route path="/cookie-settings" element={<CookieSettings/>} />

          <Route path="/orders" element={
              <ProtectedRoute>
                <Orders/>
              </ProtectedRoute>
          }/>
          {/* Not guarded: guests who checked out without an account follow
              the "Track this order" link here from the confirmation page.
              OrderDetail serves both — signed-in shoppers load their order
              list, guests read the order they just placed. */}
          <Route path="/orders/:orderId" element={<OrderDetail/>}/>
        </Route>

        <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard/>
            </ProtectedRoute>
        }/>

        <Route path="/checkout" element={<Checkout/>} />
        <Route path="/reset-password" element={<ResetPassword/>} />
        <Route path="/auth/google/callback" element={<GoogleAuthCallback/>} />

        <Route path="/admin/*" element={<Suspense fallback={null}><AdminAuthRoutes /></Suspense>} />
        <Route path="/adminDashboard/*" element={<Suspense fallback={null}><AdminDashboardRoutes /></Suspense>} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
