import type { Config } from "drizzle-kit";

export default {
  schema: "./app/drizzle/schema.ts",   // مسار جداولك
  out: "./drizzle/migrations",         // مكان ملفات المايغريشن
  dialect: "mysql",                    // أو "postgresql" إذا DB Postgres
  dbCredentials: {
    host: process.env.DB_HOST ?? "localhost",
    user: process.env.DB_USER ?? "root",
    password: process.env.DB_PASS ?? "root1",
    database: process.env.DB_NAME ?? "mytest",
    port: Number(process.env.DB_PORT ?? 3306),
  },
} satisfies Config;
