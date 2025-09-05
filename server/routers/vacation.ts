import { publicProcedure, router } from "../trpc";
import { z } from "zod";
import { db } from "../db";
import { vacation } from "../../app/drizzle/schema";
import { employee } from "../../app/drizzle/schema";
import { eq } from "drizzle-orm";

export const vacationRouter = router({
  create: publicProcedure
    .input(
      z.object({
        employeeName: z.string(),
        dateStart: z.string(),
        dateEnd: z.string(),
        type: z.string(),
        reason: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const employees = await db
        .select()
        .from(employee)
        .where(eq(employee.name, input.employeeName))
        .limit(1);

      if (employees.length === 0) {
        throw new Error("الموظف غير موجود");
      }

      const employeeId = employees[0].id;

      await db.insert(vacation).values({
        employeeId,
        dateStart: new Date(input.dateStart),
        dateEnd: new Date(input.dateEnd),
        type: input.type,
        reason: input.reason,
      });

      return { success: true };
    }),

getByEmployeeName: publicProcedure
    .input(z.object({ fullName: z.string() }))
    .query(async ({ input }) => {
      const employees = await db.query.employee.findFirst({
        where: eq(employee.name, input.fullName),
      });

      if (!employees) return [];

      return db.query.vacation.findMany({
        where: eq(vacation.employeeId, employee.id),
      });
    }),

});

