"use client";

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
    router.push("/contact");
  };

  return (
    <>
      <script {...jsonLdProps} />

      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative flex min-h-[80vh] items-center justify-center overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <Image
              src="https://res.cloudinary.com/dl0w5seja/image/upload/v1725810262/gym_1_oe5fjb.png"
              alt="Tumaini Fitness Centre - About Us"
              fill
              className="object-cover object-center"
              priority
            />
            <div className="absolute inset-0 bg-black/70"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent dark:from-[#101828]"></div>
          </div>

          {/* Hero Content */}
          <div className="relative z-10 mx-auto max-w-4xl px-6 pt-20 text-center text-white">
            <h1 className="mb-6 text-4xl leading-tight font-bold md:text-6xl">
              Welcome to{" "}
              <span className="text-yellow-400">Tumaini Fitness Centre</span>
            </h1>

            <p className="mx-auto mb-8 max-w-3xl text-xl leading-relaxed text-gray-200 md:text-2xl">
              Your fitness goals are our mission. Discover our story, services,
              and commitment to your health.
            </p>
          </div>
        </section>

        {/* Main About Content */}
        <section className="bg-white py-20 dark:bg-gray-900">
          <div className="container mx-auto px-6">
            <div className="mx-auto max-w-6xl">
              {/* Introduction */}
              <div className="mb-16 text-center">
                <h2 className="mb-8 text-3xl font-bold md:text-4xl">
                  About{" "}
                  <span className="text-yellow-500">
                    Tumaini Fitness Centre
                  </span>
                </h2>
                <div className="mx-auto max-w-4xl space-y-6">
                  <p className="text-lg leading-relaxed text-gray-600 md:text-xl dark:text-gray-300">
                    Tumaini Fitness Centre (
                    <span className="font-semibold text-yellow-500">TFC</span>)
                    is a modern fitness gym located in Nairobi, Kenya, at
                    Kastemil Business Centre, Kasarani Constituency. We offer
                    comprehensive fitness services that help our clients get in
                    shape by losing excess fat, building muscles, and promoting
                    a healthy balanced lifestyle through expert nutrition
                    training.
                  </p>
                  <p className="text-lg leading-relaxed text-gray-600 md:text-xl dark:text-gray-300">
                    Our services are{" "}
                    <span className="font-semibold text-yellow-500">
                      affordable
                    </span>{" "}
                    and are provided by{" "}
                    <span className="font-semibold text-yellow-500">
                      professional instructors
                    </span>{" "}
                    who prioritize integrity. At Tumaini Fitness Centre, your
                    fitness goals are our mission.
                  </p>
                </div>
              </div>

              {/* Services Section */}
              <div className="mb-20">
                <h3 className="mb-12 text-center text-2xl font-bold text-yellow-500 md:text-3xl">
                  Our Services
                </h3>
                <div className="mx-auto grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-8">
                  <div className="group rounded-2xl bg-gradient-to-br from-yellow-50 to-yellow-100 p-8 transition-all duration-300 hover:shadow-lg dark:from-yellow-900/20 dark:to-yellow-800/20">
                    <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-yellow-100 transition-transform duration-300 group-hover:scale-110 dark:bg-yellow-900">
                      <Dumbbell className="h-10 w-10 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <h4 className="mb-4 text-center text-xl font-bold text-yellow-600 dark:text-yellow-400">
                      Strength Training
                    </h4>
                    <p className="text-center leading-relaxed text-gray-700 dark:text-gray-300">
                      Professional strength training programs designed to build
                      muscle, improve endurance, and boost overall physical
                      strength with expert guidance.
                    </p>
                  </div>

                  <div className="group rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 p-8 transition-all duration-300 hover:shadow-lg dark:from-gray-800/50 dark:to-gray-700/50">
                    <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-yellow-100 transition-transform duration-300 group-hover:scale-110 dark:bg-yellow-900">
                      <Heart className="h-10 w-10 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <h4 className="mb-4 text-center text-xl font-bold text-yellow-600 dark:text-yellow-400">
                      Cardio Training
                    </h4>
                    <p className="text-center leading-relaxed text-gray-700 dark:text-gray-300">
                      High-energy cardio sessions including Aerobics, Zumba,
                      Insanity, Circuit training, and Steps workout to boost
                      cardiovascular health.
                    </p>
                  </div>

                  <div className="group rounded-2xl bg-gradient-to-br from-yellow-50 to-yellow-100 p-8 transition-all duration-300 hover:shadow-lg dark:from-yellow-900/20 dark:to-yellow-800/20">
                    <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-yellow-100 transition-transform duration-300 group-hover:scale-110 dark:bg-yellow-900">
                      <Target className="h-10 w-10 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <h4 className="mb-4 text-center text-xl font-bold text-yellow-600 dark:text-yellow-400">
                      Nutrition Training
                    </h4>
                    <p className="text-center leading-relaxed text-gray-700 dark:text-gray-300">
                      Expert nutrition guidance and meal planning to complement
                      your fitness journey and achieve optimal health and
                      wellness goals.
                    </p>
                  </div>
                </div>
              </div>

              {/* Schedule and Package Info */}
              <div className="mb-20 grid grid-cols-1 gap-12 lg:grid-cols-2">
                <div className="rounded-3xl border border-yellow-200 bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 p-10 dark:border-yellow-800 dark:from-yellow-900/30 dark:to-yellow-800/30">
                  <div className="mb-8 flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900">
                      <Clock className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                      Gym Daily Schedule
                    </h3>
                  </div>
                  <div className="space-y-6 text-gray-700 dark:text-gray-300">
                    <div className="flex items-start gap-4">
                      <div className="mt-2 h-3 w-3 rounded-full bg-yellow-200 dark:bg-yellow-800"></div>
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
                      <div className="mt-2 h-3 w-3 rounded-full bg-yellow-200 dark:bg-yellow-800"></div>
                      <div>
                        <p className="font-semibold text-yellow-600 dark:text-yellow-400">
                          Saturday:
                        </p>
                        <p className="text-sm">7:00AM - 8:00PM</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="mt-2 h-3 w-3 rounded-full bg-yellow-200 dark:bg-yellow-800"></div>
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

                <div className="rounded-3xl border border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100 p-10 dark:border-gray-700 dark:from-gray-800/70 dark:to-gray-700/70">
                  <div className="mb-8 flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900">
                      <Users className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                      Package Details
                    </h3>
                  </div>
                  <div className="space-y-6 text-gray-700 dark:text-gray-300">
                    <div>
                      <p className="mb-3 font-semibold text-yellow-600 dark:text-yellow-400">
                        Monthly Clients:
                      </p>
                      <p className="text-sm leading-relaxed">
                        Have access to all workout sessions, including strength,
                        aerobics, and Zumba, and can visit the gym at any time
                        of day.
                      </p>
                    </div>
                    <div>
                      <p className="mb-3 font-semibold text-yellow-600 dark:text-yellow-400">
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
              <div className="mb-20 rounded-3xl border border-yellow-200 bg-gradient-to-r from-orange-500/10 via-yellow-500/10 to-red-500/10 p-12 text-center dark:border-yellow-800 dark:from-orange-900/20 dark:via-yellow-900/20 dark:to-red-900/20">
                <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900">
                  <Shield className="h-12 w-12 text-yellow-600 dark:text-yellow-400" />
                </div>
                <h3 className="mb-6 text-3xl font-bold text-yellow-600 dark:text-yellow-400">
                  Kids Fitness & Karate
                </h3>
                <div className="mx-auto max-w-4xl space-y-6">
                  <p className="text-lg leading-relaxed text-gray-600 dark:text-gray-300">
                    For engaging activities, we offer kids programs at Tumaini
                    Fitness Centre, including{" "}
                    <span className="font-semibold text-yellow-500">
                      Karate
                    </span>
                    ,{" "}
                    <span className="font-semibold text-yellow-500">
                      Dance Training
                    </span>
                    ,{" "}
                    <span className="font-semibold text-yellow-500">
                      Team Building
                    </span>
                    , and{" "}
                    <span className="font-semibold text-yellow-500">
                      Life Skills
                    </span>
                    .
                  </p>
                  <div className="rounded-2xl bg-white/50 p-6 dark:bg-gray-800/50">
                    <p className="text-gray-600 dark:text-gray-300">
                      <span className="font-semibold text-yellow-600 dark:text-yellow-400">
                        Schedule:
                      </span>{" "}
                      Saturdays from 10:30am to 12:30pm and weekdays during
                      holidays.
                    </p>
                    <p className="mt-2 text-gray-600 dark:text-gray-300">
                      Give your kids a chance to develop their creative side and
                      enjoy a healthy, fun-filled holiday.
                    </p>
                  </div>
                </div>
              </div>

              {/* Stats Section */}
              <div className="mb-20 grid grid-cols-2 gap-8 md:grid-cols-4">
                <div className="group text-center">
                  <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-yellow-100 transition-transform duration-300 group-hover:scale-110 dark:bg-yellow-900">
                    <Users className="h-12 w-12 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <h3 className="mb-2 text-4xl font-bold text-gray-900 dark:text-white">
                    500+
                  </h3>
                  <p className="font-medium text-gray-600 dark:text-gray-300">
                    Active Members
                  </p>
                </div>
                <div className="group text-center">
                  <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-yellow-100 transition-transform duration-300 group-hover:scale-110 dark:bg-yellow-900">
                    <Trophy className="h-12 w-12 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <h3 className="mb-2 text-4xl font-bold text-gray-900 dark:text-white">
                    5+
                  </h3>
                  <p className="font-medium text-gray-600 dark:text-gray-300">
                    Years Experience
                  </p>
                </div>
                <div className="group text-center">
                  <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-yellow-100 transition-transform duration-300 group-hover:scale-110 dark:bg-yellow-900">
                    <Zap className="h-12 w-12 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <h3 className="mb-2 text-4xl font-bold text-gray-900 dark:text-white">
                    20+
                  </h3>
                  <p className="font-medium text-gray-600 dark:text-gray-300">
                    Programs
                  </p>
                </div>
                <div className="group text-center">
                  <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-yellow-100 transition-transform duration-300 group-hover:scale-110 dark:bg-yellow-900">
                    <Star className="h-12 w-12 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <h3 className="mb-2 text-4xl font-bold text-gray-900 dark:text-white">
                    4.9/5
                  </h3>
                  <p className="font-medium text-gray-600 dark:text-gray-300">
                    Member Rating
                  </p>
                </div>
              </div>

              {/* Contact CTA */}
              <div className="rounded-3xl bg-gradient-to-r from-yellow-500 to-yellow-600 p-12 text-center text-white">
                <h3 className="mb-4 text-3xl font-bold">
                  Ready to Start Your Fitness Journey?
                </h3>
                <p className="mb-8 text-xl opacity-90">
                  Join hundreds of satisfied members at Tumaini Fitness Centre
                </p>
                <div className="flex flex-col justify-center gap-4 sm:flex-row">
                  <Button
                    size="lg"
                    onClick={handleContactClick}
                    className="bg-white px-8 py-4 text-lg font-semibold text-yellow-600 hover:bg-gray-100"
                  >
                    Get in Touch
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
