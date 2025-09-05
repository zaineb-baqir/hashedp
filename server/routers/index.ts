import { router } from "../../server/trpc";
import { employeeRouter } from "./employee";
import { vacationRouter } from "./vacation";
import { orgRouter } from "./org";
import { timeallowencRouter } from "./timeallowence"; 
export const appRouter = router({
  employee: employeeRouter,
   vacation: vacationRouter,
   org: orgRouter,
   timeallowence: timeallowencRouter, 
});

export type AppRouter = typeof appRouter;
