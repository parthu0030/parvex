import "server-only";
import { prisma } from "@/lib/db/prisma";
import { SERVICES as STATIC_SERVICES } from "@/data/services";
import { RETIRED_SERVICE_SLUGS } from "@/data/services";

// The static fallback has no uploaded media; components resolve imagery via
// getServicePresentation(slug) in src/data/services.ts.
function staticServices() {
  return STATIC_SERVICES.map((service, order) => ({
    ...service,
    slug: service.slug ?? service.id,
    longDescription: service.longDescription ?? null,
    deliverables: service.deliverables ?? [],
    outcome: service.outcome ?? null,
    order,
    published: true,
    media: null as { url: string; altText: string | null } | null,
  }));
}

export async function getPublishedServices() {
  try {
    return await prisma.service.findMany({
      where: { published: true, slug: { notIn: RETIRED_SERVICE_SLUGS } },
      orderBy: { order: "asc" },
      include: { media: true },
    });
  } catch {
    console.warn("Using static service fallback; database query failed.");
    return staticServices();
  }
}

export async function getServiceBySlug(slug: string) {
  try {
    if (RETIRED_SERVICE_SLUGS.includes(slug)) return null;
    return await prisma.service.findFirst({
      where: { slug, published: true },
      include: { media: true },
    });
  } catch {
    console.warn(`Using static service fallback for "${slug}"; database query failed.`);
    return staticServices().find((service) => service.slug === slug) ?? null;
  }
}
