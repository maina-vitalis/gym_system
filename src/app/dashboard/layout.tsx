"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { ModeToggle } from "@/components/ModeToggle";
import {
  OfflineIndicator,
  PWAInstallPrompt,
  PWAUpdatePrompt,
} from "@/components/pwa";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AuthUser, useSession } from "@/lib/auth-client";
import { usePathname, useRouter } from "next/navigation";
import * as React from "react";
import { useEffect } from "react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const user = session?.user as AuthUser | undefined;
  const isAuthenticated = !!session?.user;

  useEffect(() => {
    if (!isPending && !isAuthenticated) {
      router.push("/sign-in");
    }
  }, [isPending, isAuthenticated, router]);

  // Show loading spinner while checking authentication
  if (isPending) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Don't render anything if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  // Generate breadcrumbs from pathname
  const generateBreadcrumbs = () => {
    const segments = pathname.split("/").filter(Boolean);
    const breadcrumbs = [];

    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i];
      const href = "/" + segments.slice(0, i + 1).join("/");
      const isLast = i === segments.length - 1;

      // Format segment name
      let name = segment.charAt(0).toUpperCase() + segment.slice(1);
      if (name === "Dashboard") name = "Home";
      if (name === "Membership-plans") name = "Membership Plans";

      breadcrumbs.push({
        name,
        href,
        isLast,
      });
    }

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  return (
    <SidebarProvider>
      <AppSidebar user={user} />
      <SidebarInset>
        <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 border-border sticky top-0 z-50 flex h-16 shrink-0 items-center gap-2 border-b backdrop-blur transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex w-full items-end justify-between gap-2 px-4">
            <div>
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumb>
                <BreadcrumbList>
                  {breadcrumbs.map((breadcrumb) => (
                    <React.Fragment key={breadcrumb.href}>
                      <BreadcrumbItem className="hidden md:block">
                        {breadcrumb.isLast ? (
                          <BreadcrumbPage>{breadcrumb.name}</BreadcrumbPage>
                        ) : (
                          <BreadcrumbLink href={breadcrumb.href}>
                            {breadcrumb.name}
                          </BreadcrumbLink>
                        )}
                      </BreadcrumbItem>
                      {!breadcrumb.isLast && (
                        <BreadcrumbSeparator className="hidden md:block" />
                      )}
                    </React.Fragment>
                  ))}
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            <ModeToggle />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
      </SidebarInset>
      <PWAInstallPrompt />
      <PWAUpdatePrompt />
      <OfflineIndicator />
    </SidebarProvider>
  );
}
