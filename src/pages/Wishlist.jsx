import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Heart, Trash2 } from "lucide-react";

import { removeFromWishlist } from "../features/wishlist/wishlistSlice";
import { fetchWishlist, removeFromWishlistThunk } from "../features/wishlist/wishlistThunks";
import { addToCartThunk as addToCart } from "../features/cart/cartThunks";
import { openCart } from "../store/slice/Uislice";
import PageHeader from "../components/layout/PageHeader";
import SampleProduct from "../components/SampleProduct";

const Wishlist = () => {
  const dispatch = useDispatch();
  const wishlistSlugs = useSelector((state) => state.wishlist?.items) || [];
  const allProducts = useSelector(state => state.products.items) || [];
  const wishlistProducts = allProducts.filter((p) => wishlistSlugs.includes(p.slug));

  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);

  // Logged-in users' wishlists live on the server — pull the real list on
  // arrival so it reflects what was saved from any device/session, not
  // just whatever's cached in this browser's localStorage.
  useEffect(() => {
    if (isAuthenticated) dispatch(fetchWishlist());
  }, [isAuthenticated, dispatch]);

  const handleRemove = (product) => {
    if (isAuthenticated) {
      dispatch(removeFromWishlistThunk({ productId: product.id, slug: product.slug }));
    } else {
      dispatch(removeFromWishlist(product.slug));
    }
  };

  // Guests can add to bag too (the API keeps a guest cart). Only take the
  // item off the wishlist once it's actually in the bag.
  const handleMoveToBag = async (product) => {
    try {
      await dispatch(addToCart({ productId: product.id, quantity: 1 })).unwrap();
      handleRemove(product);
      dispatch(openCart());
    } catch {
      // Cart slice keeps the error; the item simply stays on the wishlist.
    }
  };

  return (
    <section className="page-section min-h-screen bg-white">
      <div className="page-inner">
        <PageHeader
          eyebrow="Saved"
          breadcrumbs={[{ label: "Wishlist" }]}
          title="Your Wishlist"
          subtitle="Fragrances you're keeping close. Move them to your bag whenever you're ready."
        />

        {wishlistProducts.length === 0 ? (
          <div className="flex flex-col items-center gap-4 rounded-2xl bg-[#f8f8f8] py-20 text-center">
            <Heart size={28} className="text-black/30" />
            <p className="text-black/60">Nothing saved here yet. Tap the heart on any fragrance to keep it here.</p>
            <Link to="/shops" className="text-sm font-medium text-black underline">
              Browse fragrances
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 lg:grid-cols-3">
            {wishlistProducts.map((product) => (
              <div key={product.slug} className="flex flex-col gap-3">
                <SampleProduct {...product} />
                <div className="flex items-center gap-2 px-1">
                  <button
                    type="button"
                    onClick={() => handleMoveToBag(product)}
                    disabled={Number(product.stock_quantity ?? 0) <= 0}
                    className="flex-1 rounded-full bg-black py-3 text-[13px] font-medium text-white transition hover:bg-black/90 disabled:cursor-not-allowed disabled:bg-black/20"
                  >
                    {Number(product.stock_quantity ?? 0) <= 0 ? "Sold out" : "Move to bag"}
                  </button>
                  <button
                    aria-label="Remove from wishlist"
                    onClick={() => handleRemove(product)}
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-black/10 text-black/40 transition hover:text-black"
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Wishlist;
