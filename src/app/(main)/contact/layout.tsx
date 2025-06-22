import { generatePageMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = generatePageMetadata({
  title: "Contact Tumaini Fitness Centre - Get in Touch | Kasarani, Nairobi",
  description:
    "Contact Tumaini Fitness Centre in Kasarani, Nairobi. Get information about our fitness programs, membership plans, and services. Call +254700000000 or visit us at Kastemil Business Centre.",
  path: "/contact",
  keywords: [
    "contact tumaini fitness",
    "gym contact kasarani",
    "fitness center nairobi contact",
    "tumaini fitness phone number",
    "kastemil business centre gym",
    "gym membership inquiry",
    "fitness consultation nairobi",
    "contact gym nairobi",
    "tumaini fitness location",
    "gym contact details",
  ],
});

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
