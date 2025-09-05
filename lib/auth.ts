// lib/auth.ts
import { betterAuth } from "better-auth";
import { username } from "better-auth/plugins/username";
import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "root1",
  database: "mytest",
});

export const auth = betterAuth({ // ❌ ما نحتاج إيميل
  usernameAndPassword: { enabled: true },
  plugins: [username()],
   // ✅ يضيف حقل username
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "user",
        input: false,// 👈 الافتراضي user
      },
    },
  },
  adapter: {
    type: "mysql",
    db: pool,
  },
});
