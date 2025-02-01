"use client";
export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { createCourseAction } from "@/actions/courses-actions";
import { SignedIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Head from "next/head";
import SearchBar from "../../components/SearchBar";

export default function Courses() {
  const router = useRouter();
  const [courses, setCourses] = useState([]);
  const [userId, setUserId] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [isError, setIsError] = useState(false);
  const [shake, setShake] = useState(false);

  useEffect(() => {
    async function fetchUserId() {
      try {
        const res = await fetch("/api/user");
        if (!res.ok) throw new Error("Ошибка при получении userId");
        
        const data = await res.json();
        setUserId(data.userId);
      } catch (err) {
        console.error("❌ Ошибка загрузки userId:", err);
      }
    }

    fetchUserId();
  }, []);
  
  useEffect(() => {
      async function fetchCourses() {
        try {
          const res = await fetch("/api/courses");
          if (!res.ok) throw new Error("Ошибка загрузки курсов");
          const data = await res.json();
          setCourses(data);
        } catch (error) {
          console.error("Ошибка при загрузке:", error);
        }
      }
      fetchCourses();
    }, []);

    const handleClick = async () => {
      if (!delId) return; // Если id не задано, ничего не делаем
  
      try {
        const res = await fetch(`/api/delCourse/${delId}`, {
          method: "POST", // или POST, если необходимо отправить данные в теле
          headers: {
            "Content-Type": "application/json",
          },
        });
  
        if (!res.ok) throw new Error("Ошибка при получении данных");
        
        setCourses((prevCourses) => prevCourses.filter((course) => (course.id != delId)))
        const data = await res.json();
        setResponse(data); // Сохраняем ответ от API
      } catch (error) {
        console.error("Ошибка при запросе:", error);
      }
    };

  const handleAddCourse = async () => {
    const tempId = Date.now();
    if (newTitle.trim() == "") {
      setIsError(true);
      setShake(true);
      setTimeout(() => setShake(false), 500); // Останавливаем тряску
      return;
    }
    const optimisticCourse = {
      id: tempId,
      title: newTitle,
      author_id: userId
    };

    setCourses((prevCourses) => [...prevCourses, optimisticCourse]);
    await createCourseAction({title: newTitle, author_id: userId});
    setIsModalOpen(false);
    setNewTitle("");
    router.refresh();
  };
  // Функция открытия и закрытия окна
  const toggleModal = () =>  { 
    setIsModalOpen(!isModalOpen);
    setIsError(false); 
    router.refresh();
  };


  return (
    <>
      <Head>
        <title>Courses</title>
      </Head>
      <div>
        <h1 className="flex flex-col items-center p-5">Courses searching</h1>
        <SignedIn>
          <div className="flex justify-center">
            <button onClick={toggleModal} className="flex justify-center p-2 bg-blue-500 text-white rounded-lg mb-4">
              Create course
            </button>
          </div>
        </SignedIn>
        <SearchBar courses = { courses } userId = { userId }/>
        {/* Модальное окно */}
        {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div
            className={`bg-gray-800 p-6 w-[400px] rounded-lg shadow-lg transition-transform ${
              shake ? "animate-shake" : ""
            }`}
          >
            <h2 className="text-lg font-bold mb-4">Create course</h2>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => {
                setNewTitle(e.target.value);
                setIsError(false);
              }}
              className={`w-full p-2 border rounded ${
                isError ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter the name"
            />
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-700 rounded">
                Cancel
              </button>
              <button onClick={handleAddCourse} className="px-4 py-2 bg-blue-500 text-white rounded">
                Create
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
      <link rel="stylesheet" href="/Courses/style.css" />
    </>
  );
}