"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useMembershipPlans } from "@/hooks/use-membership-plans";
import {
  generateJsonLd,
  getBreadcrumbSchema,
  getOrganizationSchema,
  getWebsiteSchema,
} from "@/lib/seo";
import {
  Calendar,
  Clock,
  Dumbbell,
  Heart,
  Shield,
  Star,
  Target,
  Trophy,
  Users,
  Zap,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import heroImage from "./../../../public/hero.png";

export default function Home() {
  const { data: membershipPlansData, isLoading: plansLoading } =
    useMembershipPlans();

  // Structured Data for SEO
  const organizationSchema = getOrganizationSchema();
  const websiteSchema = getWebsiteSchema();
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: "https://gym.tumainifitness.co.ke" },
  ]);

  const jsonLdProps = generateJsonLd([
    organizationSchema,
    websiteSchema,
    breadcrumbSchema,
  ]);

  const programs = [
    {
      title: "Cardio Training",
      description:
        "High-energy workouts that combine rhythmic exercise with strength training to boost cardiovascular fitness and tone muscles.",
      schedule: "Monday to Friday: 6:00am - 7:00am & 6:00pm - 7:00pm",
      icon: Heart,
      features: ["Cardiovascular Health", "Weight Loss", "Endurance Building"],
    },
    {
      title: "Strength Training",
      description:
        "Build power and confidence with our strength training programs designed to increase muscle, improve endurance, and boost overall strength.",
      schedule: "Available all day with personal trainers",
      icon: Dumbbell,
      features: ["Muscle Building", "Bone Density", "Metabolic Boost"],
    },
    {
      title: "Nutrition Guidance",
      description:
        "Fuel your fitness journey with personalized nutrition guidance to help you achieve your health goals, whether it&apos;s weight loss, muscle gain, or maintaining a balanced diet.",
      schedule: "Consultation sessions available",
      icon: Target,
      features: ["Meal Planning", "Weight Management", "Health Optimization"],
    },
    {
      title: "Kids Karate",
      description:
        "Empower your child with confidence, discipline, and physical fitness through our Kids Karate program in a fun and safe environment.",
      schedule: "Weekdays: 4:00pm - 5:00pm, Saturdays: 9:00am - 10:00am",
      icon: Shield,
      features: ["Discipline", "Confidence", "Physical Fitness"],
    },
  ];

  const testimonials = [
    {
      name: "Sarah Wanjiku",
      role: "Marketing Executive",
      content:
        "Tumaini Fitness has completely transformed my lifestyle. The trainers are professional and the equipment is top-notch. I&apos;ve lost 15kg in 6 months!",
      rating: 5,
    },
    {
      name: "John Kamau",
      role: "Software Developer",
      content:
        "The nutrition guidance program helped me understand proper eating habits. Combined with their strength training, I&apos;ve never felt stronger.",
      rating: 5,
    },
    {
      name: "Grace Akinyi",
      role: "Teacher",
      content:
        "My daughter loves the Kids Karate program. She&apos;s more confident and disciplined at home. The instructors are amazing with children.",
      rating: 5,
    },
  ];

  // Format currency helper
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
    }).format(amount);
  };

  // Format duration helper
  const formatDuration = (days: number) => {
    if (days >= 365) {
      const years = Math.floor(days / 365);
      const remainingDays = days % 365;
      if (remainingDays === 0) {
        return `${years} year${years > 1 ? "s" : ""}`;
      }
      const months = Math.floor(remainingDays / 30);
      return `${years} year${years > 1 ? "s" : ""} ${months} month${
        months > 1 ? "s" : ""
      }`;
    } else if (days >= 30) {
      const months = Math.floor(days / 30);
      const remainingDays = days % 30;
      if (remainingDays === 0) {
        return `${months} month${months > 1 ? "s" : ""}`;
      }
      return `${months} month${months > 1 ? "s" : ""} ${remainingDays} day${
        remainingDays > 1 ? "s" : ""
      }`;
    } else {
      return `${days} day${days > 1 ? "s" : ""}`;
    }
  };

  // Get active membership plans from API
  const membershipPlans =
    membershipPlansData?.data?.filter((plan) => plan.isActive) || [];

  return (
    <>
      <script {...jsonLdProps} />

      <div className="min-h-screen">
        {/* Hero Section */}
        <section
          id="hero"
          className="relative flex min-h-screen items-center justify-center overflow-hidden"
        >
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <Image
              src={heroImage}
              alt="Tumaini Fitness Centre - Modern Gym Facility"
              fill
              className="object-cover object-center"
              priority
            />
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/60"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent dark:from-[#101828]"></div>
          </div>

          {/* Hero Content */}
          <div className="relative z-10 mx-auto max-w-6xl px-6 pt-20 text-center text-white">
            <div className="space-y-8">
              <div className="space-y-6">
                <h1 className="text-3xl leading-tight font-bold tracking-tight md:text-5xl">
                  Transform Your Life at{" "}
                  <span className="text-yellow-500">Tumaini Fitness</span>
                </h1>

                <p className="mx-auto max-w-4xl text-xl leading-relaxed text-white/90">
                  Professional training, modern equipment, and a supportive
                  community to help you achieve your fitness goals in the heart
                  of Nairobi.
                </p>
              </div>

              <div className="flex flex-col justify-center gap-4 sm:flex-row">
                <Link href={"/contact"}>
                  <Button className="rounded-full bg-yellow-500">
                    Start Your Journey
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="bg-white py-20 dark:bg-gray-900">
          <div className="container mx-auto px-6">
            <div className="mx-auto max-w-6xl">
              {/* Services Section */}
              <div className="mb-16">
                <h3 className="mb-8 text-center text-2xl font-bold text-yellow-500 md:text-3xl">
                  Our Services
                </h3>
                <div className="mx-auto grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-3">
                  <div className="rounded-xl bg-gray-50 p-6 text-center dark:bg-gray-800">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900">
                      <Dumbbell className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <h4 className="mb-2 text-lg font-semibold text-yellow-500">
                      Strength Training
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Professional strength training programs to build muscle
                      and improve endurance
                    </p>
                  </div>
                  <div className="rounded-xl bg-gray-50 p-6 text-center dark:bg-gray-800">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900">
                      <Heart className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <h4 className="mb-2 text-lg font-semibold text-yellow-500">
                      Cardio Training
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Aerobics, Zumba, Insanity, Circuit & Steps workout
                      sessions
                    </p>
                  </div>
                  <div className="rounded-xl bg-gray-50 p-6 text-center dark:bg-gray-800">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900">
                      <Target className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <h4 className="mb-2 text-lg font-semibold text-yellow-500">
                      Nutrition Training
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Expert nutrition guidance for optimal health and fitness
                      goals
                    </p>
                  </div>
                </div>
              </div>

              {/* Schedule and Package Info */}
              <div className="mb-16 grid grid-cols-1 gap-12 lg:grid-cols-2">
                <div className="rounded-2xl bg-gradient-to-br from-yellow-50 to-yellow-100 p-8 dark:from-yellow-900/20 dark:to-yellow-800/20">
                  <h3 className="mb-6 text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                    Gym Daily Schedule
                  </h3>
                  <div className="space-y-4 text-gray-700 dark:text-gray-300">
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-yellow-500" />
                      <div>
                        <p className="font-semibold">Operation Time:</p>
                        <p className="text-sm">
                          5:30AM - 9:00PM (Monday to Friday)
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-yellow-500" />
                      <div>
                        <p className="font-semibold">Saturday:</p>
                        <p className="text-sm">7:00AM - 8:00PM</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Users className="h-5 w-5 text-yellow-500" />
                      <div>
                        <p className="font-semibold">Group Sessions:</p>
                        <p className="text-sm">
                          Monday - Friday 6:00am - 7:00am & 6:00pm - 7:00pm
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 p-8 dark:from-gray-800/50 dark:to-gray-700/50">
                  <h3 className="mb-6 text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                    Package Details
                  </h3>
                  <div className="space-y-4 text-gray-700 dark:text-gray-300">
                    <div>
                      <p className="mb-2 font-semibold text-yellow-500">
                        Monthly Clients:
                      </p>
                      <p className="text-sm">
                        Access to all workout sessions, including strength,
                        aerobics, and Zumba, and can visit the gym at any time
                        of day.
                      </p>
                    </div>
                    <div>
                      <p className="mb-2 font-semibold text-yellow-500">
                        Daily and Weekly Clients:
                      </p>
                      <p className="text-sm">
                        Limited to specific sessions in a day, each lasting 1hr
                        : 30 minutes. Weekly charges apply for{" "}
                        <span className="text-yellow-500">5 days.</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Section */}
              <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
                <div className="text-center">
                  <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900">
                    <Users className="h-10 w-10 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <h3 className="mb-2 text-3xl font-bold">500+</h3>
                  <p className="font-medium text-gray-600 dark:text-gray-300">
                    Active Members
                  </p>
                </div>
                <div className="text-center">
                  <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900">
                    <Trophy className="h-10 w-10 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <h3 className="mb-2 text-3xl font-bold">5+</h3>
                  <p className="font-medium text-gray-600 dark:text-gray-300">
                    Years Experience
                  </p>
                </div>
                <div className="text-center">
                  <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900">
                    <Zap className="h-10 w-10 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <h3 className="mb-2 text-3xl font-bold">20+</h3>
                  <p className="font-medium text-gray-600 dark:text-gray-300">
                    Programs
                  </p>
                </div>
                <div className="text-center">
                  <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900">
                    <Star className="h-10 w-10 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <h3 className="mb-2 text-3xl font-bold">4.9/5</h3>
                  <p className="font-medium text-gray-600 dark:text-gray-300">
                    Member Rating
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Programs Section */}
        <section id="programs" className="bg-gray-50 py-20 dark:bg-gray-800">
          <div className="container mx-auto px-6">
            <div className="mb-16 text-center">
              <h2 className="mb-6 text-3xl font-bold md:text-5xl">
                Our Fitness Programs
              </h2>
              <p className="mx-auto max-w-3xl text-lg leading-relaxed text-gray-600 md:text-xl dark:text-gray-300">
                Choose from our comprehensive range of fitness programs designed
                to help you achieve your goals
              </p>
            </div>

            <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-2">
              {programs.map((program, index) => (
                <div
                  key={index}
                  className="rounded-2xl bg-white p-8 shadow-lg transition-shadow hover:shadow-xl dark:bg-gray-900"
                >
                  <div className="mb-6 flex items-center">
                    <div className="mr-4 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900">
                      <program.icon className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <h3 className="text-2xl font-bold">{program.title}</h3>
                  </div>

                  <p className="mb-4 leading-relaxed text-gray-600 dark:text-gray-300">
                    {program.description}
                  </p>

                  <div className="mb-4">
                    <p className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <Clock className="h-4 w-4" />
                      {program.schedule}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {program.features.map((feature, featureIndex) => (
                      <Badge
                        key={featureIndex}
                        variant="secondary"
                        className="text-xs"
                      >
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="bg-white py-20 dark:bg-gray-900">
          <div className="container mx-auto px-6">
            <div className="mb-16 text-center">
              <h2 className="mb-6 text-3xl font-bold md:text-5xl">
                Affordable Membership Plans
              </h2>
              <p className="mx-auto max-w-3xl text-lg leading-relaxed text-gray-600 md:text-xl dark:text-gray-300">
                Choose the perfect plan for your fitness journey. All plans
                include access to our modern facilities.
              </p>
            </div>

            {plansLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-yellow-500"></div>
              </div>
            ) : membershipPlans.length > 0 ? (
              <div className="mx-auto grid max-w-6xl grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-8">
                {membershipPlans.map((plan, index) => (
                  <div
                    key={plan.id}
                    className={`group relative rounded-3xl transition-all duration-300 hover:scale-105 ${
                      plan.name === "monthly"
                        ? "scale-105 transform bg-yellow-400 text-black shadow-2xl dark:bg-yellow-500 dark:text-white"
                        : "border border-gray-200 bg-white hover:shadow-xl dark:border-gray-700 dark:bg-gray-800"
                    }`}
                  >
                    {/* Background Pattern */}
                    <div className="absolute inset-0 overflow-hidden rounded-3xl opacity-5">
                      <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/20 to-transparent"></div>
                    </div>

                    {/* Most Popular Badge - Simple Corner Design */}
                    {index === 2 && (
                      <div className="absolute top-4 right-4 z-20">
                        <div className="rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 px-3 py-1.5 text-white shadow-lg ring-2 ring-white/20">
                          <div className="flex items-center gap-1.5">
                            <svg
                              className="h-3 w-3"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                                clipRule="evenodd"
                              />
                            </svg>
                            <span className="text-xs font-bold tracking-wide">
                              POPULAR
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="relative overflow-hidden rounded-3xl p-8">
                      {/* Plan Header */}
                      <div className="mb-8 text-center">
                        <div
                          className={`mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl ${
                            index === 2
                              ? "bg-white/20 backdrop-blur-sm"
                              : "bg-yellow-100 dark:bg-yellow-900"
                          }`}
                        >
                          <Trophy
                            className={`h-8 w-8 ${
                              index === 2
                                ? "text-primary"
                                : "text-yellow-600 dark:text-yellow-400"
                            }`}
                          />
                        </div>
                        <h3
                          className={`mb-2 text-2xl font-bold ${
                            index === 2
                              ? "text-foreground"
                              : "text-gray-900 dark:text-white"
                          }`}
                        >
                          {plan.name}
                        </h3>
                        <p
                          className={`text-sm ${
                            index === 2
                              ? "text-foreground"
                              : "text-gray-600 dark:text-gray-400"
                          }`}
                        >
                          {plan.description ||
                            `Perfect for your fitness journey`}
                        </p>
                      </div>

                      {/* Pricing */}
                      <div className="mb-8 text-center">
                        <div className="flex items-baseline justify-center gap-1">
                          <span
                            className={`text-4xl font-bold ${
                              index === 2
                                ? "text-foreground"
                                : "text-gray-900 dark:text-white"
                            }`}
                          >
                            {formatCurrency(plan.price).replace("KES", "")}
                          </span>
                          <span
                            className={`text-lg ${
                              index === 2
                                ? "text-foreground"
                                : "text-gray-600 dark:text-gray-400"
                            }`}
                          >
                            KES
                          </span>
                        </div>
                        <p
                          className={`mt-1 text-sm ${
                            index === 2
                              ? "text-foreground"
                              : "text-gray-600 dark:text-gray-400"
                          }`}
                        >
                          for {formatDuration(plan.duration)}
                        </p>
                      </div>

                      {/* Features */}
                      <div className="mb-8 space-y-4">
                        {plan.features.map((feature, featureIndex) => (
                          <div
                            key={featureIndex}
                            className="flex items-center gap-3"
                          >
                            <div
                              className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full ${
                                index === 2
                                  ? "bg-primary/20"
                                  : "bg-green-100 dark:bg-green-900"
                              }`}
                            >
                              <div
                                className={`h-2 w-2 rounded-full ${
                                  index === 2 ? "bg-primary" : "bg-green-500"
                                }`}
                              ></div>
                            </div>
                            <span
                              className={`text-sm ${
                                index === 2
                                  ? "text-foreground"
                                  : "text-gray-700 dark:text-gray-300"
                              }`}
                            >
                              {feature}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* CTA Button */}
                      <Button
                        className={`w-full rounded-xl py-3 font-semibold transition-all duration-200 ${
                          index === 2
                            ? "bg-white text-yellow-600 shadow-lg hover:bg-gray-100"
                            : "bg-yellow-500 text-black hover:bg-yellow-600"
                        }`}
                        asChild
                      >
                        <Link href={"/register"}>Get Started</Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center">
                <div className="mx-auto max-w-md rounded-2xl bg-gray-50 p-12 dark:bg-gray-800">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900">
                    <Trophy className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <p className="mb-4 text-gray-600 dark:text-gray-300">
                    No membership plans available at the moment.
                  </p>
                  <Button
                    onClick={() => {
                      const element = document.getElementById("contact");
                      element?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="bg-yellow-500 text-black hover:bg-yellow-600"
                  >
                    Contact Us for More Info
                  </Button>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Testimonials Section */}
        <section
          id="testimonials"
          className="bg-gray-50 py-20 dark:bg-gray-800"
        >
          <div className="container mx-auto px-6">
            <div className="mb-16 text-center">
              <h2 className="mb-6 text-3xl font-bold md:text-5xl">
                What Our Members Say
              </h2>
              <p className="mx-auto max-w-3xl text-lg leading-relaxed text-gray-600 md:text-xl dark:text-gray-300">
                Real stories from real people who transformed their lives at
                Tumaini Fitness
              </p>
            </div>

            <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-3">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="rounded-2xl bg-white p-8 shadow-lg dark:bg-gray-900"
                >
                  <div className="mb-6 flex justify-center">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-5 w-5 fill-current text-yellow-500"
                      />
                    ))}
                  </div>

                  <p className="mb-6 leading-relaxed text-gray-600 italic dark:text-gray-300">
                    &quot;{testimonial.content}&quot;
                  </p>

                  <div className="text-center">
                    <div className="text-lg font-semibold">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
