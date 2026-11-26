import type { Service, ServicePresentation } from "@/types";
import { IMAGERY } from "./imagery";
import { getPhoto, STAGE_PHOTO } from "./photography";

/**
 * PARVEX — service catalogue.
 *
 * This is the static fallback and the seed source for the CMS. When the
 * database is reachable, published services come from Postgres and are
 * matched to the presentation details below by slug.
 */
export const SERVICES: Service[] = [
  {
    id: "website-design-development",
    slug: "website-design-development",
    number: "01",
    title: "Website Design & Development",
    description:
      "Fast, considered websites that explain what you do in seconds and turn the right visitors into enquiries.",
    longDescription:
      "We plan the structure, write the hierarchy, design every breakpoint and build it on a modern stack — so the site is quick, easy to update and genuinely represents the quality of your business.",
    deliverables: ["Content & sitemap planning", "Custom visual design", "Next.js development", "SEO & performance foundations", "CMS setup and handover"],
    outcome: "A website that earns trust before the first conversation.",
    metaTitle: "Website Design & Development",
    metaDescription: "Custom website design and development for startups, brands and growing businesses.",
    keywords: ["website design", "website development", "Next.js websites"],
  },
  {
    id: "web-applications",
    slug: "web-applications",
    number: "02",
    title: "Web Applications",
    description:
      "Dashboards, portals and internal tools engineered to handle real data, real users and real workflows.",
    longDescription:
      "From the first data model to deployment, we build production-grade web applications with authentication, role-based access, admin tooling and the infrastructure to keep them reliable.",
    deliverables: ["Product scoping", "Application architecture", "Frontend & backend engineering", "Auth, roles and admin tools", "Deployment & monitoring"],
    outcome: "Software your team relies on instead of works around.",
    metaTitle: "Web Application Development",
    metaDescription: "Custom web applications, dashboards and internal tools built on modern, maintainable infrastructure.",
    keywords: ["web application development", "SaaS development", "dashboard development"],
  },
  {
    id: "ui-ux-design",
    slug: "ui-ux-design",
    number: "03",
    title: "UI/UX Design",
    description:
      "Interfaces that feel obvious to use — grounded in clear user flows, honest hierarchy and a consistent system.",
    longDescription:
      "We map the journeys that matter, prototype them early and turn them into a component-based design system your developers can actually build from.",
    deliverables: ["User flows & information architecture", "Wireframes and prototypes", "High-fidelity interface design", "Design systems"],
    outcome: "Products people understand without a tutorial.",
    metaTitle: "UI/UX Design",
    metaDescription: "UI/UX design for web and mobile products — flows, prototypes and production-ready design systems.",
    keywords: ["UI design", "UX design", "product design", "design systems"],
  },
  {
    id: "branding-digital-experiences",
    slug: "branding-digital-experiences",
    number: "04",
    title: "Branding & Digital Experiences",
    description:
      "Identities and digital touchpoints that make a young brand look as established as it intends to become.",
    longDescription:
      "We define how your brand looks, sounds and moves — then carry it consistently across your website, product, social presence and launch material.",
    deliverables: ["Brand direction", "Logo & identity system", "Typography and colour", "Digital brand guidelines", "Launch assets"],
    outcome: "A brand that looks deliberate everywhere it appears.",
    metaTitle: "Branding & Digital Experiences",
    metaDescription: "Brand identity and digital experience design for startups and growing brands.",
    keywords: ["branding studio", "brand identity", "digital experience design"],
  },
  {
    id: "photography",
    slug: "photography",
    number: "05",
    title: "Photography",
    description:
      "Editorial, product and brand photography with a documentary eye — composed, natural and never over-staged.",
    longDescription:
      "We plan the shot list around how the images will actually be used, shoot on location or in studio, and deliver edited, colour-graded files ready for web, social and print.",
    deliverables: ["Creative direction & shot list", "On-location or studio shoots", "Editing & colour grading", "Web, social and print exports"],
    outcome: "Images that make your brand look as good as it is.",
    metaTitle: "Photography",
    metaDescription: "Editorial, product and brand photography for businesses that care about how they're seen.",
    keywords: ["brand photography", "product photography", "editorial photography"],
  },
  {
    id: "videography",
    slug: "videography",
    number: "06",
    title: "Videography",
    description:
      "Brand films, product videos and event coverage produced with a cinematic eye and a clear story.",
    longDescription:
      "We handle pre-production, direction and shooting so every frame supports a single, well-defined message — whether it's a launch film or a 15-second social cut.",
    deliverables: ["Concept & scripting", "Production & direction", "Event and product coverage", "Formats for web and social"],
    outcome: "A story people watch all the way through.",
    metaTitle: "Videography",
    metaDescription: "Cinematic video production for brand films, product launches and events.",
    keywords: ["video production", "brand films", "event videography"],
  },
  {
    id: "video-editing",
    slug: "video-editing",
    number: "07",
    title: "Video Editing",
    description:
      "Edit, pacing, colour and sound for footage you already have — shaped into content that holds attention.",
    longDescription:
      "Send us raw footage and a goal. We structure the story, cut for rhythm, grade for mood, mix the audio and deliver versions for every platform you publish on.",
    deliverables: ["Story structure & editing", "Colour grading", "Sound design & mix", "Captions and motion titles", "Platform-ready exports"],
    outcome: "Footage turned into content worth finishing.",
    metaTitle: "Video Editing",
    metaDescription: "Professional video editing, colour grading and sound for brands and creators.",
    keywords: ["video editing", "colour grading", "content editing"],
  },
  {
    id: "ai-automation",
    slug: "ai-automation",
    number: "08",
    title: "AI Automation",
    description:
      "Practical AI and automation that removes repetitive work from your operations — not a gimmick on top of it.",
    longDescription:
      "We identify where time is being lost, then design and build automations, AI assistants and document workflows with the guardrails needed to trust them in daily use.",
    deliverables: ["Workflow audit & feasibility", "LLM and API integration", "Document & data automation", "Evaluation and guardrails"],
    outcome: "Hours back every week, with outputs you can verify.",
    metaTitle: "AI Automation",
    metaDescription: "AI automation, LLM integration and workflow tooling for growing businesses.",
    keywords: ["AI automation", "LLM integration", "workflow automation"],
  },
  {
    id: "creative-technology",
    slug: "creative-technology",
    number: "09",
    title: "Creative Technology Solutions",
    description:
      "Ideas that need both a designer and an engineer in the room — interactive experiences, tools and prototypes.",
    longDescription:
      "For briefs that don't fit a template: interactive launches, campaign microsites, custom tools and experimental prototypes where craft and code have to work as one.",
    deliverables: ["Concept development", "Rapid prototyping", "Interactive web experiences", "Custom tools & integrations"],
    outcome: "The idea you couldn't find anyone else to build.",
    metaTitle: "Creative Technology Solutions",
    metaDescription: "Interactive experiences, prototypes and custom creative technology from a studio that both designs and engineers.",
    keywords: ["creative technology", "interactive experiences", "prototyping studio"],
  },
];

const PRESENTATION: Record<string, ServicePresentation> = {
  "website-design-development": {
    discipline: "Digital Products",
    idealFor: "Startups, local businesses and personal brands that need a credible online presence.",
    tags: ["Strategy", "Design", "Next.js"],
    image: IMAGERY.websites,
  },
  "web-applications": {
    discipline: "Digital Products",
    idealFor: "SaaS founders and teams replacing spreadsheets with real software.",
    tags: ["Product", "Full-stack", "Infrastructure"],
    image: IMAGERY.webApps,
  },
  "ui-ux-design": {
    discipline: "Digital Products",
    idealFor: "Products that work but feel confusing, or new products before a line of code.",
    tags: ["Research", "Prototyping", "Systems"],
    image: IMAGERY.uiux,
  },
  "branding-digital-experiences": {
    discipline: "Brand & Visual",
    idealFor: "New ventures and growing brands that have outgrown their first identity.",
    tags: ["Identity", "Guidelines", "Launch"],
    image: IMAGERY.branding,
  },
  photography: {
    discipline: "Brand & Visual",
    idealFor: "Brands, products, hospitality and people who need images with substance.",
    tags: ["Editorial", "Product", "Portrait"],
    image: { src: getPhoto("street-sculptor").src, alt: "Parvex photograph of an artisan carving a clay idol" },
  },
  videography: {
    discipline: "Brand & Visual",
    idealFor: "Launches, events and brands ready to tell their story in motion.",
    tags: ["Brand film", "Events", "Social"],
    image: { src: STAGE_PHOTO.src, alt: "Parvex photograph of a live stage performance in haze and spotlight" },
  },
  "video-editing": {
    discipline: "Brand & Visual",
    idealFor: "Creators and marketing teams with footage but no time to cut it.",
    tags: ["Edit", "Colour", "Sound"],
    image: IMAGERY.videoEditing,
  },
  "ai-automation": {
    discipline: "Intelligent Systems",
    idealFor: "Operations-heavy teams buried in documents, data entry and manual hand-offs.",
    tags: ["LLMs", "Workflows", "Integrations"],
    image: IMAGERY.automation,
  },
  "creative-technology": {
    discipline: "Intelligent Systems",
    idealFor: "Agencies, brands and founders with an unconventional brief.",
    tags: ["Interactive", "Prototypes", "Tools"],
    image: { src: getPhoto("landscape-observatory").src, alt: "Parvex photograph of a high-altitude observatory under storm clouds" },
  },
};

// Slugs used by earlier versions of the catalogue (and possibly still in the
// CMS) map onto their closest current counterpart.
const LEGACY_ALIASES: Record<string, string> = {
  "web-development": "website-design-development",
  "app-development": "web-applications",
  "ai-products": "ai-automation",
};

export function getServicePresentation(slug: string): ServicePresentation {
  return (
    PRESENTATION[slug] ??
    PRESENTATION[LEGACY_ALIASES[slug] ?? ""] ?? {
      discipline: "Digital Products",
      idealFor: "Businesses that want design and engineering held to the same standard.",
      tags: [],
      image: IMAGERY.studioInterior,
    }
  );
}

export const SERVICE_DISCIPLINES: { name: ServicePresentation["discipline"]; summary: string }[] = [
  { name: "Digital Products", summary: "Websites, applications and interfaces engineered to perform." },
  { name: "Brand & Visual", summary: "Identity, photography and film that give a brand presence." },
  { name: "Intelligent Systems", summary: "Automation and creative technology that do the heavy lifting." },
];
