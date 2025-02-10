"use client";
export const dynamic = "force-dynamic";

import { X } from 'lucide-react';
import { useState, useEffect } from "react";
import { SignedIn, useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { getTestsAction } from '@/actions/tests-actions'
import { getProfileByUserIdAction } from "@/actions/profiles-actions";
import { getSubjectsAction, createSubjectAction } from '@/actions/subjects-actions';
import { supabase } from '@/lib/supabaseClient';

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
  const [isRequestOpen, setIsRequestOpen] = useState(false);

  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newTags, setNewTags] = useState("");
  const [tagsArr, setTagsArr] = useState([]);
  const [selectedTest, setSelectedTest] = useState();
  const [testInput, setInputValue] = useState("");
  const [selectedSubject, setSelectedSubject] = useState();
  const [fileUrl, setFileUrl] = useState('');
  const [video, setVideo] = useState('');

  const [isError, setIsError] = useState(false);
  const [isErrorTag, setIsErrorTag] = useState(false);
  const [isErrorTest, setIsErrorTest] = useState(false);
  const [isErrorSub, setIsErrorSub] = useState(false);
  const [isSubError, setIsSubError] = useState(false);
  const [shake, setShake] = useState(false);

  const [tests, setTests] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [subjectsAll, setSubjectsAll] = useState([]);

  const [newSubject, setNewSubject] = useState("");

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
          const result = await getTestsAction();
          if (result.status === 'success' && result.data) {
            setTests(result.data)
          }
        }
      }
      loadTests()
  }, [isModalOpen])
  useEffect(() => {
    async function loadSubjects() {
      const result = await getSubjectsAction();
      if (result.status === 'success' && result.data) {
        setSubjects(result.data?.filter(subject => subject.is_confirmed));
        setSubjectsAll(result.data);
      }
    }
    loadSubjects()
  }, [])
  
  
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
    try {
      let presToDel = (courses.find((course) => course.id == delId)).presentation.split("/");
      presToDel = presToDel[9].split("?")[0];
      const res = await fetch("/api/delCourse", {
        method: "POST", // или POST, если необходимо отправить данные в теле
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ delId }),
      });
      const { error } = await supabase
        .storage
        .from('course presentations')
        .remove([`uploads/${presToDel}`]);
      
      if (error) throw new Error("Ошибка при получении удалении презентации");
  
      if (!res.ok) throw new Error("Ошибка при получении данных");
        
      setCourses((prevCourses) => prevCourses.filter((course) => (course.id != delId)))
    } catch (error) {
      console.error("Ошибка при запросе:", error);
    }
  };

  const handleAddCourse = async () => {
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
    } else if (!tests.find(test => test.id == selectedTest)) {
      setIsErrorTest(true);
      setShake(true);
      setTimeout(() => setShake(false), 500); // Останавливаем тряску
      return;
    } else if (!subjects.find(subject => subject.id == selectedSubject)) {
      setIsErrorSub(true);
      setShake(true);
      setTimeout(() => setShake(false), 500); // Останавливаем тряску
      return;
    }
    const newTagReady = tagsArr.join("/"); 

    const { data, error } = await supabase
      .from("courses") // Название таблицы
      .insert({title: newTitle, author_id: userId, description: newDescription, tags: newTagReady, test_id: selectedTest, presentation: fileUrl, video_url: video, subject: Number(selectedSubject)}) // Вставляем данные
      .select(); // Запрашиваем сразу ID
    if (error) {
      console.error("Ошибка при добавлении курса:", error);
      return null;
    }

    const optimisticCourse = {
      id: data?.[0]?.id,
      title: newTitle,
      author_id: userId,
      description: newDescription,
      tags: newTagReady,
      test_id: Number(selectedTest),
      presentation: fileUrl,
      video_url: video,
      subject: Number(selectedSubject)
    };

    setCourses((prevCourses) => [...prevCourses, optimisticCourse]);
    setIsModalOpen(false);
    setNewTitle("");
    setNewDescription("");
    setSelectedTest(null);
    setIsLoaded(false);
    setVideo('');
    router.refresh();
  };

  const handleSubjectRequest = async () => {
    if (newSubject.trim() == "" || subjectsAll.find(subject => subject.name == newSubject)) {
      setIsSubError(true);
      setShake(true);
      setTimeout(() => setShake(false), 500); // Останавливаем тряску
      return;
    }
    await createSubjectAction({name: newSubject});
    setIsRequestOpen(false);
  }

  const handleTestChange = (event) => {
    const selectedName = event.target.value;
    const test = tests.find((test) => test.name === selectedName);
    if (test) {
      setSelectedTest(test.id.toString());
      setIsErrorTest(false);
    }
  };
  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  }

  const handleSubjectChange = (event) => {
    const selectedName = event.target.value;
    const subject = subjects.find((subject) => subject.name === selectedName);
    if (subject) {
      setSelectedSubject(subject.id.toString());
    }
  };
  const subjDel = (event) => {
    if (event.key == "Backspace") {
      setSelectedSubject("");
    }
  }

  // Функция открытия и закрытия окна
  const toggleModal = () =>  { 
    setIsModalOpen(!isModalOpen);
    setIsError(false); 
    router.refresh();
  };
  const handleRequest = () => {
    setIsModalOpen(false);
    setIsRequestOpen(true);
  };

  if(loading) {
    return <h1>Loading...</h1>
  }

  return (
    <>
      <Head>
        <title>Курсы</title>
      </Head>
      <div>
        <h1 className="flex flex-col items-center p-5">Поиск курсов</h1>
        <SignedIn>
          {profile && (profile.role == "teacher" || profile.role == "admin") ? (
          <div className="flex justify-center">
            <button onClick={toggleModal} className="flex justify-center p-2 bg-blue-500 text-white rounded-lg mb-4 hover:bg-blue-600 transition relative">
              Создать курс
            </button>
          </div>
          ) : null}
        </SignedIn>
        <SearchBar courses = { courses } userId = { userId } delClick={ handleClick } profile={ profile } subjects={ subjects }/>
        {/* Модальное окно */}
        {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div
            className={`bg-gray-800 p-6 w-[400px] rounded-lg shadow-lg transition-transform ${
              shake ? "animate-shake" : ""
            }`}
          >
            <h2 className="text-lg font-bold mb-4">Создать курс</h2>
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
              placeholder="Введите название"
            />
            <input
              type="text"
              value={newDescription}
              onChange={(e) => {
                setNewDescription(e.target.value);
              }}
              className="w-full p-2 border rounded mt-3 border-gray-300"
              placeholder="Введите описание"
            />
            <div className="flex gap-2">
              <button
                className="flex justify-center mt-3 p-2 text-xs bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition relative"
                onClick={handleRequest}
              >
                Оставить заявку на добавление предмета
              </button>
              <input 
                value={subjects.find((subject) => subject.id.toString() === selectedSubject)?.name || ""}
                onChange={(e) => {
                  handleSubjectChange(e);
                  setIsErrorSub(false);
                }}
                onKeyDown={(e) => subjDel(e)}
                list="subject-list" 
                name="subject" 
                className={`w-full p-2 border rounded mt-3 ${isErrorSub ? "border-red-500" : "border-gray-300"}`} 
                placeholder="Выберите предмет"
              />
              <datalist id="subject-list">
                {subjects.map((subject) => (
                  <option key={subject.id} value={subject.name} />
                ))}
              </datalist>
            </div>
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
              placeholder="Введите теги черех пробел или Enter"
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
              placeholder="Введите URL видео"
            />
            <input 
              value={testInput}
              onChange={handleInputChange}
              onBlur={handleTestChange}
              list="test-list" 
              name="test" 
              className={`w-full p-2 border rounded mt-3 ${isErrorTest ? "border-red-500" : "border-gray-300"}`} 
              placeholder="Выберите тест"
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
                Отменить
              </button>
              <button onClick={handleAddCourse} disabled={!isLoaded} className="px-4 py-2 bg-blue-500 disabled:opacity-50 text-white rounded">
                Создать
              </button>
            </div>
          </div>
        </div>
      )}
      {isRequestOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div
            className={`bg-gray-800 p-6 w-[400px] rounded-lg shadow-lg transition-transform ${
              shake ? "animate-shake" : ""
            }`}
          >
            <input
              type="text"
              value={newSubject}
              onChange={(e) => {
                setNewSubject(e.target.value);
                setIsSubError(false);
              }}
              className={`w-full p-2 border rounded ${
                isSubError ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Введите название предмета"
            />
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setIsRequestOpen(false)} className="px-4 py-2 bg-gray-700 rounded">
                Отменить
              </button>
              <button onClick={handleSubjectRequest} className="px-4 py-2 bg-blue-500 disabled:opacity-50 text-white rounded">
                Оставить заявку
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