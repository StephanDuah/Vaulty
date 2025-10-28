"use client";
import { SunIcon, MoonIcon } from "lucide-react";
import { useTheme } from "next-themes";
import React from "react";
import { Button } from "@/components/ui/button";
const ThemeButton = () => {
  const { theme, setTheme, resolvedTheme } = useTheme();
  return (
    <Button
      onClick={() => setTheme(resolvedTheme === "light" ? "dark" : "light")}
      type="button"
      className="dark:bg-black p-2 rounded-lg border border-zinc-300 dark:border-zinc-700 dark:text-white text-black bg-white "
    >
      {theme === "light" ? <SunIcon /> : <MoonIcon />}
    </Button>
  );
};

export default ThemeButton;
