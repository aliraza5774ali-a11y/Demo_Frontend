import { Fragment } from "react";
import BestSeller from "../components/sections/BestSeller";
import ScentTrailSection from "../components/sections/ScentTrailSection";
import CollectionSection from "../components/sections/CollectionSection";
import HeroSection from "../components/sections/HeroSection";
import ProductSection from "../components/sections/ProductSection";
import ReviewSection from "../components/sections/ReviewSection";
import VideoSection from "../components/sections/VideoSection";
import { useSelector } from "react-redux";
import { resolveImg } from "../utils/resolveImg";
import { useCmsReady } from "../utils/cms";

// Only used when the admin hasn't set a hero image, and only after the CMS
// has confirmed that — never as a placeholder while it's still loading.
const FALLBACK_HERO_IMAGE = "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=2200&q=90";

const Home = () => {
  const { hero, sections } = useSelector((state) => state.site);
  const cmsReady = useCmsReady();
  const sectionComponents = {
    "new-arrivals": ProductSection,
    "brand-film": VideoSection,
    "best-sellers": BestSeller,
    collections: CollectionSection,
    reviews: ReviewSection,
  };
  const visibleSections = sections.filter((section) => section.isVisible);
  const showsReviews = visibleSections.some((section) => section.id === "reviews");
  const badge = String(hero.badge || "");
  const heroImage = cmsReady ? resolveImg(hero.image) || FALLBACK_HERO_IMAGE : "";

  return (
    <>
      {hero.isVisible && (
        <HeroSection
          mode="hero"
          ready={cmsReady}
          image={heroImage}
          imagePosition={hero.imagePosition}
          mobileImagePosition={hero.mobileImagePosition || "90% 22%"}
          textAlign={hero.textAlign}
          overlay={hero.overlay}
          badge={{ label: badge.split(" · ")[0], text: badge.split(" · ").slice(1).join(" · ") }}
          heading={hero.heading}
          subtext={hero.subtext}
          primaryLabel={hero.primaryLabel}
          primaryLink={hero.primaryLink}
          secondaryLabel={hero.secondaryLabel}
          secondaryLink={hero.secondaryLink}
        />
      )}
      {/* Section order, visibility and copy all come from the CMS; wait for
          it rather than render the default layout and then rearrange it. */}
      {cmsReady && visibleSections.map((section) => {
        const Section = sectionComponents[section.id];
        if (!Section) return null;
        // The scent trail rides directly under the customer reviews.
        return section.id === "reviews" ? (
          <Fragment key={section.id}>
            <Section />
            <ScentTrailSection />
          </Fragment>
        ) : (
          <Section key={section.id} />
        );
      })}
      {/* If reviews are hidden in the CMS, the trail closes the page instead. */}
      {cmsReady && !showsReviews && <ScentTrailSection />}
    </>
  );
};

export default Home;
