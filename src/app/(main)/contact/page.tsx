"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  CheckCircle,
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
  const [isSubmitted, setIsSubmitted] = useState(false);
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

  const validateForm = () => {
    // Reset any previous error states
    const errors: string[] = [];

    if (!formData.name.trim()) {
      errors.push("Name is required");
    } else if (formData.name.trim().length < 2) {
      errors.push("Name must be at least 2 characters long");
    }

    if (!formData.email.trim()) {
      errors.push("Email is required");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.push("Please enter a valid email address");
    }

    if (!formData.subject.trim()) {
      errors.push("Subject is required");
    }

    if (!formData.message.trim()) {
      errors.push("Message is required");
    } else if (formData.message.trim().length < 10) {
      errors.push("Message must be at least 10 characters long");
    }

    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      validationErrors.forEach((error) => toast.error(error));
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        // Handle different types of errors from the API
        if (response.status === 400 && result.details) {
          // Validation errors from API
          result.details.forEach((error: string) => toast.error(error));
        } else {
          toast.error(
            result.message || "Failed to send message. Please try again.",
          );
        }
        return;
      }

      // Success
      toast.success("Message sent successfully! We'll get back to you soon.");
      setIsSubmitted(true);

      // Reset form
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });

      // Reset success state after 5 seconds
      setTimeout(() => {
        setIsSubmitted(false);
      }, 5000);
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error("Network error. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://res.cloudinary.com/dl0w5seja/image/upload/v1725258867/Aerobics_tvk812.jpg"
            alt="Tumaini Fitness Centre - Contact Us"
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

                {isSubmitted && (
                  <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                      <p className="text-sm font-medium text-green-800 dark:text-green-200">
                        Thank you! Your message has been sent successfully.
                      </p>
                    </div>
                  </div>
                )}

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
                          disabled={isLoading}
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
                          disabled={isLoading}
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
                        disabled={isLoading}
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
                      disabled={isLoading}
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full rounded-xl bg-yellow-500 py-4 text-lg font-semibold text-black transition-all duration-200 hover:scale-[1.02] hover:bg-yellow-600 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
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
