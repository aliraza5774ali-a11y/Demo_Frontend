import { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import { Eye, Heart } from "lucide-react";
import { resolveImg } from "../utils/resolveImg";
import { formatPrice, getDiscountInfo } from "../utils/price";
import { isSoldOut, useProductActions } from "../hooks/useProductActions";
import ProductQuickView from "./ProductQuickView";
import FramedImage from "./ui/FramedImage";

// Round action buttons on the card image. Always visible on touch screens;
// revealed on hover/focus where a fine pointer exists.
const actionClass =
  "grid h-10 w-10 place-items-center rounded-full bg-white text-black shadow-sm transition duration-200 hover:bg-black hover:text-white active:scale-95 " +
  "pointer-fine:translate-x-2 pointer-fine:opacity-0 pointer-fine:group-hover:translate-x-0 pointer-fine:group-hover:opacity-100 pointer-fine:group-focus-within:translate-x-0 pointer-fine:group-focus-within:opacity-100";

const SampleProduct = (product) => {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  const { toggleWish, isWishlisted } = useProductActions(product);

  const name = product.name || product.title;
  const images = (product.images?.length ? product.images : [product.image_url]).map(resolveImg).filter(Boolean);
  const [cover, hoverImage] = images;
  const soldOut = isSoldOut(product);
  const href = `/shop/${product.slug}`;
  const { original, final, hasDiscount, percent } = getDiscountInfo(product);

  return (
    <article className="group flex w-full flex-col gap-3">
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-[#ededed]">
        <Link to={href} tabIndex={-1} aria-hidden="true" className="absolute inset-0">
          {cover && (
            <FramedImage
              src={cover}
              className={`absolute inset-0 transition duration-500 ease-out group-hover:scale-[1.03] ${hoverImage ? "pointer-fine:group-hover:opacity-0" : ""} ${soldOut ? "opacity-60 grayscale-[35%]" : ""}`}
            />
          )}
          {hoverImage && (
            <FramedImage
              src={hoverImage}
              className="absolute inset-0 hidden scale-[1.03] opacity-0 transition duration-500 ease-out pointer-fine:block pointer-fine:group-hover:opacity-100"
            />
          )}
        </Link>

        {soldOut && (
          <span className="absolute left-3 top-3 rounded-full bg-white px-3 py-1 text-[11px] font-medium uppercase tracking-[0.12em] text-black shadow-sm">
            Sold out
          </span>
        )}
        {!soldOut && hasDiscount && (
          <span className="absolute left-3 top-3 rounded-full bg-zs-danger px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-white shadow-sm">
            -{percent}%
          </span>
        )}

        <div className="absolute right-3 top-3 flex flex-col gap-2">
          <button
            type="button"
            onClick={toggleWish}
            aria-label={isWishlisted ? `Remove ${name} from wishlist` : `Save ${name} to wishlist`}
            aria-pressed={isWishlisted}
            className={`${actionClass} ${isWishlisted ? "pointer-fine:translate-x-0 pointer-fine:opacity-100" : ""}`}
          >
            <Heart size={17} className={isWishlisted ? "fill-current" : ""} />
          </button>
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label={`Quick view ${name}`}
            className={`${actionClass} pointer-fine:delay-75`}
          >
            <Eye size={17} />
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-1 px-1">
        <Link to={href} className="line-clamp-2 text-[15px] font-medium leading-snug text-black decoration-black/30 underline-offset-4 hover:underline sm:text-base">
          {name}
        </Link>
        {hasDiscount ? (
          <p className="flex items-baseline gap-2 text-sm font-medium tabular-nums sm:text-[15px]">
            <span className="text-black/70">{formatPrice(final)}</span>
            <span className="text-xs text-black/35 line-through">{formatPrice(original)}</span>
          </p>
        ) : (
          <p className="text-sm font-medium tabular-nums text-black/70 sm:text-[15px]">{formatPrice(original)}</p>
        )}
      </div>

      <ProductQuickView product={product} open={open} onClose={close} />
    </article>
  );
};

export default SampleProduct;
