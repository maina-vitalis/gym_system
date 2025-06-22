"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  generateJsonLd,
  getBreadcrumbSchema,
  getFAQSchema,
  getOrganizationSchema,
} from "@/lib/seo";
import {
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
import { useRouter } from "next/navigation";

export default function AboutPage() {
  const router = useRouter();

  // Structured Data for SEO
  const organizationSchema = getOrganizationSchema();
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: "https://gym.tumaini.fitness" },
    { name: "About Us", url: "https://gym.tumaini.fitness/about" },
  ]);

  const faqSchema = getFAQSchema([
    {
      question: "What services does Tumaini Fitness Centre offer?",
      answer:
        "We offer comprehensive fitness services including strength training, cardio training (Aerobics, Zumba, Insanity, Circuit training), nutrition guidance, and kids karate programs.",
    },
    {
      question: "Where is Tumaini Fitness Centre located?",
      answer:
        "We are located at Kastemil Business Centre in Kasarani, Nairobi, Kenya.",
    },
    {
      question: "What are your operating hours?",
      answer:
        "We are open Monday to Friday from 5:30 AM to 9:00 PM, and Saturday from 7:00 AM to 8:00 PM. Group sessions are available Monday to Friday from 6:00-7:00 AM and 6:00-7:00 PM.",
    },
    {
      question: "Do you offer kids programs?",
      answer:
        "Yes, we offer kids programs including Karate, Dance Training, Team Building, and Life Skills. Classes are held on Saturdays from 10:30 AM to 12:30 PM and weekdays during holidays.",
    },
  ]);

  const jsonLdProps = generateJsonLd([
    organizationSchema,
    breadcrumbSchema,
    faqSchema,
  ]);

  const handleContactClick = () => {
    router.push("/#contact");
  };

  const handleDashboardAccess = () => {
    router.push("/dashboard");
  };

  return (
    <>
      <script {...jsonLdProps} />

      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <Image
              src="https://res.cloudinary.com/dl0w5seja/image/upload/f_auto,q_auto/tumaini_hero_wegjkt"
              alt="Tumaini Fitness Centre - About Us"
              fill
              className="object-cover object-center"
              priority
            />
            <div className="absolute inset-0 bg-black/70"></div>
          </div>

          {/* Hero Content */}
          <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-6 pt-20">
            <Badge
              variant="secondary"
              className="mb-6 bg-yellow-500 text-black font-semibold text-sm px-4 py-2"
            >
              About Tumaini Fitness Centre
            </Badge>

            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Welcome to{" "}
              <span className="text-yellow-400">Tumaini Fitness Centre</span>
            </h1>

            <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-3xl mx-auto leading-relaxed">
              Your fitness goals are our mission. Discover our story, services,
              and commitment to your health.
            </p>
          </div>
        </section>

        {/* Main About Content */}
        <section className="py-20 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto">
              {/* Introduction */}
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-8">
                  About{" "}
                  <span className="text-yellow-500">
                    Tumaini Fitness Centre
                  </span>
                </h2>
                <div className="max-w-4xl mx-auto space-y-6">
                  <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                    Tumaini Fitness Centre (
                    <span className="text-yellow-500 font-semibold">TFC</span>)
                    is a modern fitness gym located in Nairobi, Kenya, at
                    Kastemil Business Centre, Kasarani Constituency. We offer
                    comprehensive fitness services that help our clients get in
                    shape by losing excess fat, building muscles, and promoting
                    a healthy balanced lifestyle through expert nutrition
                    training.
                  </p>
                  <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                    Our services are{" "}
                    <span className="text-yellow-500 font-semibold">
                      affordable
                    </span>{" "}
                    and are provided by{" "}
                    <span className="text-yellow-500 font-semibold">
                      professional instructors
                    </span>{" "}
                    who prioritize integrity. At Tumaini Fitness Centre, your
                    fitness goals are our mission.
                  </p>
                </div>
              </div>

              {/* Services Section */}
              <div className="mb-20">
                <h3 className="text-2xl md:text-3xl font-bold text-center mb-12 text-yellow-500">
                  Our Services
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                  <div className="group bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 p-8 rounded-2xl hover:shadow-lg transition-all duration-300">
                    <div className="bg-yellow-100 dark:bg-yellow-900 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                      <Dumbbell className="h-10 w-10 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <h4 className="text-xl font-bold mb-4 text-yellow-600 dark:text-yellow-400 text-center">
                      Strength Training
                    </h4>
                    <p className="text-gray-700 dark:text-gray-300 text-center leading-relaxed">
                      Professional strength training programs designed to build
                      muscle, improve endurance, and boost overall physical
                      strength with expert guidance.
                    </p>
                  </div>

                  <div className="group bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-700/50 p-8 rounded-2xl hover:shadow-lg transition-all duration-300">
                    <div className="bg-yellow-100 dark:bg-yellow-900 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                      <Heart className="h-10 w-10 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <h4 className="text-xl font-bold mb-4 text-yellow-600 dark:text-yellow-400 text-center">
                      Cardio Training
                    </h4>
                    <p className="text-gray-700 dark:text-gray-300 text-center leading-relaxed">
                      High-energy cardio sessions including Aerobics, Zumba,
                      Insanity, Circuit training, and Steps workout to boost
                      cardiovascular health.
                    </p>
                  </div>

                  <div className="group bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 p-8 rounded-2xl hover:shadow-lg transition-all duration-300">
                    <div className="bg-yellow-100 dark:bg-yellow-900 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                      <Target className="h-10 w-10 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <h4 className="text-xl font-bold mb-4 text-yellow-600 dark:text-yellow-400 text-center">
                      Nutrition Training
                    </h4>
                    <p className="text-gray-700 dark:text-gray-300 text-center leading-relaxed">
                      Expert nutrition guidance and meal planning to complement
                      your fitness journey and achieve optimal health and
                      wellness goals.
                    </p>
                  </div>
                </div>
              </div>

              {/* Schedule and Package Info */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
                <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 dark:from-yellow-900/30 dark:to-yellow-800/30 p-10 rounded-3xl border border-yellow-200 dark:border-yellow-800">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="bg-yellow-100 dark:bg-yellow-900 rounded-full w-16 h-16 flex items-center justify-center">
                      <Clock className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                      Gym Daily Schedule
                    </h3>
                  </div>
                  <div className="space-y-6 text-gray-700 dark:text-gray-300">
                    <div className="flex items-start gap-4">
                      <div className="bg-yellow-200 dark:bg-yellow-800 rounded-full w-3 h-3 mt-2"></div>
                      <div>
                        <p className="font-semibold text-yellow-600 dark:text-yellow-400">
                          Operation Time:
                        </p>
                        <p className="text-sm">
                          5:30AM - 9:00PM (Monday to Friday)
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="bg-yellow-200 dark:bg-yellow-800 rounded-full w-3 h-3 mt-2"></div>
                      <div>
                        <p className="font-semibold text-yellow-600 dark:text-yellow-400">
                          Saturday:
                        </p>
                        <p className="text-sm">7:00AM - 8:00PM</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="bg-yellow-200 dark:bg-yellow-800 rounded-full w-3 h-3 mt-2"></div>
                      <div>
                        <p className="font-semibold text-yellow-600 dark:text-yellow-400">
                          Group Sessions:
                        </p>
                        <p className="text-sm">
                          Monday - Friday 6:00am - 7:00am & 6:00pm - 7:00pm
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/70 dark:to-gray-700/70 p-10 rounded-3xl border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="bg-yellow-100 dark:bg-yellow-900 rounded-full w-16 h-16 flex items-center justify-center">
                      <Users className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                      Package Details
                    </h3>
                  </div>
                  <div className="space-y-6 text-gray-700 dark:text-gray-300">
                    <div>
                      <p className="font-semibold text-yellow-600 dark:text-yellow-400 mb-3">
                        Monthly Clients:
                      </p>
                      <p className="text-sm leading-relaxed">
                        Have access to all workout sessions, including strength,
                        aerobics, and Zumba, and can visit the gym at any time
                        of day.
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold text-yellow-600 dark:text-yellow-400 mb-3">
                        Daily and Weekly Clients:
                      </p>
                      <p className="text-sm leading-relaxed">
                        Are limited to specific sessions in a day, each lasting
                        1:30 minutes. Weekly charges apply for 5 days.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Kids Program */}
              <div className="text-center bg-gradient-to-r from-orange-500/10 via-yellow-500/10 to-red-500/10 dark:from-orange-900/20 dark:via-yellow-900/20 dark:to-red-900/20 p-12 rounded-3xl mb-20 border border-yellow-200 dark:border-yellow-800">
                <div className="bg-yellow-100 dark:bg-yellow-900 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-8">
                  <Shield className="h-12 w-12 text-yellow-600 dark:text-yellow-400" />
                </div>
                <h3 className="text-3xl font-bold mb-6 text-yellow-600 dark:text-yellow-400">
                  Kids Fitness & Karate
                </h3>
                <div className="max-w-4xl mx-auto space-y-6">
                  <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                    For engaging activities, we offer kids programs at Tumaini
                    Fitness Centre, including{" "}
                    <span className="text-yellow-500 font-semibold">
                      Karate
                    </span>
                    ,{" "}
                    <span className="text-yellow-500 font-semibold">
                      Dance Training
                    </span>
                    ,{" "}
                    <span className="text-yellow-500 font-semibold">
                      Team Building
                    </span>
                    , and{" "}
                    <span className="text-yellow-500 font-semibold">
                      Life Skills
                    </span>
                    .
                  </p>
                  <div className="bg-white/50 dark:bg-gray-800/50 p-6 rounded-2xl">
                    <p className="text-gray-600 dark:text-gray-300">
                      <span className="font-semibold text-yellow-600 dark:text-yellow-400">
                        Schedule:
                      </span>{" "}
                      Saturdays from 10:30am to 12:30pm and weekdays during
                      holidays.
                    </p>
                    <p className="text-gray-600 dark:text-gray-300 mt-2">
                      Give your kids a chance to develop their creative side and
                      enjoy a healthy, fun-filled holiday.
                    </p>
                  </div>
                </div>
              </div>

              {/* Stats Section */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-20">
                <div className="text-center group">
                  <div className="bg-yellow-100 dark:bg-yellow-900 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Users className="h-12 w-12 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <h3 className="text-4xl font-bold mb-2 text-gray-900 dark:text-white">
                    500+
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 font-medium">
                    Active Members
                  </p>
                </div>
                <div className="text-center group">
                  <div className="bg-yellow-100 dark:bg-yellow-900 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Trophy className="h-12 w-12 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <h3 className="text-4xl font-bold mb-2 text-gray-900 dark:text-white">
                    5+
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 font-medium">
                    Years Experience
                  </p>
                </div>
                <div className="text-center group">
                  <div className="bg-yellow-100 dark:bg-yellow-900 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Zap className="h-12 w-12 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <h3 className="text-4xl font-bold mb-2 text-gray-900 dark:text-white">
                    20+
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 font-medium">
                    Programs
                  </p>
                </div>
                <div className="text-center group">
                  <div className="bg-yellow-100 dark:bg-yellow-900 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Star className="h-12 w-12 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <h3 className="text-4xl font-bold mb-2 text-gray-900 dark:text-white">
                    4.9/5
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 font-medium">
                    Member Rating
                  </p>
                </div>
              </div>

              {/* Contact CTA */}
              <div className="text-center bg-gradient-to-r from-yellow-500 to-yellow-600 p-12 rounded-3xl text-white">
                <h3 className="text-3xl font-bold mb-4">
                  Ready to Start Your Fitness Journey?
                </h3>
                <p className="text-xl mb-8 opacity-90">
                  Join hundreds of satisfied members at Tumaini Fitness Centre
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    size="lg"
                    onClick={handleContactClick}
                    className="bg-white text-yellow-600 hover:bg-gray-100 font-semibold px-8 py-4 text-lg"
                  >
                    Get in Touch
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={handleDashboardAccess}
                    className="border-white text-white hover:bg-white hover:text-yellow-600 px-8 py-4 text-lg"
                  >
                    Member Portal
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
