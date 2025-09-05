import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "../../../../server/routers/index";

// هذا الـ handler يتعامل مع GET و POST
const handler = (req: Request) => {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: () => ({}),
  });
};

// نصدره لـ GET و POST
export { handler as GET, handler as POST };
