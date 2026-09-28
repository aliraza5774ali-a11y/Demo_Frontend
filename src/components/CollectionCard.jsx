import { useState } from "react";
import money from "../assets/money.svg";
import { Link } from "react-router-dom";
import FramedImage from "./ui/FramedImage";

const CollectionCard = ({
  images,
  wearType,
  wearBadge,
  title1,
  title2,
  priceFrom,
  priceTo,
  description,
  link,
  reverse = false,
}) => {
  const [current, setCurrent] = useState(0);

  return (
    <div
      className={`flex w-full flex-col overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-black/5 lg:min-h-[22rem] lg:flex-row ${
        reverse ? "lg:flex-row-reverse" : "lg:flex-row"
      }`}
    >
      <div className="relative min-h-[220px] w-full overflow-hidden bg-neutral-200 sm:min-h-[280px] lg:min-h-[22rem] lg:w-1/2">
  {images.map((img, i) => (
    <div
      key={i}
      className="absolute inset-0 transition-opacity duration-500"
      style={{
        opacity: i === current ? 1 : 0,
        pointerEvents: i === current ? "auto" : "none",
      }}
    >
      {/* Shown whole, never cropped; any gap continues the image's own edges. */}
      <FramedImage
        src={img}
        alt={`Collection ${i + 1}`}
        draggable={false}
        className="absolute inset-0"
      />
    </div>
  ))}


  <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2 rounded-full bg-black/30 px-3 py-2 backdrop-blur-md">
    {images.map((_, i) => (
      <button
        key={i}
        onClick={() => setCurrent(i)}
        aria-label={`Show collection image ${i + 1}`}
        className="transition-all duration-300"
        style={{
          width: i === current ? "28px" : "8px",
          height: "8px",
          borderRadius: "999px",
          background:
            i === current
              ? "#ffffff"
              : "rgba(255,255,255,0.4)",
        }}
      />
    ))}
  </div>
</div>

      <div className="flex w-full flex-col justify-center gap-6 bg-[#eeeeee] px-5 py-8 sm:px-6 sm:py-10 md:px-8 lg:w-1/2 lg:p-10">
        <div className="flex flex-col gap-4">
          <span className="inline-flex w-fit items-center gap-2 overflow-hidden rounded-full border border-black/10 bg-white text-xs font-medium text-black shadow-sm">
            <span className="rounded-full bg-black px-3 py-1.5 text-xs text-white">
              {wearBadge}
            </span>
            <span className="pr-3">{wearType}</span>
          </span>

          <h2 className="font-display text-[clamp(2rem,4vw,3.5rem)] font-semibold leading-[1.05] tracking-tight text-black">
            {title1} <br /> {title2}
          </h2>

          <p className="max-w-xl text-sm leading-7 text-black/60 sm:text-base">
            {description ||
              "Long-lasting fragrances blended from carefully chosen oils, made to stay with you from morning to night."}
          </p>
        </div>

        <div className="flex flex-col gap-4 rounded-2xl bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-[#eeeeee] p-2">
              <img
                src={money}
                alt="pricing"
                className="h-8 w-8 object-contain"
              />
            </div>
            <div>
              <p className="text-xs font-medium text-black/40">
                Pricing starts from
              </p>
              <p className="text-base font-bold text-black">
                {priceFrom} — {priceTo}
              </p>
            </div>
          </div>

          <Link
            to={link || "/shops"}
            className="inline-flex w-full items-center justify-center whitespace-nowrap rounded-full bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-neutral-800 active:scale-[0.98] sm:w-auto"
          >
            Shop now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CollectionCard;