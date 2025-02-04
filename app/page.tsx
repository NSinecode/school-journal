"use client"

//import Script from "next/script";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";

export default function Home() {
  const { isSignedIn } = useUser();

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
            
            {/* Login/Register/Profile Buttons */}
            <div className="flex gap-4 max-w-md">
              {isSignedIn ? (
                <Button
                  className="flex-1"
                  onClick={() => window.location.href = '/profile'}
                >
                  Профиль
                </Button>
              ) : (
                <>
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
                </>
              )}
            </div>

            
          </div>

          {/* Right side - Crypto prices */}
          <div className="bg-[#1E2329] rounded-lg p-6">
            <div className="grid grid-cols-2 gap-6">
              {/* Left Column - Olympiads */}
              <div className="space-y-6">
                <h2 className="text-lg font-medium">Ближайшие олимпиады</h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>14 фев - Иннополис (ИНФ)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>21 фев - Иннополис (ИНФ БЕЗ)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>28 фев - Иннополис (МАТ)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>2 мар - СПбАстро - практика</span>
                  </div>
                </div>
              </div>

              {/* Right Column - ЕГЭ */}
              <div className="space-y-6">
                <h3 className="text-[#848E9C] hover:text-white mb-3">ЕГЭ</h3>
                <div className="text-sm space-y-2">
                  <div>География - 23 мая</div>
                  <div>Литература - 23 мая</div>
                  <div>Химия - 23 мая</div>
                  <div>Русский язык - 28 мая, 29 мая</div>
                  <div>Математика (базовый) - 31 мая, 1 июня</div>
                  <div>Математика (профильный) - 31 мая, 1 июня</div>
                  <div>Обществознание - 4 июня</div>
                  <div>Информатика - 7 и 8 июня</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
