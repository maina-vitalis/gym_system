"use client";

import {
  Dumbbell,
  Facebook,
  Heart,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Target,
  Twitter,
  Users,
  Youtube,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import logo from "../../../public/gym.png";

export function Footer() {
  const router = useRouter();

  const handleDashboardAccess = () => {
    router.push("/dashboard");
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const quickLinks = [
    { label: "Home", href: "/" },
    { label: "About Us", href: "/about" },
    { label: "Nutrition", href: "/nutrition" },
    { label: "Contact", href: "/contact" },
  ];

  const services = [
    { label: "Strength Training", icon: Dumbbell },
    { label: "Cardio Training", icon: Heart },
    { label: "Group Classes", icon: Users },
    { label: "Personal Training", icon: Target },
  ];

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Youtube, href: "#", label: "YouTube" },
  ];

  return (
    <footer>
      {/* Main Footer Content */}
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <Image
                src={logo}
                alt="Tumaini Fitness Logo"
                height={40}
                width={40}
              />
              <span className="text-2xl font-bol">Tumaini Fitness</span>
            </div>
            <p className=" leading-relaxed">
              Your premier fitness destination in Nairobi, Kenya. We provide
              comprehensive fitness services with professional trainers and
              modern equipment to help you achieve your health goals.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  className="bg-gray-800 hover:bg-yellow-500 p-3 rounded-full transition-colors duration-300 group"
                >
                  <social.icon className="h-5 w-5 text-gray-400 group-hover:text-black" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="hover:text-primary transition-colors duration-300 flex items-center group"
                  >
                    <span className="w-2 h-2 bg-primary rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <button
                  onClick={() => scrollToSection("pricing")}
                  className="transition-colors duration-300 flex items-center group"
                >
                  <span className="w-2 h-2 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  Membership Plans
                </button>
              </li>
              <li>
                <button
                  onClick={handleDashboardAccess}
                  className="flex items-center group"
                >
                  <span className="w-2 h-2 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  Member Portal
                </button>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold mb-4">Our Services</h3>
            <ul className="space-y-3">
              {services.map((service, index) => (
                <li key={index} className="flex items-center space-x-3">
                  <service.icon className="h-5 w-5" />
                  <span>{service.label}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold mb-4">Get in Touch</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium">Location</p>
                  <p className="text-sm">Kastemil Business Centre</p>
                  <p className="text-sm">Nairobi (Kasarani), Kenya</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Phone</p>
                  <p className="text-sm">+254 700 000 000</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-sm">info@tumainifitness.co.ke</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
              <p className="text-gray-400 text-sm">
                © 2024 Tumaini Fitness Centre. All rights reserved.
              </p>
              <p className="text-gray-500 text-xs mt-1">
                Empowering your fitness journey since 2019
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6 text-sm">
              <Link
                href="/privacy"
                className="text-gray-400 hover:text-yellow-500 transition-colors duration-300"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-gray-400 hover:text-yellow-500 transition-colors duration-300"
              >
                Terms of Service
              </Link>
              <Link
                href="/contact"
                className="text-gray-400 hover:text-yellow-500 transition-colors duration-300"
              >
                Support
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
