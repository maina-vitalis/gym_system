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
      variant="ghost"
      size="icon"
      className={cn(
        "relative h-9 w-9 rounded-full border border-border/60 bg-background/60 backdrop-blur-sm",
        "hover:border-yellow-500/40 hover:bg-yellow-500/10 hover:text-yellow-500",
        "focus-visible:ring-2 focus-visible:ring-yellow-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "dark:bg-muted/30 dark:border-border/50 dark:hover:bg-yellow-500/15 dark:hover:text-yellow-400",
        "transition-all duration-200 overflow-hidden",
        classname
      )}
    >
      <Sun className="h-[1.15rem] w-[1.15rem] absolute scale-100 rotate-0 text-yellow-500 transition-all dark:scale-0 dark:-rotate-90 dark:text-muted-foreground" />
      <Moon className="h-[1.15rem] w-[1.15rem] absolute scale-0 rotate-90 text-muted-foreground transition-all dark:scale-100 dark:rotate-0 dark:text-yellow-400" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
