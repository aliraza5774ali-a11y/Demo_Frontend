import { useSelector } from "react-redux";
import AboutSection from "../components/sections/AboutSection";
import HeroSection from "../components/sections/HeroSection";
import PartnersSection from "../components/sections/PartnerSection";
import { getCmsSection, useCmsReady } from "../utils/cms";
import { resolveImg } from "../utils/resolveImg";

const fallbackImage = "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=2200&q=90";

const About = () => {
  const pages = useSelector((state) => state.site.pages);
  const cmsReady = useCmsReady();
  // Editable from the admin Website Editor -> About Us page
  const story = getCmsSection(pages, "about", "story") || {};
  const partners = getCmsSection(pages, "about", "partners") || {};

  console.log()
  return (
    <div>
      <HeroSection
        mode="about"
        ready={cmsReady}
        image={cmsReady ? resolveImg(story.image) || fallbackImage : ""}
        badge={{ label: story.badgeLabel || "About Us", text: story.badgeText || "Crafting Experiences" }}
        heading={story.title || "Crafting Fine Fragrance"}
        subtext={story.content || "We believe a great scent is built with thoughtful composition, quality ingredients, and attention to every detail."}
      />
      <PartnersSection
        trustText={partners.trustText}
        rating={partners.rating}
        ratingColor={partners.ratingColor}
        avatars={typeof partners.avatars === "string" ? partners.avatars.split(",").map((s) => s.trim()).filter(Boolean) : undefined}
        logos={typeof partners.logos === "string" ? partners.logos.split(",").map((s) => s.trim()).filter(Boolean) : undefined}
      />
      <AboutSection />
    </div>
  );
};

export default About;