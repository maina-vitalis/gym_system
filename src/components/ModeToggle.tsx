"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

interface ModeToggleProps {
  classname?: string;
}

export function ModeToggle({ classname }: ModeToggleProps) {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <Button
      onClick={toggleTheme}
      variant="outline"
      size="icon"
      className={cn(
        "rounded-full relative !gap-0 !p-0 flex items-center justify-center overflow-hidden",
        classname
      )}
    >
      <Sun className="!h-[1.2rem] !w-[1.2rem] absolute scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
      <Moon className="!h-[1.2rem] !w-[1.2rem] absolute scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
