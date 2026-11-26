import type { CaseStudyProject } from "@/types";
import { IMAGERY } from "./imagery";
import { getPhoto } from "./photography";

/**
 * PARVEX — master project data store (static fallback + CMS seed source).
 *
 * Content rules:
 *   - Describe what was built and why, in plain language.
 *   - No invented metrics, client names, interviews or testimonials. If a
 *     result hasn't been measured, it doesn't go on the site.
 *   - `results` holds product highlights (what the build does), not claimed
 *     business outcomes, unless those outcomes are verified.
 *   - Gallery images must be real project visuals or Parvex's own work —
 *     never stock photos captioned as screenshots.
 */
export const PROJECTS: CaseStudyProject[] = [
  {
    slug: "auditgpt",
    title: "AuditGPT",
    category: "AI Product",
    year: "2024",
    client: "Internal product",
    status: "Live",
    duration: "14 weeks",
    description:
      "An AI-assisted auditing workspace that reads large document sets, flags inconsistencies and explains every flag so reviewers stay in control.",
    coverImage: "/assets/projects/auditgpt.png",
    coverImageAlt: "AuditGPT compliance overview dashboard showing AI analysis flags and financial trends",
    thumbnail: "/assets/projects/auditgpt.png",
    thumbnailAlt: "AuditGPT AI audit log dashboard",
    services: ["Product Strategy", "UI/UX Design", "Web Development", "AI Integration"],
    challenge:
      "Reviewing financial and regulatory documents by hand is slow, repetitive and easy to get wrong at scale. Every additional document adds review time, and there is rarely a clear record of why something was — or wasn't — flagged.",
    solution:
      "AuditGPT adds an AI analysis layer that indexes documents, compares them against a defined rule set and surfaces only the items that need human judgement. Each flag carries its reasoning and source so a reviewer can accept, reject or escalate it with confidence. The goal is a faster review, not blind automation.",
    research:
      "We designed around one principle: the reviewer stays accountable, so the software must make every suggestion explainable. That shaped the interface — flags sit beside the source text, reasoning is always visible, and nothing is applied without a human decision.",
    development:
      "The build is split into three layers. An ingestion pipeline parses PDFs and stores chunked embeddings for retrieval. An analysis layer runs structured prompts against a rulebook and returns JSON with confidence scores and citations. A review interface presents flagged items inline with their rationale. Each layer is separated so it can be tested and improved independently.",
    technology: [
      { name: "Next.js", category: "Frontend" },
      { name: "TypeScript", category: "Frontend" },
      { name: "Tailwind CSS", category: "Frontend" },
      { name: "Node.js", category: "Backend" },
      { name: "PostgreSQL", category: "Database" },
      { name: "pgvector", category: "Database" },
      { name: "Prisma", category: "ORM" },
      { name: "OpenAI API", category: "AI" },
    ],
    gallery: [],
    results: [
      { metric: "Explainable", value: "Every flag cited", description: "Each finding links back to the exact source passage and the rule it was checked against." },
      { metric: "Human-in-the-loop", value: "Review, not replace", description: "Reviewers accept, reject or escalate every item — nothing is auto-applied." },
      { metric: "Modular", value: "Three layers", description: "Ingestion, analysis and review are separated so each can evolve on its own." },
    ],
    nextProject: "resume-analyzer",
  },

  {
    slug: "resume-analyzer",
    title: "Resume Analyzer",
    category: "AI Product",
    year: "2024",
    client: "Internal product",
    status: "Live",
    duration: "10 weeks",
    description:
      "Contextual candidate screening that matches resumes to roles by meaning, not keywords — and explains every ranking.",
    coverImage: IMAGERY.analytics.src,
    coverImageAlt: "Analytics dashboard on a laptop, representing candidate ranking and fit scores",
    thumbnail: IMAGERY.analytics.src,
    thumbnailAlt: "Resume Analyzer project cover",
    services: ["Product Strategy", "UI/UX Design", "Web Development", "AI Integration"],
    challenge:
      "Keyword-based applicant tracking filters out strong candidates who describe the same experience in different words. 'Built distributed systems' and 'microservices architecture' mean much the same thing — a keyword filter treats them as unrelated.",
    solution:
      "Resume Analyzer embeds job descriptions and resumes in the same semantic space and ranks candidates by conceptual fit. Recruiters see a ranked list with a plain-language explanation for each score, keeping the process transparent and reviewable.",
    research:
      "The product is built to support a recruiter's judgement rather than replace it. Rankings are a starting point; explanations make it easy to see why a candidate surfaced and to disagree when the model is wrong.",
    development:
      "A two-stage pipeline: resumes and job descriptions are converted to embeddings and compared with cosine similarity, normalised into a 0–100 fit score. A second language-model pass writes the explanation shown with each score. The frontend is a fast list view with expandable candidate cards designed for large batches.",
    technology: [
      { name: "React", category: "Frontend" },
      { name: "TypeScript", category: "Frontend" },
      { name: "Tailwind CSS", category: "Frontend" },
      { name: "Node.js", category: "Backend" },
      { name: "PostgreSQL", category: "Database" },
      { name: "OpenAI API", category: "AI" },
      { name: "Pinecone", category: "Vector DB" },
    ],
    gallery: [],
    results: [
      { metric: "Semantic", value: "Meaning over keywords", description: "Candidates are matched on what their experience means, not the exact words used." },
      { metric: "Transparent", value: "Explained scores", description: "Every fit score ships with a short, readable rationale." },
      { metric: "Batch-ready", value: "Built for volume", description: "Designed to review large applicant pools in one pass." },
    ],
    nextProject: "movie-ticket",
  },

  {
    slug: "movie-ticket",
    title: "Movie Ticket Booking",
    category: "Web Application",
    year: "2023",
    client: "Internal product",
    status: "Live",
    duration: "8 weeks",
    description:
      "A booking flow rebuilt around one fast seat-map interaction — from showtime to confirmation without the usual detours.",
    coverImage: "/assets/projects/movie-ticket-mono.jpg",
    coverImageAlt: "Rows of cinema seats facing the screen",
    thumbnail: "/assets/projects/movie-ticket-mono.jpg",
    thumbnailAlt: "Movie Ticket Booking project cover",
    services: ["UI/UX Design", "Web Development", "Payment Integration"],
    challenge:
      "Typical booking flows hide seat selection behind registration screens and repeated confirmations. The friction lands right before payment — exactly where it costs the most — and gets worse on busy release days.",
    solution:
      "Date, showtime and live seat availability sit on a single screen. Checkout is reduced to the fewest steps the flow allows, and real-time updates prevent the frustration of choosing a seat someone else has just taken.",
    research:
      "We set one constraint for the experience: a moviegoer should be able to go from landing to confirmed booking in a couple of minutes, without creating an account first. Every screen and step was measured against it.",
    development:
      "The seat map is an SVG component kept current through WebSocket updates. Payment loads asynchronously so it never blocks seat selection, and reservations use optimistic locking in PostgreSQL to handle concurrent requests for the same seat.",
    technology: [
      { name: "Next.js", category: "Frontend" },
      { name: "TypeScript", category: "Frontend" },
      { name: "Tailwind CSS", category: "Frontend" },
      { name: "PostgreSQL", category: "Database" },
      { name: "Prisma", category: "ORM" },
      { name: "Stripe", category: "Payments" },
      { name: "WebSockets", category: "Real-time" },
    ],
    gallery: [],
    results: [
      { metric: "One screen", value: "Showtime to seat", description: "Date, time and availability are chosen together instead of across several pages." },
      { metric: "Real-time", value: "Live availability", description: "Seat status updates instantly to avoid double selection." },
      { metric: "Safe checkout", value: "Locked reservations", description: "Concurrent requests for the same seat are resolved server-side." },
    ],
    nextProject: "photography-showcase",
  },

  {
    slug: "photography-showcase",
    title: "Photography Showcase",
    category: "Creative / Photography",
    year: "2024",
    client: "Parvex studio",
    status: "Live",
    duration: "6 weeks",
    description:
      "An editorial portfolio system for Parvex's own photography — designed so the images lead and the interface steps back.",
    coverImage: getPhoto("landscape-peak").src,
    coverImageAlt: getPhoto("landscape-peak").alt,
    thumbnail: getPhoto("landscape-peak").src,
    thumbnailAlt: "Photography Showcase cover — a lone snow peak above cloud",
    services: ["Creative Direction", "Photography", "UI/UX Design", "Web Development"],
    challenge:
      "Photography portfolios usually fail in one of two ways: so bare the images lose context, or so designed that the interface competes with the work. Our own landscape, cinematic and street work needed a home that felt as considered as the photographs.",
    solution:
      "A layout system that treats whitespace as the main design element. Series are grouped editorially, navigation stays quiet until it's needed and typography is kept to a minimum. The first thing a visitor notices is always the photograph.",
    research:
      "We curated before we designed: cutting duplicates and near-misses, sequencing each collection for rhythm, and committing to monochrome so landscapes, cinematic frames and street portraits read as one body of work.",
    development:
      "Images are exported at web-appropriate sizes, served responsively through Next.js image optimisation and lazy-loaded below the fold. A full-screen viewer supports keyboard navigation for anyone who wants to look closer.",
    technology: [
      { name: "Next.js", category: "Frontend" },
      { name: "TypeScript", category: "Frontend" },
      { name: "Tailwind CSS", category: "Frontend" },
      { name: "Next/Image", category: "Media" },
    ],
    gallery: [
      { src: getPhoto("landscape-range").src, alt: getPhoto("landscape-range").alt, aspect: "landscape" },
      { src: getPhoto("street-sculptor").src, alt: getPhoto("street-sculptor").alt, aspect: "portrait" },
      { src: getPhoto("landscape-observatory").src, alt: getPhoto("landscape-observatory").alt, aspect: "portrait" },
      { src: getPhoto("street-mother").src, alt: getPhoto("street-mother").alt, aspect: "portrait" },
    ],
    results: [
      { metric: "Curated", value: "Three collections", description: "Landscape, Cinematic Frames and Editorial, sequenced as a single monochrome body of work." },
      { metric: "Lightweight", value: "Web-sized exports", description: "Camera originals are never sent to visitors." },
      { metric: "Accessible", value: "Keyboard viewer", description: "Full-screen viewing with arrow-key navigation and descriptive alt text." },
    ],
    nextProject: "videography-showcase",
  },

  {
    slug: "videography-showcase",
    title: "Videography Showcase",
    category: "Creative / Videography",
    year: "2024",
    client: "Parvex studio",
    status: "Concept",
    duration: "In development",
    description:
      "A video portfolio concept built to load instantly and present film work without third-party players getting in the way.",
    coverImage: IMAGERY.videography.src,
    coverImageAlt: IMAGERY.videography.alt,
    thumbnail: IMAGERY.videography.src,
    thumbnailAlt: "Videography Showcase concept cover — a film slate on set",
    services: ["Creative Direction", "UI/UX Design", "Web Development", "Video Optimization"],
    challenge:
      "Video portfolios are hard to get right on the web: heavy files, unreliable autoplay and embedded players that break the visual language of the site.",
    solution:
      "The concept uses short, silent preview loops on hover and a native full-screen player on click — no third-party embeds, no tracking scripts, and a consistent interface from first frame to last.",
    research: "",
    development:
      "Each film is encoded into a lightweight preview loop plus standard and high-quality versions, delivered through a media CDN. The player uses the browser's native video element with a custom control layer and handles iOS playback rules explicitly.",
    technology: [
      { name: "Next.js", category: "Frontend" },
      { name: "TypeScript", category: "Frontend" },
      { name: "Cloudinary", category: "Media" },
      { name: "FFmpeg", category: "Video Processing" },
    ],
    gallery: [],
    results: [],
    nextProject: "auditgpt",
  },
];

/** Get a single project by slug. Returns undefined if not found. */
export function getProjectBySlug(slug: string): CaseStudyProject | undefined {
  return PROJECTS.find((p) => p.slug === slug);
}

/** Get the next project in the sequence. */
export function getNextProject(currentSlug: string): CaseStudyProject | undefined {
  const current = getProjectBySlug(currentSlug);
  if (!current) return undefined;
  return getProjectBySlug(current.nextProject);
}

/** All project slugs — used for generateStaticParams. */
export function getAllProjectSlugs(): string[] {
  return PROJECTS.map((p) => p.slug);
}
