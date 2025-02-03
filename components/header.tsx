"use client";

import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { CheckSquare, Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="border-b bg-background">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Link href="/" className="flex items-center space-x-2">
            <CheckSquare className="h-6 w-6" />
            <h1 className="text-xl font-bold">School Journal</h1>
          </Link>
        </div>
        <nav className="hidden md:flex space-x-4">
          <Link
            href="/"
            className="hover:underline"
          >
            Home
          </Link>
          <Link
            href="/Courses"
            className="hover:underline"
          >
            Courses
          </Link>
          <Link
            href="/forum"
            className="hover:underline"
          >
            Forum
          </Link>
        </nav>
        <div className="flex items-center space-x-4">
          <SignedOut>
            <SignInButton />
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>
      {isMenuOpen && (
        <nav className="md:hidden p-4">
          <ul className="space-y-2">
            <li>
              <Link
                href="/"
                className="block hover:underline"
                onClick={toggleMenu}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/Courses"
                className="hover:underline"
                onClick={toggleMenu}
              >
                Courses
              </Link>
          </li>
            <li>
              <Link
                href="/forum"
                className="block hover:underline"
                onClick={toggleMenu}
              >
                Forum
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}