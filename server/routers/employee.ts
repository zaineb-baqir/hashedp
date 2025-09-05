// server/routers/employee.ts
import { z } from "zod";
import { router, publicProcedure } from "../trpc";
import { db } from "../db";
import { employee, workingdays, section, department } from "../../app/drizzle/schema";
import {eq} from "drizzle-orm";
import { vacation ,timeallowenc} from "../../app/drizzle/schema";
export const employeeRouter = router({
update: publicProcedure
  .input(
    z.object({
      id: z.number(),
      name: z.string().optional(),
      privilege: z.string().optional(),
      sectionId: z.number().optional(),
      departmentId: z.number().optional(),
      workingDays: z.array(
        z.object({
          id: z.number().optional(),
          day: z.string(),
          startshift: z.string(),
          endshift: z.string(),
        })
      ).optional(),
      vacation: z.array(
        z.object({
          id: z.number().optional(),
          type: z.string(),
          reason: z.string(),
          dateStart: z.string(),
          dateEnd: z.string(),
        })
      ).optional(),
      timeallowances: z.array(
        z.object({
          id: z.number().optional(),
          type: z.string(),
          reason: z.string(),
          startTime: z.string(),
          endTime: z.string(),
        })
      ).optional(),
    })
  )
  .mutation(async ({ input }) => {
    const { id, name, privilege, sectionId, departmentId, workingDays, vacation, timeallowances } = input;
    await db.update(employee)
      .set({ name, privilege, sectionId, departmentId })
      .where(eq(employee.id, id));

    return { success: true };
  }),

  create: publicProcedure
    .input(
      z.object({
        name: z.string(),
        privilege: z.string(),
        section: z.string(),
        department: z.string(),
        workingDays: z.array(
          z.object({
            day: z.string(),
            startShift: z.string(),
            endShift: z.string(),
          })
        ),
      })
    )
    .mutation(async ({ input }) => {
      // أولاً: إدخال القسم (Section)
      const resultSection = await db.insert(section).values({
        name: input.section,
      }).$returningId();
      const sectionId = resultSection[0].id;

      // ثانياً: إدخال القسم/الشعبة (Department) وربطه بالقسم
      const resultDepartment = await db.insert(department).values({
        name: input.department,
        sectionId: sectionId,
      }).$returningId();
      const departmentId = resultDepartment[0].id;

      // ثالثاً: إدخال الموظف وربطه بالقسم والشعبة
      const resultEmployee = await db.insert(employee).values({
        name: input.name,
        privilege: input.privilege,
        sectionId: sectionId,
        departmentId: departmentId,
      }).$returningId();
      const employeeId = resultEmployee[0].id;

      // رابعاً: إدخال أيام العمل لكل يوم
      const workingDaysData = input.workingDays.map(wd => ({
        day: wd.day,
        startshift: wd.startShift,
        endshift: wd.endShift,
        employeeId,
      }));
      await db.insert(workingdays).values(workingDaysData);

      return { employeeId };
    }),

getAll: publicProcedure.query(async () => {
    return db.select().from(employee);
  }),
getById: publicProcedure.input(z.number()).query(async ({ input: id }) => {
    const emp = await db.select().from(employee).where(eq(employee.id,id)).limit(1);
 if (!emp[0]) return null;
    const dept = await db.select().from(department).where(eq(department.id,emp[0].departmentId)).limit(1);
    const sect = await db.select().from(section).where(eq(section.id,emp[0].sectionId)).limit(1);
    const workDays = await db.select().from(workingdays).where(eq(workingdays.employeeId,id));
    const vacationData = await db.query.vacation.findMany({ where: eq(vacation.employeeId, id), });
    const timeAllowanceData = await db.query.timeallowenc.findMany({ where: eq(timeallowenc.employeeId,id),});
    return {
      ...emp[0],
      departmentName: dept[0]?.name,
      sectionName: sect[0]?.name,
      workingDays: workDays,
      vacation:vacationData,
       timeallowances: timeAllowanceData,
    };
  }),

deleteEmployee:publicProcedure
.input(z.object({id:z.number()}))
.mutation(async({input})=>{
  return db.delete(employee).where(eq(employee.id,input.id))
 
}),

});
