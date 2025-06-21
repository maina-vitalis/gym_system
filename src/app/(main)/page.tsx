"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useMembershipPlans } from "@/hooks/use-membership-plans";
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
import Script from "next/script";

export default function Home() {
  const { data: membershipPlansData, isLoading: plansLoading } =
    useMembershipPlans();

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Gym",
    name: "Tumaini Fitness Centre",
    alternateName: "TFC",
    description:
      "Modern fitness gym offering comprehensive fitness services including strength training, cardio, nutrition guidance, and kids karate programs in Kasarani, Nairobi.",
    url: "https://gym.tumaini.fitness",
    telephone: "+254700000000",
    email: "info@tumainifitness.co.ke",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Kastemil Business Centre",
      addressLocality: "Kasarani",
      addressRegion: "Nairobi",
      addressCountry: "KE",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "-1.2167",
      longitude: "36.9167",
    },
    openingHours: ["Mo-Fr 05:30-22:00", "Sa-Su 06:00-21:00"],
    priceRange: "KES 2,500 - KES 7,500",
    paymentAccepted: ["Cash", "Credit Card", "Mobile Money"],
    currenciesAccepted: "KES",
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Fitness Programs",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Cardio Training",
            description:
              "High-energy workouts combining rhythmic exercise with strength training",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Strength Training",
            description:
              "Professional strength training programs to build muscle and improve endurance",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Nutrition Guidance",
            description:
              "Personalized nutrition consultation for optimal health and fitness goals",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Kids Karate",
            description:
              "Martial arts program for children focusing on discipline and physical fitness",
          },
        },
      ],
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      bestRating: "5",
      ratingCount: "150",
    },
    review: [
      {
        "@type": "Review",
        author: {
          "@type": "Person",
          name: "Sarah Wanjiku",
        },
        reviewRating: {
          "@type": "Rating",
          ratingValue: "5",
          bestRating: "5",
        },
        reviewBody:
          "Tumaini Fitness has completely transformed my lifestyle. The trainers are professional and the equipment is top-notch.",
      },
    ],
  };

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
      <Script
        id="structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div className="min-h-screen">
        {/* Hero Section */}
        <section
          id="hero"
          className="relative min-h-screen flex items-center justify-center overflow-hidden"
        >
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <Image
              src="https://res.cloudinary.com/dl0w5seja/image/upload/f_auto,q_auto/tumaini_hero_wegjkt"
              alt="Tumaini Fitness Centre - Modern Gym Facility"
              fill
              className="object-cover object-center"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background"></div>
          </div>

          {/* Hero Content */}
          <div className="relative z-10 text-center text-white max-w-6xl mx-auto px-6 pt-20">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Transform Your Life at
              <br />
              <span className="text-yellow-400">Tumaini Fitness</span>
            </h1>

            <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-4xl mx-auto leading-relaxed">
              Nairobi&apos;s premier fitness center offering professional
              training, modern equipment, and a supportive community to help you
              achieve your fitness goals.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button
                size="lg"
                className="bg-yellow-500 hover:bg-yellow-600 rounded-full text-black font-semibold px-8 py-4 text-lg"
                onClick={() => {
                  const element = document.getElementById("contact");
                  element?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Start Your Journey
              </Button>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-20 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto">
              {/* Services Section */}
              <div className="mb-16">
                <h3 className="text-2xl md:text-3xl font-bold text-center mb-8 text-yellow-500">
                  Our Services
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                  <div className="text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-xl">
                    <div className="bg-yellow-100 dark:bg-yellow-900 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      <Dumbbell className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <h4 className="text-lg font-semibold mb-2 text-yellow-500">
                      Strength Training
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      Professional strength training programs to build muscle
                      and improve endurance
                    </p>
                  </div>
                  <div className="text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-xl">
                    <div className="bg-yellow-100 dark:bg-yellow-900 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      <Heart className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <h4 className="text-lg font-semibold mb-2 text-yellow-500">
                      Cardio Training
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      Aerobics, Zumba, Insanity, Circuit & Steps workout
                      sessions
                    </p>
                  </div>
                  <div className="text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-xl">
                    <div className="bg-yellow-100 dark:bg-yellow-900 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      <Target className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <h4 className="text-lg font-semibold mb-2 text-yellow-500">
                      Nutrition Training
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      Expert nutrition guidance for optimal health and fitness
                      goals
                    </p>
                  </div>
                </div>
              </div>

              {/* Schedule and Package Info */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 p-8 rounded-2xl">
                  <h3 className="text-2xl font-bold mb-6 text-yellow-600 dark:text-yellow-400">
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

                <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-700/50 p-8 rounded-2xl">
                  <h3 className="text-2xl font-bold mb-6 text-yellow-600 dark:text-yellow-400">
                    Package Details
                  </h3>
                  <div className="space-y-4 text-gray-700 dark:text-gray-300">
                    <div>
                      <p className="font-semibold text-yellow-500 mb-2">
                        Monthly Clients:
                      </p>
                      <p className="text-sm">
                        Access to all workout sessions, including strength,
                        aerobics, and Zumba, and can visit the gym at any time
                        of day.
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold text-yellow-500 mb-2">
                        Daily and Weekly Clients:
                      </p>
                      <p className="text-sm">
                        Limited to specific sessions in a day, each lasting 1:30
                        minutes. Weekly charges apply for 5 days.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Section */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div className="text-center">
                  <div className="bg-yellow-100 dark:bg-yellow-900 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                    <Users className="h-10 w-10 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <h3 className="text-3xl font-bold mb-2">500+</h3>
                  <p className="text-gray-600 dark:text-gray-300 font-medium">
                    Active Members
                  </p>
                </div>
                <div className="text-center">
                  <div className="bg-yellow-100 dark:bg-yellow-900 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                    <Trophy className="h-10 w-10 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <h3 className="text-3xl font-bold mb-2">5+</h3>
                  <p className="text-gray-600 dark:text-gray-300 font-medium">
                    Years Experience
                  </p>
                </div>
                <div className="text-center">
                  <div className="bg-yellow-100 dark:bg-yellow-900 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                    <Zap className="h-10 w-10 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <h3 className="text-3xl font-bold mb-2">20+</h3>
                  <p className="text-gray-600 dark:text-gray-300 font-medium">
                    Programs
                  </p>
                </div>
                <div className="text-center">
                  <div className="bg-yellow-100 dark:bg-yellow-900 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                    <Star className="h-10 w-10 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <h3 className="text-3xl font-bold mb-2">4.9/5</h3>
                  <p className="text-gray-600 dark:text-gray-300 font-medium">
                    Member Rating
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Programs Section */}
        <section id="programs" className="py-20 bg-gray-50 dark:bg-gray-800">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                Our Fitness Programs
              </h2>
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Choose from our comprehensive range of fitness programs designed
                to help you achieve your goals
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {programs.map((program, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow"
                >
                  <div className="flex items-center mb-6">
                    <div className="bg-yellow-100 dark:bg-yellow-900 rounded-full w-16 h-16 flex items-center justify-center mr-4">
                      <program.icon className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <h3 className="text-2xl font-bold">{program.title}</h3>
                  </div>

                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    {program.description}
                  </p>

                  <div className="mb-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
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
        <section id="pricing" className="py-20 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                Affordable Membership Plans
              </h2>
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Choose the perfect plan for your fitness journey. All plans
                include access to our modern facilities.
              </p>
            </div>

            {plansLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
              </div>
            ) : membershipPlans.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {membershipPlans.map((plan, index) => (
                  <div
                    key={plan.id}
                    className={`group relative overflow-hidden rounded-3xl transition-all duration-300 hover:scale-105 ${
                      index === 1 // Make middle plan popular
                        ? "bg-gradient-to-br from-yellow-500 to-yellow-600 text-white shadow-2xl transform scale-105"
                        : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-xl"
                    }`}
                  >
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-5">
                      <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/20 to-transparent"></div>
                    </div>

                    {index === 1 && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                        <div className="bg-white text-yellow-600 px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                          Most Popular
                        </div>
                      </div>
                    )}

                    <div className="relative p-8">
                      {/* Plan Header */}
                      <div className="text-center mb-8">
                        <div
                          className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 ${
                            index === 1
                              ? "bg-white/20 backdrop-blur-sm"
                              : "bg-yellow-100 dark:bg-yellow-900"
                          }`}
                        >
                          <Trophy
                            className={`h-8 w-8 ${
                              index === 1
                                ? "text-white"
                                : "text-yellow-600 dark:text-yellow-400"
                            }`}
                          />
                        </div>
                        <h3
                          className={`text-2xl font-bold mb-2 ${
                            index === 1
                              ? "text-white"
                              : "text-gray-900 dark:text-white"
                          }`}
                        >
                          {plan.name}
                        </h3>
                        <p
                          className={`text-sm ${
                            index === 1
                              ? "text-white/80"
                              : "text-gray-600 dark:text-gray-400"
                          }`}
                        >
                          {plan.description ||
                            `Perfect for your fitness journey`}
                        </p>
                      </div>

                      {/* Pricing */}
                      <div className="text-center mb-8">
                        <div className="flex items-baseline justify-center gap-1">
                          <span
                            className={`text-4xl font-bold ${
                              index === 1
                                ? "text-white"
                                : "text-gray-900 dark:text-white"
                            }`}
                          >
                            {formatCurrency(plan.price).replace("KES", "")}
                          </span>
                          <span
                            className={`text-lg ${
                              index === 1
                                ? "text-white/80"
                                : "text-gray-600 dark:text-gray-400"
                            }`}
                          >
                            KES
                          </span>
                        </div>
                        <p
                          className={`text-sm mt-1 ${
                            index === 1
                              ? "text-white/80"
                              : "text-gray-600 dark:text-gray-400"
                          }`}
                        >
                          per {formatDuration(plan.duration)}
                        </p>
                      </div>

                      {/* Features */}
                      <div className="space-y-4 mb-8">
                        {plan.features.map((feature, featureIndex) => (
                          <div
                            key={featureIndex}
                            className="flex items-center gap-3"
                          >
                            <div
                              className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
                                index === 1
                                  ? "bg-white/20"
                                  : "bg-green-100 dark:bg-green-900"
                              }`}
                            >
                              <div
                                className={`w-2 h-2 rounded-full ${
                                  index === 1 ? "bg-white" : "bg-green-500"
                                }`}
                              ></div>
                            </div>
                            <span
                              className={`text-sm ${
                                index === 1
                                  ? "text-white"
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
                        className={`w-full py-3 rounded-xl font-semibold transition-all duration-200 ${
                          index === 1
                            ? "bg-white text-yellow-600 hover:bg-gray-100 shadow-lg"
                            : "bg-yellow-500 hover:bg-yellow-600 text-black"
                        }`}
                        onClick={() => {
                          const element = document.getElementById("contact");
                          element?.scrollIntoView({ behavior: "smooth" });
                        }}
                      >
                        Get Started
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-12 max-w-md mx-auto">
                  <div className="bg-yellow-100 dark:bg-yellow-900 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Trophy className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    No membership plans available at the moment.
                  </p>
                  <Button
                    onClick={() => {
                      const element = document.getElementById("contact");
                      element?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="bg-yellow-500 hover:bg-yellow-600 text-black"
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
          className="py-20 bg-gray-50 dark:bg-gray-800"
        >
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                What Our Members Say
              </h2>
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Real stories from real people who transformed their lives at
                Tumaini Fitness
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg"
                >
                  <div className="flex justify-center mb-6">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-5 w-5 text-yellow-500 fill-current"
                      />
                    ))}
                  </div>

                  <p className="text-gray-600 dark:text-gray-300 mb-6 italic leading-relaxed">
                    &quot;{testimonial.content}&quot;
                  </p>

                  <div className="text-center">
                    <div className="font-semibold text-lg">
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
