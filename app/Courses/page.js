"use client";
import { useState } from "react";
import Head from "next/head";
import SearchBar from "../../components/SearchBar";

export default function MyPage() {
  
  const [courses, setCourses] = useState([
    { id: 1, title: "Основы программирования"},
    { id: 2, title: "Frontend-разработка с React"},
    { id: 3, title: "Backend на Node.js"},
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newImage, setNewImage] = useState("");
  const [isError, setIsError] = useState(false);
  const [shake, setShake] = useState(false);

  const handleAddCourse = () => {
    if (!newTitle.trim()) {
      setIsError(true);
      setShake(true);
      setTimeout(() => setShake(false), 500); // Останавливаем тряску
      return;
    }
    setCourses([...courses, { id: Date.now(), title: newTitle }]);
    setNewTitle("");
    setIsError(false);
    setIsModalOpen(false);
  };

  // Функция открытия и закрытия окна
  const toggleModal = () =>  { 
    setIsModalOpen(!isModalOpen);
    setIsError(false); 
  };

  // Функция добавления нового курса
  const addCourse = () => {
    if (!newTitle.trim()) {
      setIsError(true);
      return;
    };

    const newCourse = {
      id: courses.length + 1,
      title: newTitle,
      imageUrl: newImage || null,
    };

    setCourses([...courses, newCourse]);
    setNewTitle("");
    setNewImage("");
    setIsError(false);
    toggleModal();
  };

  return (
    <>
      <Head>
        <title>Моя страница</title>
      </Head>
      <div>
        <h1 className="flex flex-col items-center p-5">Courses searching</h1>
        <div className="flex justify-center">
          <button onClick={toggleModal} className="flex justify-center p-2 bg-blue-500 text-white rounded-lg mb-4">
            Create course
          </button>
        </div>
        <SearchBar courses={courses}/>
        {/* Модальное окно */}
        {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div
            className={`bg-black p-6 w-[400px] rounded-lg shadow-lg transition-transform ${
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
      <script src="/Courses/script.js" />
      <link rel="stylesheet" href="/Courses/style.css" />
    </>
  );
}