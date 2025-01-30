"use client";

import { useEffect, useState } from "react";

interface AuthLayoutProps {
    children: React.ReactNode;
  }
  
  export default function AuthLayout({ children }: AuthLayoutProps) {
    return <div className="flex h-screen items-center justify-center">{children}</div>;
  }