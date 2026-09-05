import type { DefaultSession } from "next-auth";
import type { UserRole } from "@/lib/rbac";

declare module "next-auth" {
  interface User {
    id: string;
    role: UserRole;
  }

  interface Session {
    user: {
      id: string;
      role: UserRole;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: UserRole;
  }
}

// next-auth/jwt re-exports this from @auth/core/jwt, but module augmentation
// does not follow re-exports - the callback signatures inside next-auth
// itself reference @auth/core/jwt's JWT directly, so it must be augmented
// here too for `token.id`/`token.role` to type-check in auth.ts.
declare module "@auth/core/jwt" {
  interface JWT {
    id: string;
    role: UserRole;
  }
}
