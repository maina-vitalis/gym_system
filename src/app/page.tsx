"use client";

import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const { data: session, isPending } = useSession();
  const [isCheckingSetup, setIsCheckingSetup] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkSetupAndRedirect = async () => {
      if (isPending) return;

      try {
        // Check if setup is needed (no admin exists)
        const setupResponse = await fetch("/api/setup-admin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ check: true }),
        });

        if (setupResponse.status !== 409) {
          // No admin exists, redirect to setup
          router.push("/setup");
          return;
        }

        // Setup is complete, proceed with normal auth flow
        if (session) {
          // Redirect authenticated users to dashboard
          router.push("/dashboard");
        } else {
          // Redirect unauthenticated users to sign-in
          router.push("/sign-in");
        }
      } catch (error) {
        console.error("Setup check error:", error);
        // On error, assume setup is needed
        router.push("/setup");
      } finally {
        setIsCheckingSetup(false);
      }
    };

    checkSetupAndRedirect();
  }, [isPending, session, router]);

  if (isPending || isCheckingSetup) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return null; // Will redirect
}
