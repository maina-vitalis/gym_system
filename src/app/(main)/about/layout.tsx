import { generatePageMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = generatePageMetadata({
  title: "About Tumaini Fitness Centre - Your Premier Gym in Kasarani, Nairobi",
  description:
    "Learn about Tumaini Fitness Centre's story, mission, and commitment to helping you achieve your fitness goals. Modern facilities, professional trainers, and comprehensive programs in Kasarani, Nairobi.",
  path: "/about",
  keywords: [
    "about tumaini fitness",
    "gym story nairobi",
    "fitness center history",
    "professional trainers kasarani",
    "modern gym facilities",
    "fitness mission",
    "gym values nairobi",
    "fitness center kastemil",
  ],
});

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
