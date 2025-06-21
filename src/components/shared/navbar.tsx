"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

import { ModeToggle } from "../ModeToggle";
import logo from "./../../../public/gym.png";
import Mobile from "./mobilenav";

interface NavbarProps {
  className?: string;
}

export function Navbar({ className }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { label: "Home", path: "/" },
    { label: "About", path: "/about" },
    { label: "Nutrition", path: "/nutrition" },
    { label: "Contact", path: "/contact" },
  ];

  return (
    <nav
      className={cn(
        "fixed top-4 left-4 right-4 z-50 transition-all duration-300 ease-in-out",
        isScrolled
          ? "backdrop-blur-md bg-foreground/30 shadow-lg border border-gray-200/50 dark:border-gray-700/50 rounded-full"
          : "bg-transparent",
        className
      )}
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href={"/"}>
            <Image src={logo} alt="Tumaini logo" height={50} width={50} />
          </Link>

          <NavigationMenu className="hidden md:block">
            <NavigationMenuList>
              {navItems.map((item, index) => (
                <NavigationMenuItem key={index}>
                  <NavigationMenuLink
                    asChild
                    className={`${navigationMenuTriggerStyle()} rounded-full bg-background/30 backdrop-blur-2xl`}
                  >
                    <Link href={item.path}>{item.label}</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
          <ModeToggle classname="hidden md:block" />
          <Mobile classname="md:hidden" />
        </div>
      </div>
    </nav>
  );
}
