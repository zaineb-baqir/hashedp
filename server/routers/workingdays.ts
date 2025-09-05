// server/routers/shift.ts
import { z } from "zod";
import { router, publicProcedure } from "../trpc";
import { db } from "../db";
import { workingdays } from "../../app/drizzle/schema";
import {eq} from "drizzle-orm";
export const shiftRouter = router({

  create: publicProcedure
    .input(z.object({
      employeeId: z.number(),
      day: z.string(),          
      startshift: z.string(),  
      endshift: z.string(),     
    }))
    .mutation(({ input }) => 
      db.insert(workingdays).values(input)
    ),

  getByEmployee: publicProcedure
    .input(z.number())
    .query(({ input }) => 
      db.select()
        .from(workingdays)
        .where(eq(workingdays.employeeId, input))
    )
});
