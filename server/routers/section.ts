// server/routers/section.ts
import { z } from "zod";
import { router, publicProcedure } from "../trpc";
import { db } from "../db";
import { section } from "../../app/drizzle/schema";

export const sectionRouter = router({
  create: publicProcedure.input(z.object({ name: z.string() }))
    .mutation(({ input }) => db.insert(section).values(input)),

  getAll: publicProcedure.query(() => db.select().from(section)),
});
