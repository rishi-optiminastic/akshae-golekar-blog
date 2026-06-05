import { defineCollection, z } from "astro:content";

const blog = defineCollection({
  type: "content",
  // heroImage is a plain public URL (e.g. "/uploads/foo.png") written by Decap
  // CMS, served straight from /public. We intentionally do NOT use Astro's
  // image() helper here: it tries to import the file at build time, which fails
  // (ImageNotFound) for CMS public-folder paths and breaks the entire build.
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    heroImage: z.string().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
