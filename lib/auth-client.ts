import { createAuthClient } from "better-auth/react";
//import { auth } from "./auth";

export const authClient = createAuthClient({
  baseURL: "http://localhost:3000",
});

export type Session = typeof authClient.$Infer.Session;
