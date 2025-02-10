"use client";

import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import Image from "next/image";
import { getUserRole } from "@/actions/profiles-actions";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const fetchRole = async () => {
      const role = await getUserRole();
      setUserRole(role ?? null);
    };
    fetchRole();
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="border-b bg-background">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 relative bg-transparent">
              <Image 
                src="/images/IMG_1671.PNG"
                alt="School Journal Logo"
                fill
                sizes="32px"
                className="!relative !h-[32px] !w-[32px]"
                priority
              />
            </div>
            <h1 className="text-xl font-bold">School Journal</h1>
          </Link>
        </div>
        <nav className="hidden md:flex space-x-4 justify-center flex-1">
          <Link
            href="/"
            className="hover:underline"
          >
            Главная
          </Link>
          <SignedIn>
            <Link
              href="/Courses"
              className="hover:underline"
            >
              Курсы
            </Link>
          </SignedIn>
          <SignedIn>
            <Link
              href="/forum"
              className="hover:underline"
            >
              Форум
            </Link>
          </SignedIn>
          {userRole === 'teacher' && (
            <>
              <Link
                href="/test/create"
                className="hover:underline"
              >
                Создать тест
              </Link>
              <Link
                href="/classroom/choose"
                className="hover:underline"
              >
                Классы
              </Link>
              <Link
                href="/classroom/create"
                className="hover:underline"
              >
                Создать класс
              </Link>
            </>
          )}
          {userRole === 'student' && (
            <Link
              href="/classroom"
              className="hover:underline"
            >
              Мои классы
            </Link>
          )}
          <Link
            href="/test/choose-test"
            className="hover:underline"
          >
            Тесты
          </Link>
          {userRole === "admin" && (
            <Link
            href="/subjects"
            className="hover:underline"
          >
            Предметы
          </Link>
          )}
          <Link
            href="/statistics"
            className="hover:underline"
          >
            Статистика
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
          <ul className="space-y-2 text-center">
            <li>
              <Link
                href="/"
                className="block hover:underline"
                onClick={toggleMenu}
              >
                Главная
              </Link>
            </li>
            <SignedIn>
              <li>
                <Link
                  href="/Courses"
                  className="hover:underline"
                  onClick={toggleMenu}
                >
                  Курсы
                </Link>
              </li>
            </SignedIn>
            <SignedIn>
              <li>
                <Link
                  href="/forum"
                  className="block hover:underline"
                  onClick={toggleMenu}
                >
                  Форум
                </Link>
              </li>
            </SignedIn>
            {userRole === "teacher" && (
              <>
                <li>
                  <Link
                    href="/test/create"
                    className="block hover:underline"
                    onClick={toggleMenu}
                  >
                    Создать тест
                  </Link>
                </li>
                <li>
                  <Link
                    href="/classroom/choose"
                    className="block hover:underline"
                    onClick={toggleMenu}
                  >
                    Классы
                  </Link>
                </li>
                <li>
                  <Link
                    href="/classroom/create"
                    className="block hover:underline"
                    onClick={toggleMenu}
                  >
                    Создать класс
                  </Link>
                </li>
              </>
            )}
            {userRole === "student" && (
              <li>
                <Link
                  href="/classroom"
                  className="block hover:underline"
                  onClick={toggleMenu}
                >
                  Мои классы
                </Link>
              </li>
            )}
            <li>
              <Link
                href="/test/choose-test" 
                className="block hover:underline"
                onClick={toggleMenu}
              >
                Тесты
              </Link>
            </li>
            {userRole === "admin" && (
              <li>
                <Link
                  href="/subjects" 
                  className="block hover:underline"
                  onClick={toggleMenu}
                >
                  Предметы
                </Link>
            </li>
            )}
            <li>
              <Link
                href="/statistics"
                className="block hover:underline"
                onClick={toggleMenu}
              >
                Статистика
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}