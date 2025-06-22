import { Footer } from "@/components/shared/footer";
import { Navbar } from "@/components/shared/navbar";
import { generatePageMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = generatePageMetadata({
  title:
    "Tumaini Fitness Centre - Premier Gym in Kasarani, Nairobi | Transform Your Fitness Journey",
  description:
    "Transform your fitness journey at Tumaini Fitness Centre in Kasarani, Nairobi. Modern equipment, professional trainers, cardio & strength training, nutrition guidance, and kids karate programs. Affordable membership plans starting from KES 2,500.",
  path: "/",
  keywords: [
    "tumaini fitness centre",
    "gym kasarani nairobi",
    "fitness center kastemil",
    "strength training nairobi",
    "cardio training kasarani",
    "gym membership kenya",
    "personal training nairobi",
    "nutrition guidance gym",
    "kids karate nairobi",
    "affordable gym nairobi",
    "modern gym facilities",
    "professional fitness trainers",
    "zumba classes nairobi",
    "aerobics kasarani",
  ],
});

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
