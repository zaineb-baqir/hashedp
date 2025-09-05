// db/schema.ts
import {mysqlTable,serial,int,varchar,text,time,date,datetime,} from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";
import { sql } from "drizzle-orm";

/**
 * users
 */
export const users = mysqlTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 191 }).notNull(),
  password: varchar("password", { length: 191 }).notNull(),
  role: varchar("role", { length: 50 }).notNull().default("user"), 
});

/**
 * section
 */
export const section = mysqlTable("section", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 191 }).notNull(),
});

/**
 * department
 * Note: diagram showed department.sectionId -> section.id
 */
export const department = mysqlTable("department", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 191 }).notNull(),
  sectionId: int("sectionId"), // FK -> section.id (nullable if a department might not belong to a section)
});

/**
 * employee
 */
export const employee = mysqlTable("employee", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 191 }).notNull(),
  privilege: varchar("privilege", { length: 191 }).notNull(),
  sectionId: int("sectionId").notNull(), // FK -> section.id
  departmentId: int("departmentId").notNull(), // FK -> department.id
});

/**
 * workingdays
 */
export const workingdays = mysqlTable("workingdays", {
  id: serial("id").primaryKey(),
  day: varchar("day", { length: 50 }).notNull(), // e.g. "monday"
  startshift: time("startshift").notNull(),
  endshift: time("endshift").notNull(),
  employeeId: int("employeeId").notNull(), // FK -> employee.id
});

/**
 * vacation
 */
export const vacation = mysqlTable("vacation", {
  id: serial("id").primaryKey(),
  employeeId: int("employeeId").notNull(), // FK -> employee.id
  dateStart: date("dateStart").notNull(),
  dateEnd: date("dateEnd").notNull(),
  type: varchar("type", { length: 100 }).default(""), // e.g. "annual", "sick"
  reason: text("reason"),
  createdAt: datetime("createdAt").default(sql`CURRENT_TIMESTAMP`),
});

/**
 * timeallowenc (time allowances)
 */
export const timeallowenc = mysqlTable("timeallowenc", {
  id: serial("id").primaryKey(),
  startTime: time("startTime").notNull(),
  endTime: time("endTime").notNull(),
  type: varchar("type", { length: 100 }).default(""),
  reason: text("reason"),
  createdAt: datetime("createdAt").default(sql`CURRENT_TIMESTAMP`),
  employeeId: int("employeeId").notNull(), // FK -> employee.id
});

/**
 * infosystem
 */
export const infosystem = mysqlTable("infosystem", {
  id: serial("id").primaryKey(),
  description: text("description"),
  userId: int("userId").notNull(), // FK -> users.id
  createdAt: datetime("createdAt").default(sql`CURRENT_TIMESTAMP`),
});

/* -------------------------
   Relations (using drizzle's relations helper)
   ------------------------- */

/* employee relations */
export const employeeRelations = relations(employee, ({ one, many }) => ({
  section: one(section, {
    fields: [employee.sectionId],
    references: [section.id],
  }),
  department: one(department, {
    fields: [employee.departmentId],
    references: [department.id],
  }),
  workingdays: many(workingdays),
  vacations: many(vacation),
  timeallowences: many(timeallowenc),
}));

/* section relations */
export const sectionRelations = relations(section, ({ many }) => ({
  employees: many(employee),
  departments: many(department),
}));

/* department relations */
export const departmentRelations = relations(department, ({ one, many }) => ({
  section: one(section, {
    fields: [department.sectionId],
    references: [section.id],
  }),
  employees: many(employee),
}));

/* workingdays relations */
export const workingdaysRelations = relations(workingdays, ({ one }) => ({
  employee: one(employee, {
    fields: [workingdays.employeeId],
    references: [employee.id],
  }),
}));

/* vacation relations */
export const vacationRelations = relations(vacation, ({ one }) => ({
  employee: one(employee, {
    fields: [vacation.employeeId],
    references: [employee.id],
  }),
}));

/* timeallowenc relations */
export const timeallowencRelations = relations(timeallowenc, ({ one }) => ({
  employee: one(employee, {
    fields: [timeallowenc.employeeId],
    references: [employee.id],
  }),
}));

/* infosystem relations */
export const infosystemRelations = relations(infosystem, ({ one }) => ({
  user: one(users, {
    fields: [infosystem.userId],
    references: [users.id],
  }),
}));
