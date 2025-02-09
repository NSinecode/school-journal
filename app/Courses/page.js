"use client";
export const dynamic = "force-dynamic";

import { X } from 'lucide-react';
import { useState, useEffect } from "react";
import { createCourseAction } from "@/actions/courses-actions";
import { SignedIn, useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { getTestsAction } from '@/actions/tests-actions'
import { getProfileByUserIdAction } from "@/actions/profiles-actions";

import Head from "next/head";
import SearchBar from "../../components/courses/SearchBar";
import UploadForm from "../../components/courses/uploadForm";

export default function Courses() {
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const [courses, setCourses] = useState([]);
  const [userId, setUserId] = useState("");
  const [profile, setProfile] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newTags, setNewTags] = useState("");
  const [tagsArr, setTagsArr] = useState([]);
  const [selectedTest, setSelectedTest] = useState();
  const [fileUrl, setFileUrl] = useState('');
  const [video, setVideo] = useState('');

  const [isError, setIsError] = useState(false);
  const [isErrorTag, setIsErrorTag] = useState(false);
  const [shake, setShake] = useState(false);

  const [tests, setTests] = useState([]);

  const [isLoaded, setIsLoaded] = useState(false);
  const [loading, setLoading] = useState(true);

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
    async function fetchProfile() {
        if (userId != "FUCKIN GOD" && isSignedIn) {
            const res = await getProfileByUserIdAction(userId);
            if (res.status === "success") {
                if (isSignedIn && res?.data) {
                    setProfile(res.data);
                    setLoading(false);
                }
            } else {
                console.error("Не удалось получить профиль")
            }
        } else {
            setLoading(false);
            setProfile(null);
        }
    }
    fetchProfile();
  }, [userId], [isSignedIn]);

  useEffect(() => {
      async function loadTests() {
        if (isModalOpen) {
          const result = await getTestsAction()
          if (result.status === 'success' && result.data) {
            setTests(result.data)
          }
        }
      }
      loadTests()
    }, [isModalOpen])
  
  
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

  const handleTagsAdd = async (event) => {
    if(event.key == "Enter") {
      if (newTags.includes("/") || 
        tagsArr.some(tag => newTags.split(" ").includes(tag))
      ) {
        setIsErrorTag(true);
        setShake(true);
        setTimeout(() => setShake(false), 500); // Останавливаем тряску
        return;
      } 
      setTagsArr([...tagsArr, ...newTags.split(" ")]);
      setNewTags("");
    }
  }

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
    const newTagReady = tagsArr.join("/"); 
    
    const optimisticCourse = {
      id: tempId,
      title: newTitle,
      author_id: userId,
      description: newDescription,
      tags: newTagReady,
      test_id: Number(selectedTest),
      presentation: fileUrl,
      video_url: video
    };

    setCourses((prevCourses) => [...prevCourses, optimisticCourse]);
    await createCourseAction({title: newTitle, author_id: userId, description: newDescription, tags: newTagReady, test_id: selectedTest, presentation: fileUrl, video_url: video});
    setIsModalOpen(false);
    setNewTitle("");
    setNewDescription("");
    setSelectedTest(null);
    setIsLoaded(false);
    setVideo('');
    router.refresh();
  };

  const handleChange = (event) => {
    const selectedName = event.target.value;
    const test = tests.find((test) => test.name === selectedName);
    if (test) {
      setSelectedTest(test.id.toString());
    }
  };

  // Функция открытия и закрытия окна
  const toggleModal = () =>  { 
    setIsModalOpen(!isModalOpen);
    setIsError(false); 
    router.refresh();
  };

  if(loading) {
    return <h1>Loading...</h1>
  }

  return (
    <>
      <Head>
        <title>Courses</title>
      </Head>
      <div>
        <h1 className="flex flex-col items-center p-5">Courses searching</h1>
        <SignedIn>
          {profile && profile.role == "teacher" ? (
          <div className="flex justify-center">
            <button onClick={toggleModal} className="flex justify-center p-2 bg-blue-500 text-white rounded-lg mb-4 hover:bg-blue-600 transition relative">
              Create course
            </button>
          </div>
          ) : null}
        </SignedIn>
        <SearchBar courses = { courses } userId = { userId } delClick={ handleClick } profile={ profile }/>
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
              onKeyPress={handleTagsAdd}
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
              placeholder="Enter the tags through a space or enter"
            />
            <div
              className="grid grid-cols-3 gap-2 mt-2"
            >
              {tagsArr.length > 0 ? (
                tagsArr.map((tag) => tag ? (
                  <div
                    key={tag}
                    className="flex gap-1 rounded-xl bg-blue-600 opacity-70 p-1"
                  >
                    <div
                      className="flex justify-start"
                    >
                      <button onClick={() => setTagsArr(tagsArr.filter((tAg) => tAg != tag))}>
                        <X className="w-5 h-5"/>
                      </button>
                    </div>
                    <p 
                      className="w-full text-ellipsis overflow-hidden"
                    >#{tag}</p>
                  </div>
                ) : null)
              ) : null}
            </div>
            <input
              type="text"
              value={video}
              onChange={(e) => {
                setVideo(e.target.value);
              }}
              className="w-full p-2 border rounded mt-3 border-gray-300"
              placeholder="Enter the video URL"
            />
            <input 
              value={tests.find((test) => test.id.toString() === selectedTest)?.name || ""}
              onChange={handleChange}
              list="test-list" 
              name="test" 
              className="w-full p-2 border rounded mt-3 border-gray-300" 
              placeholder="Choose test"
            />
            <datalist id="test-list">
              {tests.map((test) => (
                <option key={test.id} value={test.name} />
              ))}
            </datalist>
            <UploadForm 
              onFileUpload={setFileUrl}
              isLoaded={setIsLoaded}
            />
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-700 rounded">
                Cancel
              </button>
              <button onClick={handleAddCourse} disabled={!isLoaded} className="px-4 py-2 bg-blue-500 disabled:opacity-50 text-white rounded">
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