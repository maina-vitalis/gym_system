import { AuthUser } from "@/types";
import { useSession as useNextAuthSession } from "next-auth/react";

export type { AuthUser };

export function useSession() {
  const { data: session, status } = useNextAuthSession();

  return {
    data: session,
    isPending: status === "loading",
    isAuthenticated: !!session?.user,
  };
}
