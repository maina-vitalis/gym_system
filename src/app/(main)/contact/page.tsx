"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Clock,
  Loader2,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  User,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

export default function ContactPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

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

      toast.success("Message sent successfully! We'll get back to you soon.");
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative flex min-h-[50vh] items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://res.cloudinary.com/dl0w5seja/image/upload/f_auto,q_auto/tumaini_hero_wegjkt"
            alt="Tumaini Fitness Centre - Contact Us"
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-black/75"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 mx-auto max-w-4xl px-6 pt-20 text-center text-white">
          <Badge
            variant="secondary"
            className="mb-6 bg-yellow-500 px-4 py-2 text-sm font-semibold text-black"
          >
            Get in Touch
          </Badge>

          <h1 className="mb-6 text-4xl leading-tight font-bold md:text-6xl">
            Contact <span className="text-yellow-400">Tumaini Fitness</span>
          </h1>

          <p className="mx-auto mb-8 max-w-3xl text-xl leading-relaxed text-gray-200 md:text-2xl">
            Ready to take the next step in your fitness journey? Reach out to us
            today!
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="bg-white py-20 dark:bg-gray-900">
        <div className="container mx-auto px-6">
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
              {/* Contact Information */}
              <div className="space-y-8">
                <div>
                  <h2 className="mb-6 text-3xl font-bold text-gray-900 md:text-4xl dark:text-white">
                    Contact Information
                  </h2>
                  <p className="text-lg leading-relaxed text-gray-600 dark:text-gray-300">
                    Ready to take the next step in your fitness journey? Reach
                    out to us today! We&apos;re here to answer your questions
                    and help you get started.
                  </p>
                </div>

                {/* Contact Cards */}
                <div className="space-y-6">
                  <div className="group rounded-2xl border border-yellow-200 bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 transition-all duration-300 hover:shadow-lg dark:border-yellow-800 dark:from-yellow-900/20 dark:to-yellow-800/20">
                    <div className="flex items-center gap-4">
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-yellow-100 transition-transform duration-300 group-hover:scale-110 dark:bg-yellow-900">
                        <Phone className="h-7 w-7 text-yellow-600 dark:text-yellow-400" />
                      </div>
                      <div>
                        <h3 className="mb-1 text-lg font-semibold text-yellow-600 dark:text-yellow-400">
                          Phone Number
                        </h3>
                        <p className="font-medium text-gray-700 dark:text-gray-300">
                          +254 721 847 695
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Call us during business hours
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="group rounded-2xl border border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100 p-6 transition-all duration-300 hover:shadow-lg dark:border-gray-700 dark:from-gray-800/50 dark:to-gray-700/50">
                    <div className="flex items-center gap-4">
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-yellow-100 transition-transform duration-300 group-hover:scale-110 dark:bg-yellow-900">
                        <Mail className="h-7 w-7 text-yellow-600 dark:text-yellow-400" />
                      </div>
                      <div>
                        <h3 className="mb-1 text-lg font-semibold text-yellow-600 dark:text-yellow-400">
                          Email Address
                        </h3>
                        <p className="font-medium text-gray-700 dark:text-gray-300">
                          info@tumainifitness.co.ke
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          We respond within 24 hours
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="group rounded-2xl border border-yellow-200 bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 transition-all duration-300 hover:shadow-lg dark:border-yellow-800 dark:from-yellow-900/20 dark:to-yellow-800/20">
                    <div className="flex items-start gap-4">
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-yellow-100 transition-transform duration-300 group-hover:scale-110 dark:bg-yellow-900">
                        <MapPin className="h-7 w-7 text-yellow-600 dark:text-yellow-400" />
                      </div>
                      <div>
                        <h3 className="mb-1 text-lg font-semibold text-yellow-600 dark:text-yellow-400">
                          Location
                        </h3>
                        <p className="font-medium text-gray-700 dark:text-gray-300">
                          Kastemil Business Centre
                          <br />
                          Nairobi (Kasarani)
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Easy to find and accessible
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="group rounded-2xl border border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100 p-6 transition-all duration-300 hover:shadow-lg dark:border-gray-700 dark:from-gray-800/50 dark:to-gray-700/50">
                    <div className="flex items-center gap-4">
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-yellow-100 transition-transform duration-300 group-hover:scale-110 dark:bg-yellow-900">
                        <Clock className="h-7 w-7 text-yellow-600 dark:text-yellow-400" />
                      </div>
                      <div>
                        <h3 className="mb-1 text-lg font-semibold text-yellow-600 dark:text-yellow-400">
                          Operating Hours
                        </h3>
                        <p className="font-medium text-gray-700 dark:text-gray-300">
                          Mon-Fri: 5:30 AM - 9:00 PM
                          <br />
                          Saturday: 7:00 AM - 8:00 PM
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Extended hours for your convenience
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className="rounded-3xl border border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100 p-8 md:p-10 dark:border-gray-700 dark:from-gray-800/70 dark:to-gray-700/70">
                <div className="mb-8">
                  <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">
                    Send us a Message
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    Fill out the form below and we&apos;ll get back to you as
                    soon as possible.
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
                      Subject *
                    </Label>
                    <div className="relative">
                      <MessageCircle className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
                      <Input
                        id="subject"
                        name="subject"
                        type="text"
                        placeholder="What is this about?"
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
                      Message *
                    </Label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Tell us more about your inquiry..."
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
                        Sending Message...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Send className="h-5 w-5" />
                        Send Message
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
