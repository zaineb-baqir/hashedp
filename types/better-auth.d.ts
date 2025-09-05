import "better-auth";

declare module "better-auth" {
  interface BetterAuthUser {
    role: string; // 👈 نضيف هنا role
    username: string; // إذا تريد تتأكد أن TS يعرف الـ username
  }
}
