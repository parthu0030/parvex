import type { SEOFields } from "./seo";

export interface Service extends Partial<SEOFields> {
  id: string;
  slug?: string;
  number: string;
  title: string;
  description: string;
  /** Longer-form copy for a future dedicated /services/[slug] page. */
  longDescription?: string;
  deliverables?: string[];
  /** Short, business-value outcome shown on the /services page cards. */
  outcome?: string;
}

/** Presentation-only details layered on top of a (CMS or static) service. */
export interface ServicePresentation {
  discipline: "Digital Products" | "Brand & Visual" | "Intelligent Systems";
  /** Who this service is a good fit for. */
  idealFor: string;
  /** Short tags rendered beside the service title. */
  tags: string[];
  /** `mono` marks a colour original that should render in monochrome. */
  image: { src: string; alt: string; mono?: boolean };
}
