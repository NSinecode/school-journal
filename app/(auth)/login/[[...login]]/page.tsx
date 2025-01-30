"use client";

import { SignIn } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";
import ClientOnly from "../../components/client-only";

export default function LoginPage() {
  const { theme } = useTheme();

  return (
    <ClientOnly>
      <SignIn
        forceRedirectUrl="/todo"
        appearance={{ baseTheme: theme === "dark" ? dark : undefined }}
      />
    </ClientOnly>
  );
}