"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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
        "Consultation request sent successfully! We&apos;ll contact you soon."
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
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://res.cloudinary.com/dl0w5seja/image/upload/f_auto,q_auto/tumaini_hero_wegjkt"
            alt="Tumaini Fitness Centre - Nutrition"
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-black/75"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-6 pt-20">
          <Badge
            variant="secondary"
            className="mb-6 bg-yellow-500 text-black font-semibold text-sm px-4 py-2"
          >
            Nutrition Guidance
          </Badge>

          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Expert <span className="text-yellow-400">Nutrition</span> Advice
          </h1>

          <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-3xl mx-auto leading-relaxed">
            Fuel your fitness journey with proper nutrition. Learn about
            essential macronutrients and get personalized guidance.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            {/* Introduction */}
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-8">
                Foods to Include in Your{" "}
                <span className="text-yellow-500">Workout Diet</span>
              </h2>
              <div className="max-w-4xl mx-auto">
                <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                  The three primary macronutrients{" "}
                  <span className="text-yellow-500 font-semibold">
                    carbohydrates, proteins, and fats
                  </span>{" "}
                  are essential for maintaining bodily functions and promoting
                  changes in strength and body composition. To maximize your
                  progress, it&apos;s crucial to consume all three in sufficient
                  quantities. Here&apos;s what you need to know about the key
                  nutrients to include in your gym diet plan for muscle gain and
                  weight loss.
                </p>
              </div>
            </div>

            {/* Macronutrients Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-20">
              {/* Carbohydrates */}
              <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 p-8 rounded-3xl border border-yellow-200 dark:border-yellow-800">
                <div className="text-center mb-6">
                  <div className="bg-yellow-100 dark:bg-yellow-900 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                    <Wheat className="h-10 w-10 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-yellow-600 dark:text-yellow-400 mb-4">
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
                    <div className="bg-white/50 dark:bg-gray-800/50 p-4 rounded-xl">
                      <h4 className="font-semibold text-yellow-600 dark:text-yellow-400 mb-2">
                        Complex Carbs (Recommended)
                      </h4>
                      <p className="text-sm">
                        <span className="text-yellow-500 font-medium">
                          Whole grains, beans, nuts, fruits, and vegetables
                        </span>{" "}
                        digest slowly, providing{" "}
                        <span className="text-yellow-500 font-medium">
                          sustained energy
                        </span>{" "}
                        and essential nutrients.
                      </p>
                    </div>
                    <div className="bg-white/50 dark:bg-gray-800/50 p-4 rounded-xl">
                      <h4 className="font-semibold text-yellow-600 dark:text-yellow-400 mb-2">
                        Simple Carbs (Limited)
                      </h4>
                      <p className="text-sm">
                        <span className="text-yellow-500 font-medium">
                          Sugary snacks and refined grains
                        </span>{" "}
                        offer quick energy but lack lasting nutritional value.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Protein */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-700/50 p-8 rounded-3xl border border-gray-200 dark:border-gray-700">
                <div className="text-center mb-6">
                  <div className="bg-yellow-100 dark:bg-yellow-900 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                    <Beef className="h-10 w-10 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-yellow-600 dark:text-yellow-400 mb-4">
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
                    <span className="text-yellow-500 font-medium">
                      muscle recovery
                    </span>{" "}
                    and{" "}
                    <span className="text-yellow-500 font-medium">repair</span>.
                  </p>
                  <div className="space-y-3">
                    <div className="bg-white/50 dark:bg-gray-800/50 p-4 rounded-xl">
                      <h4 className="font-semibold text-yellow-600 dark:text-yellow-400 mb-2">
                        Animal Sources
                      </h4>
                      <p className="text-sm">
                        <span className="text-yellow-500 font-medium">
                          Lean meats, eggs, and dairy
                        </span>{" "}
                        provide complete protein profiles.
                      </p>
                    </div>
                    <div className="bg-white/50 dark:bg-gray-800/50 p-4 rounded-xl">
                      <h4 className="font-semibold text-yellow-600 dark:text-yellow-400 mb-2">
                        Plant Sources
                      </h4>
                      <p className="text-sm">
                        <span className="text-yellow-500 font-medium">
                          Seeds, nuts, legumes, beans, and soy
                        </span>{" "}
                        offer protein in smaller amounts.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Fats */}
              <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 p-8 rounded-3xl border border-yellow-200 dark:border-yellow-800">
                <div className="text-center mb-6">
                  <div className="bg-yellow-100 dark:bg-yellow-900 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                    <Droplets className="h-10 w-10 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-yellow-600 dark:text-yellow-400 mb-4">
                    Healthy Fats
                  </h3>
                </div>
                <div className="space-y-4 text-gray-700 dark:text-gray-300">
                  <p className="leading-relaxed">
                    <span className="font-bold text-yellow-600 dark:text-yellow-400">
                      Fats
                    </span>{" "}
                    are essential for{" "}
                    <span className="text-yellow-500 font-medium">
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
                    .
                  </p>
                  <div className="space-y-3">
                    <div className="bg-white/50 dark:bg-gray-800/50 p-4 rounded-xl">
                      <h4 className="font-semibold text-yellow-600 dark:text-yellow-400 mb-2">
                        Unsaturated Fats (Focus)
                      </h4>
                      <p className="text-sm">
                        <span className="text-yellow-500 font-medium">
                          Avocados, nuts, fish (salmon, tuna), olive oil
                        </span>{" "}
                        and soy products.
                      </p>
                    </div>
                    <div className="bg-white/50 dark:bg-gray-800/50 p-4 rounded-xl">
                      <h4 className="font-semibold text-yellow-600 dark:text-yellow-400 mb-2">
                        Saturated Fats (Moderate)
                      </h4>
                      <p className="text-sm">
                        Not as harmful as once thought, but focus on unsaturated
                        fats for optimal health.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Nutrition Tips Section */}
            <div className="bg-gradient-to-r from-yellow-500/10 via-yellow-400/10 to-yellow-600/10 dark:from-yellow-900/30 dark:via-yellow-800/30 dark:to-yellow-700/30 p-12 rounded-3xl mb-20 border border-yellow-200 dark:border-yellow-800">
              <div className="text-center mb-12">
                <div className="bg-yellow-100 dark:bg-yellow-900 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                  <Utensils className="h-12 w-12 text-yellow-600 dark:text-yellow-400" />
                </div>
                <h3 className="text-3xl font-bold mb-6 text-yellow-600 dark:text-yellow-400">
                  Nutrition Tips for Gym Success
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="text-center">
                  <div className="bg-yellow-100 dark:bg-yellow-900 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Apple className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <h4 className="font-semibold text-yellow-600 dark:text-yellow-400 mb-2">
                    Pre-Workout
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Complex carbs 1-2 hours before training for sustained energy
                  </p>
                </div>

                <div className="text-center">
                  <div className="bg-yellow-100 dark:bg-yellow-900 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Cookie className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <h4 className="font-semibold text-yellow-600 dark:text-yellow-400 mb-2">
                    Post-Workout
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Protein within 30 minutes to maximize muscle recovery
                  </p>
                </div>

                <div className="text-center">
                  <div className="bg-yellow-100 dark:bg-yellow-900 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Droplets className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <h4 className="font-semibold text-yellow-600 dark:text-yellow-400 mb-2">
                    Hydration
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Drink water throughout the day, especially during workouts
                  </p>
                </div>

                <div className="text-center">
                  <div className="bg-yellow-100 dark:bg-yellow-900 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Fish className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <h4 className="font-semibold text-yellow-600 dark:text-yellow-400 mb-2">
                    Balance
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Include all macronutrients in every meal for optimal results
                  </p>
                </div>
              </div>
            </div>

            {/* Consultation Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              {/* Info Side */}
              <div className="space-y-8">
                <div>
                  <h3 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
                    Get Expert Nutrition Advice Today
                  </h3>
                  <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                    Looking for personalized nutrition advice? Book a
                    consultation with us today using the form below or give us a
                    call. We&apos;re here to help you achieve your fitness goals
                    with expert guidance!
                  </p>
                  <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 p-6 rounded-2xl border border-yellow-200 dark:border-yellow-800">
                    <div className="flex items-center gap-4">
                      <div className="bg-yellow-100 dark:bg-yellow-900 rounded-full w-14 h-14 flex items-center justify-center">
                        <Phone className="h-7 w-7 text-yellow-600 dark:text-yellow-400" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-yellow-600 dark:text-yellow-400 text-lg mb-1">
                          Call for Consultation
                        </h4>
                        <p className="text-gray-700 dark:text-gray-300 font-medium text-xl">
                          +254 700 000 000
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
                      <div className="bg-yellow-200 dark:bg-yellow-800 rounded-full w-2 h-2 mt-2 flex-shrink-0"></div>
                      <p className="text-gray-700 dark:text-gray-300">
                        Personalized meal plans based on your fitness goals
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="bg-yellow-200 dark:bg-yellow-800 rounded-full w-2 h-2 mt-2 flex-shrink-0"></div>
                      <p className="text-gray-700 dark:text-gray-300">
                        Macronutrient breakdown for optimal performance
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="bg-yellow-200 dark:bg-yellow-800 rounded-full w-2 h-2 mt-2 flex-shrink-0"></div>
                      <p className="text-gray-700 dark:text-gray-300">
                        Pre and post-workout nutrition strategies
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="bg-yellow-200 dark:bg-yellow-800 rounded-full w-2 h-2 mt-2 flex-shrink-0"></div>
                      <p className="text-gray-700 dark:text-gray-300">
                        Ongoing support and adjustments
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Side */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/70 dark:to-gray-700/70 p-8 md:p-10 rounded-3xl border border-gray-200 dark:border-gray-700">
                <div className="mb-8">
                  <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                    Book Your Nutrition Consultation
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Fill out the form below and we&apos;ll contact you to
                    schedule your personalized nutrition consultation.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label
                        htmlFor="name"
                        className="text-sm font-semibold text-gray-700 dark:text-gray-300"
                      >
                        Full Name *
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          placeholder="Enter your full name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="pl-10 h-12 border-gray-300 dark:border-gray-600 focus:border-yellow-500 focus:ring-yellow-500"
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
                        <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="Enter your email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="pl-10 h-12 border-gray-300 dark:border-gray-600 focus:border-yellow-500 focus:ring-yellow-500"
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
                      <MessageCircle className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <Input
                        id="subject"
                        name="subject"
                        type="text"
                        placeholder="e.g., Weight Loss, Muscle Gain, General Nutrition"
                        value={formData.subject}
                        onChange={handleInputChange}
                        className="pl-10 h-12 border-gray-300 dark:border-gray-600 focus:border-yellow-500 focus:ring-yellow-500"
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
                      className="min-h-32 border-gray-300 dark:border-gray-600 focus:border-yellow-500 focus:ring-yellow-500 resize-none"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-4 text-lg rounded-xl transition-all duration-200 hover:scale-[1.02]"
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
  );
}
