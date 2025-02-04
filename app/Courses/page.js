"use client";
export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { createCourseAction } from "@/actions/courses-actions";
import { SignedIn, useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Head from "next/head";
import SearchBar from "../../components/SearchBar";

export default function Courses() {
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const [courses, setCourses] = useState([]);
  const [userId, setUserId] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newTags, setNewTags] = useState("");

  const [isError, setIsError] = useState(false);
  const [isErrorTag, setIsErrorTag] = useState(false);
  const [shake, setShake] = useState(false);
    useEffect(() => {
    async function fetchUserId() {
      if (isSignedIn) {
        try {
          const res = await fetch("/api/user");
          if (!res.ok) throw new Error("Ошибка при получении userId");
            
          const data = await res.json();
          setUserId(data.userId);
        } catch (err) {
          console.error("❌ Ошибка загрузки userId:", err);
        }
      }
    }

    fetchUserId();
  }, [isSignedIn]);
  
  
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

    const handleClick = async (delId) => {
      if (!delId) return; // Если id не задано, ничего не делаем
      console.log(delId);
      try {
        const res = await fetch("/api/delCourse", {
          method: "POST", // или POST, если необходимо отправить данные в теле
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ delId }),
        });
  
        if (!res.ok) throw new Error("Ошибка при получении данных");
        
        setCourses((prevCourses) => prevCourses.filter((course) => (course.id != delId)))
      } catch (error) {
        console.error("Ошибка при запросе:", error);
      }
    };

  const handleAddCourse = async () => {
    const tempId = parseInt(Math.abs(Math.cos(Date.now()) * 100), 10);
    if (newTitle.trim() == "") {
      setIsError(true);
      setShake(true);
      setTimeout(() => setShake(false), 500); // Останавливаем тряску
      return;
    } else if (newTags.includes("/")) {
      setIsErrorTag(true);
      setShake(true);
      setTimeout(() => setShake(false), 500); // Останавливаем тряску
      return;
    }
    const newTagReady = newTags.replaceAll(", ", "/"); 
    
    const optimisticCourse = {
      id: tempId,
      title: newTitle,
      author_id: userId,
      description: newDescription,
      tags: newTagReady,
    };

    setCourses((prevCourses) => [...prevCourses, optimisticCourse]);
    await createCourseAction({title: newTitle, author_id: userId, description: newDescription, tags: newTagReady});
    setIsModalOpen(false);
    setNewTitle("");
    setNewDescription("");
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
        <SearchBar courses = { courses } userId = { userId } delClick={ handleClick }/>
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
            <input
              type="text"
              value={newDescription}
              onChange={(e) => {
                setNewDescription(e.target.value);
              }}
              className="w-full p-2 border rounded mt-3 border-gray-300"
              placeholder="Enter the description"
            />
            <input
              type="text" 
              spellCheck="false" 
              autoComplete="off" 
              autoCorrect="off" 
              value={newTags}
              onChange={(e) => {
                setNewTags(e.target.value);
                if (e.target.value.includes("/")) 
                  setIsErrorTag(true);
                else
                  setIsErrorTag(false);
              }}
              className={`w-full p-2 border rounded mt-3 ${
                isErrorTag ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter the tags through a commma"
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