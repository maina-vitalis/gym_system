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
      <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden">
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
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-6 pt-20">
          <Badge
            variant="secondary"
            className="mb-6 bg-yellow-500 text-black font-semibold text-sm px-4 py-2"
          >
            Get in Touch
          </Badge>

          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Contact <span className="text-yellow-400">Tumaini Fitness</span>
          </h1>

          <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-3xl mx-auto leading-relaxed">
            Ready to take the next step in your fitness journey? Reach out to us
            today!
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              {/* Contact Information */}
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 dark:text-white">
                    Contact Information
                  </h2>
                  <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                    Ready to take the next step in your fitness journey? Reach
                    out to us today! We&apos;re here to answer your questions
                    and help you get started.
                  </p>
                </div>

                {/* Contact Cards */}
                <div className="space-y-6">
                  <div className="group bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 p-6 rounded-2xl border border-yellow-200 dark:border-yellow-800 hover:shadow-lg transition-all duration-300">
                    <div className="flex items-center gap-4">
                      <div className="bg-yellow-100 dark:bg-yellow-900 rounded-full w-14 h-14 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Phone className="h-7 w-7 text-yellow-600 dark:text-yellow-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-yellow-600 dark:text-yellow-400 text-lg mb-1">
                          Phone Number
                        </h3>
                        <p className="text-gray-700 dark:text-gray-300 font-medium">
                          +254 700 000 000
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Call us during business hours
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="group bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-700/50 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300">
                    <div className="flex items-center gap-4">
                      <div className="bg-yellow-100 dark:bg-yellow-900 rounded-full w-14 h-14 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Mail className="h-7 w-7 text-yellow-600 dark:text-yellow-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-yellow-600 dark:text-yellow-400 text-lg mb-1">
                          Email Address
                        </h3>
                        <p className="text-gray-700 dark:text-gray-300 font-medium">
                          info@tumainifitness.co.ke
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          We respond within 24 hours
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="group bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 p-6 rounded-2xl border border-yellow-200 dark:border-yellow-800 hover:shadow-lg transition-all duration-300">
                    <div className="flex items-start gap-4">
                      <div className="bg-yellow-100 dark:bg-yellow-900 rounded-full w-14 h-14 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <MapPin className="h-7 w-7 text-yellow-600 dark:text-yellow-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-yellow-600 dark:text-yellow-400 text-lg mb-1">
                          Location
                        </h3>
                        <p className="text-gray-700 dark:text-gray-300 font-medium">
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

                  <div className="group bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-700/50 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300">
                    <div className="flex items-center gap-4">
                      <div className="bg-yellow-100 dark:bg-yellow-900 rounded-full w-14 h-14 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Clock className="h-7 w-7 text-yellow-600 dark:text-yellow-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-yellow-600 dark:text-yellow-400 text-lg mb-1">
                          Operating Hours
                        </h3>
                        <p className="text-gray-700 dark:text-gray-300 font-medium">
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
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/70 dark:to-gray-700/70 p-8 md:p-10 rounded-3xl border border-gray-200 dark:border-gray-700">
                <div className="mb-8">
                  <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
                    Send us a Message
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    Fill out the form below and we&apos;ll get back to you as
                    soon as possible.
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
                      Subject *
                    </Label>
                    <div className="relative">
                      <MessageCircle className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <Input
                        id="subject"
                        name="subject"
                        type="text"
                        placeholder="What is this about?"
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
                      Message *
                    </Label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Tell us more about your inquiry..."
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
