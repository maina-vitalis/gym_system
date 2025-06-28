import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Join Tumaini Fitness | Member Registration",
  description:
    "Register as a member of Tumaini Fitness and start your fitness journey today. Access world-class facilities and professional training programs.",
  keywords:
    "gym registration, fitness membership, Tumaini Fitness, join gym, member signup",
  openGraph: {
    title: "Join Tumaini Fitness | Member Registration",
    description:
      "Register as a member of Tumaini Fitness and start your fitness journey today.",
    type: "website",
  },
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
