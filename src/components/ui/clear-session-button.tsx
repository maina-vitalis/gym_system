"use client";

import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { Button } from "./button";

export function ClearSessionButton() {
  const handleClearSession = async () => {
    try {
      // Clear NextAuth session
      await signOut({
        callbackUrl: "/sign-in",
        redirect: true,
      });

      // Clear any additional browser storage
      if (typeof window !== "undefined") {
        localStorage.clear();
        sessionStorage.clear();

        // Clear all cookies
        document.cookie.split(";").forEach((c) => {
          const eqPos = c.indexOf("=");
          const name = eqPos > -1 ? c.substr(0, eqPos) : c;
          document.cookie =
            name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
        });
      }
    } catch (error) {
      console.error("Error clearing session:", error);
      // Force redirect even if signOut fails
      if (typeof window !== "undefined") {
        window.location.href = "/sign-in";
      }
    }
  };

  return (
    <Button
      onClick={handleClearSession}
      variant="outline"
      size="sm"
      className="text-red-600 hover:text-red-700 hover:bg-red-50"
    >
      <LogOut className="h-4 w-4 mr-2" />
      Clear Session
    </Button>
  );
}
