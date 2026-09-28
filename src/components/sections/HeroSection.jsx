import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import FramedImage from "../ui/FramedImage";
import Breadcrumbs from "../ui/Breadcrumbs";

const PAGE_HERO_PADDING = "page-x";
const INNER_MODES = ["contact", "about", "shop"];

const HeroSection = ({
  image = "",
  badge,
  heading,
  subtext,
  primaryLink = "/shops",
  primaryLabel = "See Collection",
  secondaryLink = "/contact",
  secondaryLabel = "Contact us",
  mode = "hero",
  showScrollCue = true,
  children,
  imagePosition = "center center",
  textAlign = "left",
  overlay = 55,
  ready = true,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadedImage, setLoadedImage] = useState(null);
  const imageLoaded = Boolean(image) && loadedImage === image;
  const handleImageLoad = useCallback((event) => setLoadedImage(event.currentTarget.getAttribute("src")), []);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const sectionRef = useRef(null);
  const isHomeHero = mode === "hero";
  const isInner = INNER_MODES.includes(mode);
  const align = isHomeHero ? textAlign : "left";
  const alignClass =
    align === "center"
      ? "items-center text-center"
      : align === "right"
        ? "items-end text-right"
        : "items-start text-left";
  const showPrimaryCtas = isHomeHero;
  const pageModeDefaultBadge = {
    contact: "Contact",
    about: "About",
    shop: "Shop",
  };
  const badgeLabel = badge?.label || pageModeDefaultBadge[mode];

  // Text animates in only once the page's real (CMS) content is known, so a
  // first visit never flashes placeholder copy that's about to be replaced.
  useEffect(() => {
    if (!ready) return undefined;
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, [ready]);

  useEffect(() => {
    if (!isHomeHero) return;
    const handleMouseMove = (e) => {
      if (!sectionRef.current || window.innerWidth < 1024) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
      const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
      setMousePos({ x: x * 10, y: y * 10 });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isHomeHero]);

  if (!isHomeHero && !isInner) return null;

  return (
    <section
      ref={sectionRef}
      className="relative -mt-16 flex w-full flex-col overflow-hidden bg-[#050505] md:-mt-20 md:h-[100dvh] md:flex-row"
    >
      {/* Phones: the image at its own shape — full width, natural height,
          never cropped and never padded — with the text below it. A wide
          banner can't fill a tall phone screen without one or the other. */}
      <div className={`relative w-full md:hidden ${imageLoaded ? "" : "min-h-[45svh]"}`}>
        {image && (
          <img
            key={image}
            src={image}
            alt=""
            fetchPriority="high"
            onLoad={handleImageLoad}
            className={`block h-auto w-full transition-opacity duration-700 ${imageLoaded ? "opacity-100" : "opacity-0"}`}
          />
        )}
        {/* Keeps the white navbar icons readable, and blends into the text area. */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/45 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#050505] to-transparent" />
      </div>

      {/* Desktop: full-screen; an image of a different shape is shown whole,
          with its own edge colours continuing to the screen edge (FramedImage).
          Nothing is painted until the real image has loaded. */}
      {image && (
        <FramedImage
          key={image}
          src={image}
          loading="eager"
          fetchPriority="high"
          onLoad={handleImageLoad}
          position={imagePosition}
          className={`absolute inset-0 z-0 hidden transition-[opacity,scale] duration-[1.4s] ease-out md:block ${
            imageLoaded ? "scale-100 opacity-100" : "scale-110 opacity-0"
          }`}
          style={{
            transform: isHomeHero && imageLoaded
              ? `translate(${mousePos.x * -0.5}px, ${mousePos.y * -0.5}px)`
              : undefined,
            transition: "transform 0.6s ease-out, opacity 1.4s ease-out, scale 1.4s ease-out",
          }}
        />
      )}

      <div
        className="absolute inset-0 z-[1] hidden md:block"
        style={{
          background: `linear-gradient(to right, rgba(5,5,5,${overlay / 100}) 0%, rgba(5,5,5,${Math.max(overlay - 25, 0) / 100}) 45%, rgba(5,5,5,0.1) 70%, transparent 100%)`,
        }}
      />
      <div
        className="absolute inset-0 z-[1] hidden md:block"
        style={{
          background: "linear-gradient(to top, rgba(5,5,5,0.7) 0%, transparent 40%)",
        }}
      />
      <div
        className="absolute bottom-0 left-0 right-0 z-[1] hidden h-32 md:block"
        style={{
          background: "linear-gradient(to top, rgba(5,5,5,0.8) 0%, transparent 100%)",
        }}
      />

      <div
        className={`relative z-10 mr-auto flex w-full max-w-7xl flex-col justify-center ${PAGE_HERO_PADDING} pb-14 pt-4 md:pb-0 md:pt-20 ${alignClass}`}
      >
        <div className="w-full max-w-3xl xl:max-w-4xl">
          {isInner && (
            <Breadcrumbs
              tone="light"
              items={[{ label: pageModeDefaultBadge[mode] }]}
              className={`mb-6 transition-all duration-700 ${isLoaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
            />
          )}
          {badgeLabel && (
            <div
              className={`mb-6 inline-flex items-center gap-2.5 rounded-full border border-white/10 px-1.5 py-1.5 backdrop-blur-md transition-all duration-700 sm:mb-8 ${
                isLoaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
              }`}
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.06)",
                transitionDelay: "150ms",
              }}
            >
              <span className="rounded-full bg-white px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-neutral-900">
                {badgeLabel}
              </span>
              {badge?.text && (
                <span className="pr-3 text-[11px] font-medium text-white/70">
                  {badge.text}
                </span>
              )}
            </div>
          )}

          <h1
            className={`font-display text-pretty text-[clamp(2.1rem,4.6vw,4.25rem)] font-medium leading-[1.08] tracking-[-0.025em] text-white transition-all duration-1000 ${
              isLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
            style={{ transitionDelay: "300ms" }}
          >
            {heading}
          </h1>

          <div
            className={`my-6 h-px w-16 rounded-full bg-white/20 transition-all duration-700 sm:my-8 sm:w-20 ${
              isLoaded ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0"
            }`}
            style={{
              transitionDelay: "500ms",
              transformOrigin: align === "right" ? "right" : "left",
            }}
          />

          {subtext && (
            <p
              className={`max-w-md text-[15px] font-normal leading-[1.7] text-white/55 transition-all duration-700 ${
                isLoaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
              }`}
              style={{ transitionDelay: "550ms" }}
            >
              {subtext}
            </p>
          )}

          {showPrimaryCtas && (
            <div
              className={`mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:items-center ${
                isLoaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
              }`}
              style={{ transitionDelay: "700ms" }}
            >
              <Link
                to={primaryLink}
                className="group inline-flex items-center justify-center gap-2.5 rounded-full bg-white px-8 py-3.5 text-[13px] font-medium text-neutral-900 transition-all duration-300 hover:bg-neutral-100 hover:shadow-[0_0_40px_rgba(255,255,255,0.12)] active:scale-[0.97]"
              >
                {primaryLabel}
                <svg
                  className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                  />
                </svg>
              </Link>
              {isHomeHero && (
                <Link
                  to={secondaryLink}
                  className="inline-flex items-center justify-center rounded-full border border-white/15 px-8 py-3.5 text-[13px] font-medium text-white/70 backdrop-blur-sm transition-all duration-300 hover:border-white/30 hover:bg-white/5 hover:text-white/90 active:scale-[0.97]"
                >
                  {secondaryLabel}
                </Link>
              )}
            </div>
          )}

          {children && (
            <div
              className={`mt-8 transition-all duration-700 ${
                isLoaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
              }`}
              style={{ transitionDelay: "700ms" }}
            >
              {children}
            </div>
          )}
        </div>
      </div>

    </section>
  );
};

export default HeroSection;