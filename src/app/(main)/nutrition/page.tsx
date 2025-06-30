"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  generateJsonLd,
  getBreadcrumbSchema,
  getFAQSchema,
  getOrganizationSchema,
  getServiceSchema,
} from "@/lib/seo";
import {
  Apple,
  Beef,
  Cookie,
  Droplets,
  Fish,
  Loader2,
  Mail,
  MessageCircle,
  Phone,
  Send,
  User,
  Utensils,
  Wheat,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

export default function NutritionPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  // Structured Data for SEO
  const organizationSchema = getOrganizationSchema();
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: "https://gym.tumaini.fitness" },
    { name: "Nutrition", url: "https://gym.tumaini.fitness/nutrition" },
  ]);

  const serviceSchema = getServiceSchema({
    name: "Nutrition Guidance",
    description:
      "Expert nutrition consultation and meal planning services to complement your fitness journey and achieve optimal health goals.",
    offers: [
      {
        name: "Nutrition Consultation",
        price: "2500",
        priceCurrency: "KES",
        description: "Personalized nutrition consultation session",
      },
      {
        name: "Meal Planning Service",
        price: "3500",
        priceCurrency: "KES",
        description: "Custom meal planning for your fitness goals",
      },
    ],
  });

  const faqSchema = getFAQSchema([
    {
      question: "What is nutrition guidance?",
      answer:
        "Nutrition guidance is expert advice on healthy eating habits, meal planning, and dietary choices to support your fitness goals and overall health.",
    },
    {
      question: "Why is nutrition important for fitness?",
      answer:
        "Proper nutrition provides the fuel your body needs for workouts, helps with recovery, supports muscle building, and is essential for achieving fitness goals like weight loss or muscle gain.",
    },
    {
      question: "What are macronutrients?",
      answer:
        "Macronutrients are the three main nutrients your body needs in large amounts: proteins (for muscle building), carbohydrates (for energy), and fats (for hormone production and nutrient absorption).",
    },
    {
      question: "Do you offer personalized meal plans?",
      answer:
        "Yes, we provide personalized nutrition consultation and meal planning services tailored to your specific fitness goals, dietary preferences, and lifestyle.",
    },
  ]);

  const jsonLdProps = generateJsonLd([
    organizationSchema,
    breadcrumbSchema,
    serviceSchema,
    faqSchema,
  ]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (
      !formData.name ||
      !formData.email ||
      !formData.subject ||
      !formData.message
    ) {
      toast.error("Please fill in all fields");
      return;
    }

    if (formData.name.length < 3) {
      toast.error("Name must be at least 3 characters");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsLoading(true);

    try {
      // Simulate form submission
      await new Promise((resolve) => setTimeout(resolve, 2000));

      toast.success(
        "Consultation request sent successfully! We&apos;ll contact you soon.",
      );
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error("Failed to send request. Please try again.");
    } finally {
      setIsLoading(false);
    }
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
              src="https://res.cloudinary.com/dl0w5seja/image/upload/v1725584348/nutrition_ynxx9e.jpg"
              alt="Tumaini Fitness Centre - Nutrition"
              fill
              className="object-cover object-center"
              priority
            />
            <div className="absolute inset-0 bg-black/75"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent dark:from-[#101828]"></div>
          </div>

          {/* Hero Content */}
          <div className="relative z-10 mx-auto max-w-4xl px-6 pt-20 text-center text-white">
            <h1 className="mb-6 text-4xl leading-tight font-bold md:text-6xl">
              Expert <span className="text-yellow-400">Nutrition</span> Advice
            </h1>

            <p className="mx-auto mb-8 max-w-3xl text-xl leading-relaxed text-gray-200 md:text-2xl">
              Fuel your fitness journey with proper nutrition. Learn about
              essential macronutrients and get personalized guidance.
            </p>
          </div>
        </section>

        {/* Main Content */}
        <section className="bg-white py-20 dark:bg-gray-900">
          <div className="container mx-auto px-6">
            <div className="mx-auto max-w-6xl">
              {/* Introduction */}
              <div className="mb-16 text-center">
                <h2 className="mb-8 text-3xl font-bold md:text-4xl">
                  Foods to Include in Your{" "}
                  <span className="text-yellow-500">Workout Diet</span>
                </h2>
                <div className="mx-auto max-w-4xl">
                  <p className="text-lg leading-relaxed text-gray-600 md:text-xl dark:text-gray-300">
                    The three primary macronutrients{" "}
                    <span className="font-semibold text-yellow-500">
                      carbohydrates, proteins, and fats
                    </span>{" "}
                    are essential for maintaining bodily functions and promoting
                    changes in strength and body composition. To maximize your
                    progress, it&apos;s crucial to consume all three in
                    sufficient quantities. Here&apos;s what you need to know
                    about the key nutrients to include in your gym diet plan for
                    muscle gain and weight loss.
                  </p>
                </div>
              </div>

              {/* Macronutrients Section */}
              <div className="mb-20 grid grid-cols-1 gap-12 lg:grid-cols-3">
                {/* Carbohydrates */}
                <div className="rounded-3xl border border-yellow-200 bg-gradient-to-br from-yellow-50 to-yellow-100 p-8 dark:border-yellow-800 dark:from-yellow-900/20 dark:to-yellow-800/20">
                  <div className="mb-6 text-center">
                    <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900">
                      <Wheat className="h-10 w-10 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <h3 className="mb-4 text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                      Carbohydrates
                    </h3>
                  </div>
                  <div className="space-y-4 text-gray-700 dark:text-gray-300">
                    <p className="leading-relaxed">
                      <span className="font-bold text-yellow-600 dark:text-yellow-400">
                        Carbohydrates
                      </span>{" "}
                      are the body&apos;s primary energy source, crucial for
                      fueling workouts.
                    </p>
                    <div className="space-y-3">
                      <div className="rounded-xl bg-white/50 p-4 dark:bg-gray-800/50">
                        <h4 className="mb-2 font-semibold text-yellow-600 dark:text-yellow-400">
                          Complex Carbs (Recommended)
                        </h4>
                        <p className="text-sm">
                          <span className="font-medium text-yellow-500">
                            Whole grains, beans, nuts, fruits, and vegetables
                          </span>{" "}
                          digest slowly, providing{" "}
                          <span className="font-medium text-yellow-500">
                            sustained energy
                          </span>{" "}
                          and essential nutrients.
                        </p>
                      </div>
                      <div className="rounded-xl bg-white/50 p-4 dark:bg-gray-800/50">
                        <h4 className="mb-2 font-semibold text-yellow-600 dark:text-yellow-400">
                          Simple Carbs (Limited)
                        </h4>
                        <p className="text-sm">
                          <span className="font-medium text-yellow-500">
                            Sugary snacks and refined grains
                          </span>{" "}
                          offer quick energy but lack lasting nutritional value.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Protein */}
                <div className="rounded-3xl border border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100 p-8 dark:border-gray-700 dark:from-gray-800/50 dark:to-gray-700/50">
                  <div className="mb-6 text-center">
                    <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900">
                      <Beef className="h-10 w-10 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <h3 className="mb-4 text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                      Protein
                    </h3>
                  </div>
                  <div className="space-y-4 text-gray-700 dark:text-gray-300">
                    <p className="leading-relaxed">
                      Most gym-goers understand the importance of consuming{" "}
                      <span className="font-bold text-yellow-600 dark:text-yellow-400">
                        protein
                      </span>
                      , as it plays a crucial role in{" "}
                      <span className="font-medium text-yellow-500">
                        muscle recovery
                      </span>{" "}
                      and{" "}
                      <span className="font-medium text-yellow-500">
                        repair
                      </span>
                      .
                    </p>
                    <div className="space-y-3">
                      <div className="rounded-xl bg-white/50 p-4 dark:bg-gray-800/50">
                        <h4 className="mb-2 font-semibold text-yellow-600 dark:text-yellow-400">
                          Animal Sources
                        </h4>
                        <p className="text-sm">
                          <span className="font-medium text-yellow-500">
                            Lean meats, eggs, and dairy
                          </span>{" "}
                          provide complete protein profiles.
                        </p>
                      </div>
                      <div className="rounded-xl bg-white/50 p-4 dark:bg-gray-800/50">
                        <h4 className="mb-2 font-semibold text-yellow-600 dark:text-yellow-400">
                          Plant Sources
                        </h4>
                        <p className="text-sm">
                          <span className="font-medium text-yellow-500">
                            Seeds, nuts, legumes, beans, and soy
                          </span>{" "}
                          offer protein in smaller amounts.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Fats */}
                <div className="rounded-3xl border border-yellow-200 bg-gradient-to-br from-yellow-50 to-yellow-100 p-8 dark:border-yellow-800 dark:from-yellow-900/20 dark:to-yellow-800/20">
                  <div className="mb-6 text-center">
                    <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900">
                      <Droplets className="h-10 w-10 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <h3 className="mb-4 text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                      Healthy Fats
                    </h3>
                  </div>
                  <div className="space-y-4 text-gray-700 dark:text-gray-300">
                    <p className="leading-relaxed">
                      <span className="font-bold text-yellow-600 dark:text-yellow-400">
                        Fats
                      </span>{" "}
                      are essential for{" "}
                      <span className="font-medium text-yellow-500">
                        nutrient absorption
                      </span>{" "}
                      and contribute to{" "}
                      <span className="font-bold text-yellow-600 dark:text-yellow-400">
                        heart health
                      </span>{" "}
                      and{" "}
                      <span className="font-bold text-yellow-600 dark:text-yellow-400">
                        hormone production
                      </span>
                    </p>
                    <div className="space-y-3">
                      <div className="rounded-xl bg-white/50 p-4 dark:bg-gray-800/50">
                        <h4 className="mb-2 font-semibold text-yellow-600 dark:text-yellow-400">
                          Unsaturated Fats (Focus)
                        </h4>
                        <p className="text-sm">
                          <span className="font-medium text-yellow-500">
                            Avocados, nuts, fish (salmon, tuna), olive oil
                          </span>{" "}
                          and soy products.
                        </p>
                      </div>
                      <div className="rounded-xl bg-white/50 p-4 dark:bg-gray-800/50">
                        <h4 className="mb-2 font-semibold text-yellow-600 dark:text-yellow-400">
                          Saturated Fats (Moderate)
                        </h4>
                        <p className="text-sm">
                          Not as harmful as once thought, but focus on
                          unsaturated fats for optimal health.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Nutrition Tips Section */}
              <div className="mb-20 rounded-3xl border border-yellow-200 bg-gradient-to-r from-yellow-500/10 via-yellow-400/10 to-yellow-600/10 p-12 dark:border-yellow-800 dark:from-yellow-900/30 dark:via-yellow-800/30 dark:to-yellow-700/30">
                <div className="mb-12 text-center">
                  <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900">
                    <Utensils className="h-12 w-12 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <h3 className="mb-6 text-3xl font-bold text-yellow-600 dark:text-yellow-400">
                    Nutrition Tips for Gym Success
                  </h3>
                </div>

                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
                  <div className="text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900">
                      <Apple className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <h4 className="mb-2 font-semibold text-yellow-600 dark:text-yellow-400">
                      Pre-Workout
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Complex carbs 1-2 hours before training for sustained
                      energy
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900">
                      <Cookie className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <h4 className="mb-2 font-semibold text-yellow-600 dark:text-yellow-400">
                      Post-Workout
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Protein within 30 minutes to maximize muscle recovery
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900">
                      <Droplets className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <h4 className="mb-2 font-semibold text-yellow-600 dark:text-yellow-400">
                      Hydration
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Drink water throughout the day, especially during workouts
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900">
                      <Fish className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <h4 className="mb-2 font-semibold text-yellow-600 dark:text-yellow-400">
                      Balance
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Include all macronutrients in every meal for optimal
                      results
                    </p>
                  </div>
                </div>
              </div>

              {/* Consultation Section */}
              <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
                {/* Info Side */}
                <div className="space-y-8">
                  <div>
                    <h3 className="mb-6 text-3xl font-bold text-gray-900 dark:text-white">
                      Get Expert Nutrition Advice Today
                    </h3>
                    <p className="mb-6 text-lg leading-relaxed text-gray-600 dark:text-gray-300">
                      Looking for personalized nutrition advice? Book a
                      consultation with us today using the form below or give us
                      a call. We&apos;re here to help you achieve your fitness
                      goals with expert guidance!
                    </p>
                    <div className="rounded-2xl border border-yellow-200 bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 dark:border-yellow-800 dark:from-yellow-900/20 dark:to-yellow-800/20">
                      <div className="flex items-center gap-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900">
                          <Phone className="h-7 w-7 text-yellow-600 dark:text-yellow-400" />
                        </div>
                        <div>
                          <h4 className="mb-1 text-lg font-semibold text-yellow-600 dark:text-yellow-400">
                            Call for Consultation
                          </h4>
                          <p className="text-xl font-medium text-gray-700 dark:text-gray-300">
                            +254 721 847 695
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Available during business hours
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Benefits */}
                  <div className="space-y-4">
                    <h4 className="text-xl font-semibold text-yellow-600 dark:text-yellow-400">
                      What You&apos;ll Get:
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-yellow-200 dark:bg-yellow-800"></div>
                        <p className="text-gray-700 dark:text-gray-300">
                          Personalized meal plans based on your fitness goals
                        </p>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-yellow-200 dark:bg-yellow-800"></div>
                        <p className="text-gray-700 dark:text-gray-300">
                          Macronutrient breakdown for optimal performance
                        </p>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-yellow-200 dark:bg-yellow-800"></div>
                        <p className="text-gray-700 dark:text-gray-300">
                          Pre and post-workout nutrition strategies
                        </p>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-yellow-200 dark:bg-yellow-800"></div>
                        <p className="text-gray-700 dark:text-gray-300">
                          Ongoing support and adjustments
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Form Side */}
                <div className="rounded-3xl border border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100 p-8 md:p-10 dark:border-gray-700 dark:from-gray-800/70 dark:to-gray-700/70">
                  <div className="mb-8">
                    <h3 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
                      Book Your Nutrition Consultation
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Fill out the form below and we&apos;ll contact you to
                      schedule your personalized nutrition consultation.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label
                          htmlFor="name"
                          className="text-sm font-semibold text-gray-700 dark:text-gray-300"
                        >
                          Full Name *
                        </Label>
                        <div className="relative">
                          <User className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
                          <Input
                            id="name"
                            name="name"
                            type="text"
                            placeholder="Enter your full name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="h-12 border-gray-300 pl-10 focus:border-yellow-500 focus:ring-yellow-500 dark:border-gray-600"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="email"
                          className="text-sm font-semibold text-gray-700 dark:text-gray-300"
                        >
                          Email Address *
                        </Label>
                        <div className="relative">
                          <Mail className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="h-12 border-gray-300 pl-10 focus:border-yellow-500 focus:ring-yellow-500 dark:border-gray-600"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="subject"
                        className="text-sm font-semibold text-gray-700 dark:text-gray-300"
                      >
                        Consultation Type *
                      </Label>
                      <div className="relative">
                        <MessageCircle className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
                        <Input
                          id="subject"
                          name="subject"
                          type="text"
                          placeholder="e.g., Weight Loss, Muscle Gain, General Nutrition"
                          value={formData.subject}
                          onChange={handleInputChange}
                          className="h-12 border-gray-300 pl-10 focus:border-yellow-500 focus:ring-yellow-500 dark:border-gray-600"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="message"
                        className="text-sm font-semibold text-gray-700 dark:text-gray-300"
                      >
                        Tell us about your goals *
                      </Label>
                      <Textarea
                        id="message"
                        name="message"
                        placeholder="Describe your fitness goals, dietary preferences, and any specific concerns..."
                        value={formData.message}
                        onChange={handleInputChange}
                        className="min-h-32 resize-none border-gray-300 focus:border-yellow-500 focus:ring-yellow-500 dark:border-gray-600"
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full rounded-xl bg-yellow-500 py-4 text-lg font-semibold text-black transition-all duration-200 hover:scale-[1.02] hover:bg-yellow-600"
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-5 w-5 animate-spin" />
                          Booking Consultation...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Send className="h-5 w-5" />
                          Book Consultation
                        </div>
                      )}
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
