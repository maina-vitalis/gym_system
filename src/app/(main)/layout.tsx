import { OfflineIndicator, PWAInstallPrompt } from "@/components/pwa";
import { Footer } from "@/components/shared/footer";
import { Navbar } from "@/components/shared/navbar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Tumaini Fitness Centre - Transform Your Fitness Journey",
    template: "%s | Tumaini Fitness Centre",
  },
  description:
    "Join Tumaini Fitness Centre in Kasarani, Nairobi for professional fitness training, modern equipment, and comprehensive wellness programs. Start your transformation today!",
};

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">{children}</main>
      <Footer />
      <PWAInstallPrompt />
      <OfflineIndicator />
    </>
  );
}
