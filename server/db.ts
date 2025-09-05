import { drizzle, MySql2DrizzleConfig } from "drizzle-orm/mysql2";
import * as schema from "../app/drizzle/schema"; 
import { createPool } from "mysql2/promise";


const pool = createPool({
  host: "localhost",
  user: "root",
  password: "root1",
  database: "mytest",
});

const config: MySql2DrizzleConfig<typeof schema> = {
  schema,
  mode: "default" as const,
};


export const db = drizzle(pool, config);
