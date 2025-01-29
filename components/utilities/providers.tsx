"use client";

import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ThemeProviderProps } from "next-themes";

export const Providers = ({ children, ...props }: ThemeProviderProps) => {
  return (
    <NextThemesProvider attribute="class" enableSystem defaultTheme="system" {...props}>
      <TooltipProvider>{children}</TooltipProvider>
    </NextThemesProvider>
  );
};