import { generatePageMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = generatePageMetadata({
  title:
    "Nutrition Guidance - Expert Nutrition Advice | Tumaini Fitness Centre",
  description:
    "Get expert nutrition guidance at Tumaini Fitness Centre in Kasarani, Nairobi. Learn about essential macronutrients, meal planning, and personalized nutrition consultation to fuel your fitness journey.",
  path: "/nutrition",
  keywords: [
    "nutrition guidance nairobi",
    "fitness nutrition kasarani",
    "meal planning kenya",
    "nutrition consultation",
    "diet advice gym",
    "healthy eating nairobi",
    "sports nutrition",
    "weight management nutrition",
    "fitness diet plan",
    "macronutrients guide",
    "nutrition counseling nairobi",
  ],
});

export default function NutritionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
