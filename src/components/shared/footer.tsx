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
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import logo from "../../../public/gym.png";

export function Footer() {
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
  ];

  return (
    <footer>
      {/* Main Footer Content */}
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Company Info */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <Image
                src={logo}
                alt="Tumaini Fitness Logo"
                height={40}
                width={40}
              />
              <span className="font-bol text-2xl">Tumaini Fitness</span>
            </div>
            <p className="text-sm leading-relaxed">
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
                  className="group rounded-full bg-gray-800 p-3 transition-colors duration-300 hover:bg-yellow-500"
                >
                  <social.icon className="h-5 w-5 text-gray-400 group-hover:text-black" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="mb-4 text-xl font-bold">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="group flex items-center transition-colors duration-300 hover:text-yellow-600 hover:dark:text-yellow-500"
                  >
                    <span className="h-2 w-2 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"></span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-6">
            <h3 className="mb-4 text-xl font-bold">Our Services</h3>
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
            <h3 className="mb-4 text-xl font-bold">Get in Touch</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="mt-1 h-5 w-5 flex-shrink-0" />
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
                  <p className="text-sm">+254 721 847 695</p>
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
          <div className="flex flex-col justify-between space-y-4 md:flex-row md:items-center md:space-y-0">
            <div className="text-left">
              <p className="text-sm text-gray-400">
                © {new Date().getFullYear()} Tumaini Fitness Centre. All rights
                reserved.
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Empowering your fitness journey since 2019
              </p>
            </div>
            <div className="flex flex-col space-y-2 text-sm sm:flex-row sm:items-center sm:space-y-0 sm:space-x-6">
              <Link
                href="/privacy"
                className="text-gray-400 transition-colors duration-300 hover:text-yellow-500"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-gray-400 transition-colors duration-300 hover:text-yellow-500"
              >
                Terms of Service
              </Link>
              <Link
                href="/dashboard"
                className="text-gray-400 transition-colors duration-300 hover:text-yellow-500"
              >
                Admin portal
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
