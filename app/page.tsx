"use client"

import Script from "next/script";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0B0E11] text-white">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          {/* Left side - Main text */}
          <div className="space-y-6">
            <h1 className="text-5xl font-bold leading-tight">
              Учитесь
              <br />
              Развивайтесь
              <br />
              Преодолевайте
              <br />
              Стремитесь
              <br />
              <span className="text-[#FCD535]">School Journal</span>
            </h1>
            
            {/* Login/Register Buttons */}
            <div className="flex gap-4 max-w-md">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => window.location.href = '/login'}
              >
                Вход
              </Button>
              <Button
                className="flex-1"
                onClick={() => window.location.href = '/signup'}
              >
                Регистрация
              </Button>
            </div>

            
          </div>

          {/* Right side - Crypto prices */}
          <div className="bg-[#1E2329] rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-medium">Ближайшие олимпиады</h2>
              <a href="#" className="text-[#848E9C] hover:text-white">ЕГЭ</a>
            </div>
            
            {/* Crypto list */}
            <div className="space-y-4">
              {/* Add your crypto price components here */}
            </div>
          </div>
        </div>
      </div>
      <Script src="/script.js" strategy="afterInteractive" />
    </div>
  );
}
