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
  // Content verified against each repository's source (Nov 2026): features
  // are only listed where code implements them; README-only claims are left
  // out. Years come from commit history.
  {
    slug: "auditgpt",
    title: "AuditGPT",
    subtitle: "Financial Risk AI",
    category: "Fintech",
    year: "2026",
    client: "Internal product",
    status: "Live",
    duration: "",
    description:
      "A forensic-style risk analysis app for NSE-listed companies. AuditGPT pulls multi-year financials and market data, scores fraud risk out of 100 with explained red flags, and turns the result into a dashboard and a downloadable audit report.",
    // Cover: interface composition of AuditGPT's real dashboard modules
    // (Fraud Risk Score, Risk Breakdown, price history, Red Flags, AI summary)
    // with placeholder data — the live dashboard sits behind sign-in.
    coverImage: "/assets/projects/covers/auditgpt.jpg",
    coverImageAlt: "AuditGPT risk dashboard with a fraud risk score of 34, price history chart, risk breakdown and red flags, shown with sample data",
    thumbnail: "/assets/projects/covers/auditgpt.jpg",
    thumbnailAlt: "AuditGPT financial risk dashboard",
    liveUrl: "https://auditgpt-financial-risk-ai-yylt.vercel.app/login",
    repoUrl: "https://github.com/parthu0030/auditgpt-financial-risk-ai",
    services: ["UI/UX Design", "Full-stack Development", "Financial Data Engineering", "Risk Analytics"],
    challenge:
      "Spotting earnings-quality and balance-sheet warning signs — revenue that outruns cash flow, rising debt, shrinking margins, negative operating cash flow, sudden growth spikes — usually means reading years of financial statements by hand. For an individual investor or analyst checking a listed company, that is slow, inconsistent and easy to get wrong.",
    solution:
      "AuditGPT automates the first pass. Search any NSE-listed company and it fetches multi-year statements and market data, runs a transparent risk engine over them, and explains every point it adds: what was flagged, how severe it is and why it matters. Analyses can be saved, compared across a portfolio and exported as a PDF audit report.",
    research:
      "The guiding principle was explainability. A risk score is only useful if you can see where it came from, so the engine is deterministic and rule-based rather than a black box: every finding carries a category, a severity and the points it contributed, and the points are totalled by category in a score breakdown.",
    development:
      "A React 18 and Vite single-page app talks to a FastAPI backend over REST, with server-sent events for report generation. The API is split into routers — analysis, reports, portfolio, history, watchlist, live prices, market data and auth — over services for the fraud engine, multi-year statement fetching from Yahoo Finance (with optional Financial Modeling Prep and Alpha Vantage fallbacks), peer comparison and report writing. MongoDB, via the async Motor driver, stores users, analysis history, watchlists and daily price history. The frontend runs on Vercel and the API on Render, and Docker Compose brings up the full stack locally.",
    features: [
      { title: "Explainable fraud-risk score", detail: "A rule engine checks revenue against cash flow, debt trend, margins, operating cash flow, growth spikes and valuation, then gives a risk score out of 100 with red flags graded Critical, High or Medium and a per-category breakdown." },
      { title: "Search across NSE-listed companies", detail: "Autocomplete over a bundled list of NSE-listed companies, with symbol resolution that handles DVR shares, SME listings and demergers." },
      { title: "Multi-year financial trends", detail: "Revenue, profit, debt, cash-flow and balance-sheet charts with anomaly markers, plus a six-part risk breakdown: revenue stability, profitability, debt, cash-flow health, valuation and capital efficiency." },
      { title: "Market context", detail: "A live price ticker aware of Indian market hours, and up to ten years of daily price history with 1M to MAX ranges." },
      { title: "Peer comparison", detail: "Same-sector companies compared on growth, margins and leverage, with similar-company suggestions." },
      { title: "Portfolio analysis and watchlist", detail: "Analyse up to ten companies together for an average portfolio risk level, and keep a personal watchlist." },
      { title: "History and PDF audit reports", detail: "Signed-in analyses are saved to history, and a multi-page PDF report is generated in the browser with jsPDF." },
      { title: "On-demand written report", detail: "A plain-language risk narrative can be generated for any analysis and streamed to the page, written by a rule-based report engine." },
    ],
    technology: [
      { name: "React 18", category: "Frontend" },
      { name: "Vite", category: "Frontend" },
      { name: "React Router", category: "Frontend" },
      { name: "Tailwind CSS", category: "Frontend" },
      { name: "Framer Motion", category: "Frontend" },
      { name: "Recharts", category: "Frontend" },
      { name: "FastAPI", category: "Backend" },
      { name: "Uvicorn", category: "Backend" },
      { name: "Pydantic", category: "Backend" },
      { name: "MongoDB (Motor)", category: "Database" },
      { name: "JWT + bcrypt", category: "Auth" },
      { name: "Google OAuth 2.0", category: "Auth" },
      { name: "Yahoo Finance (yfinance)", category: "Data" },
      { name: "NSE market data", category: "Data" },
      { name: "jsPDF + html2canvas", category: "Reports" },
      { name: "Vercel", category: "Deployment" },
      { name: "Render", category: "Deployment" },
      { name: "Docker Compose", category: "Deployment" },
    ],
    gallery: [],
    results: [],
    nextProject: "resume-analyzer",
  },

  {
    slug: "resume-analyzer",
    title: "Ready4Hire",
    subtitle: "Resume Analyzer",
    category: "AI Product",
    year: "2026",
    client: "Internal product",
    status: "Live",
    duration: "",
    description:
      "An AI career coach for job seekers. Ready4Hire reads a PDF resume, scores it for ATS readiness, lists what is missing with concrete fixes, then runs an adaptive mock interview built from that resume and ends with a scored review.",
    // Cover: the live Ready4Hire app (ready4hire-app.vercel.app) — landing
    // hero (cropped above its placeholder stat tiles) with the real
    // How It Works workflow layered on top.
    coverImage: "/assets/projects/covers/resume-analyzer.jpg",
    coverImageAlt: "The Ready4Hire web app: landing page with “Analyze my resume”, and its workflow — sign up, upload resume, AI analysis, data storage",
    thumbnail: "/assets/projects/covers/resume-analyzer.jpg",
    thumbnailAlt: "Ready4Hire resume analysis app",
    liveUrl: "https://ready4hire-app.vercel.app",
    repoUrl: "https://github.com/parthu0030/Ready4Hire",
    services: ["UI/UX Design", "Full-stack Development", "AI Integration"],
    challenge:
      "Job seekers rarely know how an applicant tracking system will read their resume, and generic interview practice ignores what is actually on it. The result is guesswork: resumes that underperform, and interviews prepared for in the abstract.",
    solution:
      "Ready4Hire makes the resume the starting point for both. Upload a PDF and a language model turns it into a structured profile — skills, projects, education and experience — with an ATS-readiness score, gaps and specific suggestions. The same profile then seeds a mock interview whose questions adapt to the strength of each answer, finished with a written verdict and a score out of 10.",
    research:
      "Two decisions shaped the product. Resume first: questions come from the candidate's own background, not a generic bank. Adaptive pacing: after a weak answer the interviewer eases into simpler, guiding questions, and after a strong one it goes deeper — closer to a real conversation than a fixed quiz.",
    development:
      "Two apps live in one repository. The React 19 and Vite client signs users in with Firebase Authentication and sends the ID token with every request. The Express 5 API verifies that token with firebase-admin, accepts PDF uploads through Multer, extracts the text with pdfjs-dist and calls Groq's llama-3.1-8b-instant model for parsing, interview questions and final feedback. MongoDB, through Mongoose, stores users, resume analyses and interview logs, each scoped to its owner. The client runs on Vercel and the API on Render.",
    features: [
      { title: "PDF resume parsing", detail: "Drag-and-drop upload; text is extracted with pdfjs-dist and structured into skills, projects, education and experience by Groq's llama-3.1-8b-instant." },
      { title: "ATS-readiness score", detail: "A 0–100 score from the model, with a rule-based estimate used when the model\u2019s score is missing or invalid." },
      { title: "Gaps and suggestions", detail: "What the resume is missing and specific improvements, saved with each analysis." },
      { title: "Resume-grounded mock interview", detail: "Questions are generated from the parsed resume; weaker answers get simpler follow-ups and stronger ones get deeper questions." },
      { title: "Voice mode", detail: "Questions are read aloud and answers transcribed in the browser with the Web Speech API, sending automatically after a pause." },
      { title: "Scored interview feedback", detail: "A strict reviewer prompt returns a pass/fail verdict, strengths, weaknesses, three improvement tips and a score out of 10." },
      { title: "Personal history", detail: "Past resume analyses and interviews in one profile, with the average ATS score across resumes." },
      { title: "Private accounts", detail: "Firebase sign-in with email or Google; every API call is verified server-side and each user only sees their own data." },
    ],
    technology: [
      { name: "React 19", category: "Frontend" },
      { name: "Vite", category: "Frontend" },
      { name: "React Router", category: "Frontend" },
      { name: "Tailwind CSS 4", category: "Frontend" },
      { name: "Axios", category: "Frontend" },
      { name: "Web Speech API", category: "Frontend" },
      { name: "Node.js", category: "Backend" },
      { name: "Express 5", category: "Backend" },
      { name: "Multer", category: "Backend" },
      { name: "pdfjs-dist", category: "Backend" },
      { name: "Groq · llama-3.1-8b-instant", category: "AI" },
      { name: "MongoDB (Mongoose)", category: "Database" },
      { name: "Firebase Authentication", category: "Auth" },
      { name: "firebase-admin", category: "Auth" },
      { name: "Vercel", category: "Deployment" },
      { name: "Render", category: "Deployment" },
    ],
    gallery: [],
    results: [],
    nextProject: "movie-ticket",
  },

  {
    slug: "movie-ticket",
    title: "Movie Ticket Booking System",
    subtitle: "QuickShow",
    category: "Web Application",
    year: "2026",
    client: "Internal product",
    status: "Live",
    duration: "",
    description:
      "QuickShow, a full-stack cinema booking app: browse what's showing, pick a theatre, date and showtime, choose seats on a map that blocks seats already taken, and check out in three steps — with every booking saved to your profile.",
    // Cover: the live QuickShow booking app's home page on a cinema screen,
    // above rows of theatre seats.
    coverImage: "/assets/projects/covers/movie-ticket.jpg",
    coverImageAlt: "The QuickShow movie booking app shown on a cinema screen above rows of theatre seats",
    thumbnail: "/assets/projects/covers/movie-ticket.jpg",
    thumbnailAlt: "QuickShow movie ticket booking app on a cinema screen",
    liveUrl: "https://movie-ticket-booking-liart-beta.vercel.app",
    repoUrl: "https://github.com/parthu0030/MovieTicketBooking",
    services: ["UI/UX Design", "Full-stack Development"],
    challenge:
      "Booking a cinema seat should take a minute, but many flows scatter the important choices — film, theatre, time and seat — across separate screens, and only reveal that a seat has gone at the very end.",
    solution:
      "QuickShow keeps the whole decision in one guided flow. A three-step wizard — show, seats, payment — keeps every choice visible; seats already booked for that exact show are blocked on the map before you pick, and the server checks again for conflicts before confirming. Confirmed bookings appear in your profile with a downloadable ticket.",
    research: "",
    development:
      "A React 18 and Vite front end, styled with Tailwind CSS and animated with Framer Motion, holds the film catalogue, theatres and showtimes. An Express 4 API backed by MongoDB, through Mongoose, stores accounts, bookings and payment records. A show is identified by film, theatre, date and time, and the API rejects any booking that includes a seat already confirmed for that show. The front end runs on Vercel and the API on Render.",
    features: [
      { title: "Film catalogue", detail: "Now-showing and upcoming titles with genre filters, sorting, search and embedded trailers." },
      { title: "Theatres and showtimes", detail: "Theatres across Ahmedabad, Delhi, Bangalore and Mumbai, the next seven days and four daily slots; today\u2019s slots close 30 minutes before showtime and are greyed out." },
      { title: "Interactive seat map", detail: "Rows A–H facing the screen, with available, selected and already-booked seats clearly marked, and up to eight seats per booking." },
      { title: "Double-booking checks", detail: "Seats confirmed for that show are blocked when it is selected, and every seat is re-checked on the server before the booking is saved." },
      { title: "Three-step checkout", detail: "Show, seats, then payment, with a card or UPI form — simulated, so no money is taken." },
      { title: "My bookings", detail: "A profile listing every booking with ticket and spend totals, plus a downloadable ticket." },
    ],
    technology: [
      { name: "React 18", category: "Frontend" },
      { name: "Vite", category: "Frontend" },
      { name: "React Router", category: "Frontend" },
      { name: "Tailwind CSS", category: "Frontend" },
      { name: "Framer Motion", category: "Frontend" },
      { name: "Heroicons", category: "Frontend" },
      { name: "Node.js", category: "Backend" },
      { name: "Express 4", category: "Backend" },
      { name: "MongoDB (Mongoose)", category: "Database" },
      { name: "bcrypt", category: "Auth" },
      { name: "Vercel", category: "Deployment" },
      { name: "Render", category: "Deployment" },
    ],
    gallery: [],
    results: [],
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
    // The full portfolio renders on this page (PhotographyPortfolio), so a
    // separate gallery would only repeat photographs.
    gallery: [],
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
