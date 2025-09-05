// server/routers/department.ts
import { z } from "zod";
import { router, publicProcedure } from "../trpc";
import { db } from "../db";
import { department } from "../../app/drizzle/schema";

export const departmentRouter = router({
  create: publicProcedure.input(z.object({ name: z.string() }))
    .mutation(({ input }) => db.insert(department).values(input)),

  getAll: publicProcedure.query(() => db.select().from(department)),
});
