import { router, publicProcedure } from "../trpc";
import { db } from "../db";
import { department, section, employee,workingdays } from "../../app/drizzle/schema";
import { like,eq } from "drizzle-orm";
import { z } from "zod";

export const orgRouter = router({
  updateSection: publicProcedure
  .input(z.object({ id: z.number(), name: z.string() }))
  .mutation(async ({ input }) => {
    await db.update(section).set({ name: input.name }).where(eq(section.id, input.id));
  return { success: true };
  }),

updateDepartment: publicProcedure
  .input(z.object({ id: z.number(), name: z.string() }))
  .mutation(async ({ input }) => {
    await db.update(department).set({ name: input.name }).where(eq(department.id, input.id));
  return { success: true };
  }),

  search: publicProcedure
    .input(z.string())
    .query(async ({ input }) => {
      const q = `%${input}%`;
      // الأقسام (Sections)
      const sectionsResult = await db
        .select()
        .from(section)
        .where(like(section.name, q));
         // الشعب (Departments)
      const departmentsResult = await db
        .select()
        .from(department)
        .where(like(department.name, q));

      // الموظفين (Employees)
      const employeesResult = await db
        .select()
        .from(employee)
        .where(like(employee.name, q));
       // الأيام (day في جدول workingdays)
      const daysResult = await db
        .selectDistinct({ day: workingdays.day })
        .from(workingdays)
        .where(like(workingdays.day, q));
      return {
        sections: sectionsResult,
        departments: departmentsResult,
        employees: employeesResult,
        days: daysResult, 
      };
    }),
      getEmployeesByDay: publicProcedure
    .input(z.string()) // مثال: "monday"
    .query(async ({ input }) => {
      return db
        .select({
          id: employee.id,
          fullName: employee.name,
          day: workingdays.day,
          startshift: workingdays.startshift,
          endshift: workingdays.endshift,
        })
        .from(workingdays)
        .innerJoin(employee, eq(workingdays.employeeId, employee.id))
        .where(eq(workingdays.day, input));
    }),
  
  getSections: publicProcedure.query(async () => {
    return db.select().from(section); // الأقسام موجودة في جدول section
  }),
  
  getDepartmentsBySection: publicProcedure
    .input(z.number()) // sectionId
    .query(async ({ input: sectionId }) => {
      return db.select().from(department).where(eq(department.sectionId, sectionId));
    }),

  getEmployeesByDepartment: publicProcedure
    .input(z.number()) // departmentId
    .query(async ({ input: departmentId }) => {
      return db.select().from(employee).where(eq(employee.departmentId, departmentId));
    }),
  addSections:publicProcedure
  .input(z.object({name:z.string().min(1)}))
  .mutation(async({input})=>{
    const[newSection]=await db.insert(section).values({name:input.name})
    return newSection
  }),
  getDepartments:publicProcedure.query(async()=>{
    return db.select().from(department);
  }),
  addDepartment:publicProcedure
  .input(z.object({name:z.string().min(1),
    sectionId:z.number(),
  }))
  .mutation(async({input})=>{
    const[newDepartment]=await db.insert(department).values({
      name:input.name,
      sectionId:input.sectionId,
    });
    return newDepartment;
  }),

transferEmployee: publicProcedure
  .input(z.object({
    employeeId: z.number(),
    newSectionId: z.number(),
    newDepartmentId: z.number(),
  }))
  .mutation(async ({ input }) => {
    await db.update(employee)
      .set({
        sectionId: input.newSectionId,
        departmentId: input.newDepartmentId,
      })
      .where(eq(employee.id, input.employeeId));
  }),


transferDepartment: publicProcedure
  .input(z.object({
    departmentId: z.number(),
    newSectionId: z.number(),
  }))
  .mutation(async ({ input }) => {
    // تحديث الشعبة نفسها
    await db.update(department)
      .set({ sectionId: input.newSectionId })
      .where(eq(department.id, input.departmentId));

    // تحديث كل الموظفين التابعين للشعبة
    await db.update(employee)
      .set({ sectionId: input.newSectionId })
      .where(eq(employee.departmentId, input.departmentId));
  }),
  
  getAllDepartments: publicProcedure.query(async () => {
    return db.select().from(department);
  }),
deleteDepartment: publicProcedure
  .input(z.object({ id: z.number() }))
  .mutation(async ({ input }) => {
    const employeesInDept = await db
      .select()
      .from(employee)
      .where(eq(employee.departmentId, input.id));

    if (employeesInDept.length > 0) {
      throw new Error("❌ لا يمكن حذف الشعبة لأنها تحتوي على موظفين");
    }

    return db.delete(department).where(eq(department.id, input.id));
  }),
deleteSection: publicProcedure
  .input(z.object({ id: z.number() }))
  .mutation(async ({ input }) => {
    // تحقق من وجود شعب تابعة للقسم
    const childDepartments = await db
      .select()
      .from(department)
      .where(eq(department.sectionId, input.id));

    if (childDepartments.length > 0) {
      throw new Error("❌ لا يمكن حذف القسم لأنه يحتوي على شعب");
    }

    // تحقق من الموظفين المرتبطين بالقسم مباشرة (إذا موجود)
    const employeesInSection = await db
      .select()
      .from(employee)
      .where(eq(employee.sectionId, input.id)); // حسب تصميمك

    if (employeesInSection.length > 0) {
      throw new Error("❌ لا يمكن حذف القسم لأنه يحتوي على موظفين");
    }

    return db.delete(section).where(eq(section.id, input.id));
  }),


});
