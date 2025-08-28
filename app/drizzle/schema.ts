import { mysqlTable,int,varchar,text, time,  date,datetime,} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";
import { relations } from "drizzle-orm";
/**
 * USERS
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 191 }).notNull(),
  password: varchar("password", { length: 255 }).notNull(),
});
/** 
* EMPLOYEES
*/
export const employees = mysqlTable("employees", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 191 }).notNull(),
  privilege: varchar("privilege", { length: 100 }),
  sectionId:int("sec_id").references(()=>sections.id),
  departmentId:int("department_id").references(()=>departments.id)

});

/**
 * SECTIONS
 */
export const sections = mysqlTable("sections", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 191 }).notNull(),
});

/**
 * DEPARTMENTS
 */
export const departments = mysqlTable("departments", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 191 }).notNull(),
  sectionId:int("section_id").references(()=>sections.id),
});

/**
 * WORKING DAYS
 */
export const workingDays = mysqlTable("working_days", {
  id: int("id").autoincrement().primaryKey(),
  day: varchar("day", { length: 50 }).notNull(),
  startShift: time("start_shift").notNull(),
  endShift: time("end_shift").notNull(),
  employeeId:int("employee_id").references(()=>employees.id),
});

/**
 * VACATIONS
 */
export const vacations = mysqlTable("vacations", {
  id: int("id").autoincrement().primaryKey(),
  dateStart: date("date_start").notNull(),
  dateEnd: date("date_end").notNull(),
  type: varchar("type", { length: 100 }),
  reason: text("reason"),
  createdAt: datetime("created_at").default(sql`CURRENT_TIMESTAMP`),
  employeeId:int("employee_id").references(()=>employees.id),
});

/**
 * TIME ALLOWANCES
 */
export const timeAllowances = mysqlTable("time_allowances", {
  id: int("id").autoincrement().primaryKey(),
  startTime: time("start_time").notNull(),
  endTime: time("end_time").notNull(),
  type: varchar("type", { length: 100 }),
  reason: text("reason"),
  createdAt: datetime("created_at").default(sql`CURRENT_TIMESTAMP`),
  employeeId:int("employee_id").references(()=>employees.id),
});
/** 
 * infosystem
*/
export const infosystem=mysqlTable("info_system",{
  id :int("id").autoincrement().primaryKey(),
  doneby:varchar("done_by",{length:100}),
  describtion:varchar("describtion",{length:100}),
  userId:int("user_id").references(()=>users.id),
})

/*********************** relations***********************/
export const usersRelations = relations(users, ({ many }) => ({
  infosystems: many(infosystem),
}));

export const infosystemRelations = relations(infosystem, ({ one }) => ({
  users: one( users, {
    fields: [infosystem.userId],
    references: [users.id],
  }),
}));
export const sectionsRelations = relations(sections, ({ many }) => ({
  departments: many(departments),
  employees: many(employees), // كل موظف ممكن يكون تابع لقسم
}));

export const departmentsRelations = relations(departments, ({ one, many }) => ({
  section: one( sections, {
    fields: [departments.sectionId],
    references: [sections.id],
  }),
  employees: many(employees),
}));
export const employeesRelations = relations(employees, ({ one, many }) => ({
  department: one( departments, {
    fields: [employees.departmentId],
    references: [departments.id],
  }),
  section: one( sections, {
    fields: [employees.sectionId],
    references: [sections.id],
  }),
  workingDays: many(workingDays),
  vacations: many(vacations),
  timeAllowances: many(timeAllowances),
}));

export const workingDaysRelations = relations(workingDays, ({ one }) => ({
  employee: one(employees, {
    fields: [workingDays.employeeId],
    references: [employees.id],
  }),
}));

export const vacationsRelations = relations(vacations, ({ one }) => ({
  employee: one( employees, {
    fields: [vacations.employeeId],
    references: [employees.id],
  }),
}));

export const timeAllowancesRelations = relations(timeAllowances, ({ one }) => ({
  employee: one(employees, {
    fields: [timeAllowances.employeeId],
    references: [employees.id],
  }),
}));
