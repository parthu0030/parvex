/**
 * Sync case-study copy from src/data/projects.ts into the database.
 *
 *   npm run db:sync-projects -- auditgpt resume-analyzer movie-ticket
 *
 * `db:seed` never overwrites a project that already exists, so a database
 * seeded earlier keeps its old copy. This script deliberately overwrites the
 * content fields of the slugs you name (title, category, year, duration,
 * description, services, challenge, solution, research, development, cover
 * and thumbnail, technology, results and gallery) with the static record.
 * Publishing state, featured flag, display order and SEO fields are left as
 * they are. Slugs not passed on the command line are never touched.
 */
import { PrismaClient } from "@prisma/client";
import { getProjectBySlug } from "../src/data/projects";

const prisma = new PrismaClient();

async function externalMedia(url: string, altText: string) {
  return prisma.media.upsert({
    where: { publicId: `external:${url}` },
    update: { altText },
    create: {
      type: "IMAGE",
      category: "PROJECT",
      provider: "external",
      publicId: `external:${url}`,
      url,
      filename: url.split("/").pop() ?? "asset",
      mimeType: "image/jpeg",
      bytes: 0,
      altText,
    },
  });
}

async function sync(slug: string) {
  const p = getProjectBySlug(slug);
  if (!p) {
    console.error(`  ! "${slug}" is not in src/data/projects.ts — skipped`);
    return;
  }
  const existing = await prisma.project.findUnique({ where: { slug } });
  if (!existing) {
    console.error(`  ! "${slug}" is not in the database — run npm run db:seed first`);
    return;
  }

  const cover = await externalMedia(p.coverImage, p.coverImageAlt);
  const thumb = await externalMedia(p.thumbnail, p.thumbnailAlt);
  const galleryMedia = await Promise.all(p.gallery.map((g) => externalMedia(g.src, g.alt)));

  await prisma.$transaction([
    prisma.projectTechnology.deleteMany({ where: { projectId: existing.id } }),
    prisma.projectResult.deleteMany({ where: { projectId: existing.id } }),
    prisma.projectGalleryImage.deleteMany({ where: { projectId: existing.id } }),
    prisma.project.update({
      where: { id: existing.id },
      data: {
        title: p.title,
        category: p.category,
        year: p.year,
        duration: p.duration || null,
        description: p.description,
        services: p.services,
        challenge: p.challenge,
        solution: p.solution,
        research: p.research,
        development: p.development,
        coverImageId: cover.id,
        thumbnailId: thumb.id,
        technology: { create: p.technology.map((t, order) => ({ name: t.name, category: t.category, order })) },
        results: { create: p.results.map((r, order) => ({ ...r, order })) },
        gallery: {
          create: p.gallery.map((g, order) => ({ mediaId: galleryMedia[order].id, aspect: g.aspect, order })),
        },
      },
    }),
  ]);
  console.log(`  + synced "${slug}"`);
}

async function main() {
  const slugs = process.argv.slice(2);
  if (slugs.length === 0) {
    console.error("Pass the project slugs to sync, e.g. npm run db:sync-projects -- auditgpt resume-analyzer movie-ticket");
    process.exitCode = 1;
    return;
  }
  console.log(`Syncing ${slugs.length} project(s) from src/data/projects.ts...`);
  for (const slug of slugs) await sync(slug);
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
