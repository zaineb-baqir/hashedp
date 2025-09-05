import { z } from "zod";
import { router, publicProcedure } from "../trpc";
import { db } from "../db";
import { employee, timeallowenc } from "../../app/drizzle/schema";
import { eq, and, gte, lte } from "drizzle-orm";

function getMonthRange() {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
  return { start, end };
}

export const timeallowencRouter = router({
  
  create: publicProcedure
    .input(
      z.object({
        employeeName: z.string(),
        type: z.string(),
        reason: z.string().optional(),
        startTime: z.string(),
        endTime: z.string(),   
      })
    )
    .mutation(async ({ input }) => {
      const emp = await db.select().from(employee).where(eq(employee.name, input.employeeName)).limit(1);
      if (!emp[0]) {
        throw new Error("الموظف غير موجود");
      }
      const employeeId = emp[0].id;

      const [sh, sm] = input.startTime.split(":").map(Number);
      const [eh, em] = input.endTime.split(":").map(Number);
      const minutes = (eh * 60 + em) - (sh * 60 + sm);
      if (minutes <= 0) {
        throw new Error("وقت غير صحيح");
      }

      
      const { start, end } = getMonthRange();
      const allowances = await db
        .select()
        .from(timeallowenc)
        .where(
          and(
            eq(timeallowenc.employeeId, employeeId),
            gte(timeallowenc.createdAt, start),
            lte(timeallowenc.createdAt, end)
          )
        );

      const totalMinutes = allowances.reduce((sum, t) => {
        const [sth, stm] = t.startTime.split(":").map(Number);
        const [eth, etm] = t.endTime.split(":").map(Number);
        return sum + ((eth * 60 + etm) - (sth * 60 + stm));
      }, 0);

      if (totalMinutes + minutes > 240) {
        throw new Error("لقد استهلك الموظف كامل الساعات (4 ساعات) لهذا الشهر");
      }

      const result = await db.insert(timeallowenc).values({
        employeeId,
        type: input.type,
        reason: input.reason,
        startTime: input.startTime,
        endTime: input.endTime,
      }).$returningId();

      return { id: result[0].id, employeeId };
    }),

  getByEmployee: publicProcedure.input(z.string()).query(async ({ input }) => {
    const emp = await db.select().from(employee).where(eq(employee.name, input)).limit(1);
    if (!emp[0]) return [];
    return db.select().from(timeallowenc).where(eq(timeallowenc.employeeId, emp[0].id));
  }),

  getAll: publicProcedure.query(async () => {
    return db.select().from(timeallowenc);
  }),
});
