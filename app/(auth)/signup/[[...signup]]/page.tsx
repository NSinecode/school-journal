"use client";

import { SignUp } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";
import ClientOnly from "../../components/client-only";

export default function SignUpPage() {
  const { theme } = useTheme();

  return (
    <ClientOnly>
      <SignUp
        forceRedirectUrl="/account-role"
        appearance={{ baseTheme: theme === "dark" ? dark : undefined }}
      />
    </ClientOnly>
  );
}