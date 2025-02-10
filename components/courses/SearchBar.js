"use client";
import { useState, useRef, useEffect } from "react";
import { getClassroomsAction } from "@/actions/classroom-actions";
import { SignedIn } from "@clerk/nextjs";
import CourseCard from "./CourseCard";

export default function SearchBar( { courses, userId, delClick, profile, subjects } ) {
  const [filters, setFilters] = useState({
    authorMe: false,
    authorOther: false,
    withVideo: false,
    marked: false,
    ege: false
  });
  const [homework, setHomework] = useState([]);
  const [subjectsWithFlag, setSubjectsWithFlag] = useState([]);
  const filtersRend = filters;
  const [query, setQuery] = useState("");
  const [tagString, setTags] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef(null);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    const swf = subjects.map(subject => ({
      ...subject,
      isSelected: false, 
    }));
    setSubjectsWithFlag(swf);
  },[subjects])

  useEffect(() => {
    async function fetchHomework() {
      if (profile && profile.my_classroom && profile.role == "student") {
        const classrooms = await getClassroomsAction();
        if (classrooms.status == "success") {
          const studentClassrooms = classrooms.data.filter(classroom => profile.my_classroom.includes(Number(classroom.id)));
          const homeworks = studentClassrooms.flatMap(classroom => classroom.homework || []);
          setHomework(homeworks);
        }
      }
    }
    fetchHomework();
  },[profile])
  useEffect(() => {
    console.log(homework);
  }, [homework])

  const handleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id)); 
  };

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: checked,
    }));
  };
  const handleSubjectChange = (event) =>{
    const { name, checked } = event.target;
    setSubjectsWithFlag(prevSubs => 
      prevSubs.map(subject => 
        subject.name == name ? {...subject, isSelected: checked} : subject
      )
    );
  }

  
  useEffect(() => {
    function handleClickOutside() {
      // if (filterRef.current && !filterRef.current.contains(event.target)) {
      //   setIsFilterOpen(false);
      // }
    }
    if (isFilterOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isFilterOpen]);

  const tagss = tagString === "" ? null : tagString.toLowerCase().split(" ");
  const activeSubjectIds = subjectsWithFlag
    .filter(subject => subject.isSelected)
    .map(subject => subject.id);
  let filteredCourses = courses.filter((course) => course.title.toLowerCase().includes(query.toLowerCase()));
  filteredCourses = tagss != null ? filteredCourses.filter((course) => tagss.every((tag) => {
    const match = course.tags.toLowerCase().includes(tag);
    return match;
  })) : filteredCourses;
  filteredCourses = filteredCourses.filter(course => 
    (!filters.authorMe || (course.author_id == userId) === filters.authorMe) &&
    (!filters.authorOther || (course.author_id != userId) === filters.authorOther) &&
    (!filters.marked || (profile.marked_courses.includes(course.id)) === filters.marked) &&
    (!filters.withVideo || (course.video_url != null && course.video_url.trim() != "") === filters.withVideo) && 
    (!filters.ege || (course.tags.toLowerCase().includes("ЕГЭ".toLowerCase()))) && 
    (activeSubjectIds.length === 0 || activeSubjectIds.includes(String(course.subject)))
  );
  const homeworkCourses = filteredCourses.filter(course => homework.includes(course.id));

  return (
    <div className="relative min-h-screen"> 
      <aside className="w-full max-w-md mx-auto">
        <div className="grid items-center gap-4 z-10 pb-3 border-b shadow-md">
          <div className="flex justify-between">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="bg-blue-500 text-white mr-3 px-4 py-2 rounded-md shadow-md hover:bg-blue-600 transition relative"
            >
              Фильтры
            </button>
            <input
              type="text"
              placeholder="Введите название курса..."
              className="flex-1 w-full p-2 border rounded-md"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          {isFilterOpen && (
          <div
            ref={filterRef}
            className="w-full bg-gray-800 shadow-lg border rounded-md p-4 transition-transform duration-200"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Столбец с фильтрами */}
            <div>
              <h4 className="font-semibold mb-2">Предмет</h4>
              {subjectsWithFlag.map(subject => (
              <label className="block mb-2" key={subject.id}>
                <input 
                  type="checkbox" 
                  className="mr-2" 
                  name={subject.name}
                  checked={subject.isSelected}
                  onChange={handleSubjectChange}
                />
                {subject.name}
              </label>
              ))}
            </div>

            {/* Столбец с фильтрами */}
            <div className="flex flex-col gap-2">
              <SignedIn>
                <div>
                  <h4 className="font-semibold mb-2">Автор</h4>
                  <label className="block mb-2">
                    <input 
                      type="checkbox" 
                      className="mr-2" 
                      name="authorMe"
                      checked={ filtersRend.authorMe }
                      onChange={ handleCheckboxChange }
                    />
                    Я
                  </label>
                  <label className="block mb-2">
                    <input 
                      type="checkbox" 
                      className="mr-2" 
                      name="authorOther"
                      checked={ filtersRend.authorOther }
                      onChange={ handleCheckboxChange }
                    />
                    Другой
                  </label>
                </div>
              </SignedIn>

              {/* Столбец с фильтрами */}
              <div>
                <h4 className="font-semibold mb-2">Другие фильтры</h4>
                <label className="block mb-2">
                <input 
                    type="checkbox" 
                    className="mr-2" 
                    name="withVideo"
                    checked={ filtersRend.withVideo }
                    onChange={ handleCheckboxChange }
                  />
                    С видео
                </label>
                <SignedIn>
                  <label className="block mb-2">
                  <input 
                      type="checkbox" 
                      className="mr-2" 
                      name="marked"
                      checked={ filtersRend.marked }
                      onChange={ handleCheckboxChange }
                    />
                      В закладках
                  </label>
                </SignedIn>
                <label className="block mb-2">
                  <input 
                      type="checkbox" 
                      className="mr-2" 
                      name="ege"
                      checked={ filtersRend.ege }
                      onChange={ handleCheckboxChange }
                    />
                    ЕГЭ
                </label>
              </div>
            </div>
          </div>
            <input
              type="text"
              placeholder="Введите теги через пробел"
              className="flex-1 w-full p-2 border rounded-md mt-5"
              value={tagString}
              onChange={(e) => setTags(e.target.value)}
            />
          </div>
        )}
        </div>
        {profile && profile.role == "student" && homeworkCourses.length > 0 ? (
          <div>
            <h2 className="mt-2 text-3xl font-bold opacity-40">Домашнее задание</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-10 grid-rows-auto transition-all duration-300">
              {homeworkCourses && homeworkCourses.length > 0 ? (
                homeworkCourses.map((course) => course.id ? (
                  <CourseCard 
                    key={course.id} 
                    course={course} 
                    uId={ userId } 
                    dClick={ delClick }
                    isExpanded={expandedId === course.id}
                    isExp={ handleExpand }
                    profile={profile}
                  />
                ) : null)
              ) : (
                  <p className="col-span-full text-gray-500 text-center mt-4">Домашнего задания нет!</p>
              )}
            </div>
            <h2 className="mt-2 text-3xl font-bold opacity-40">Все курсы</h2>
          </div>
        ): null}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-10 grid-rows-auto transition-all duration-300">
          {filteredCourses && filteredCourses.length > 0 ? (
              filteredCourses.map((course) => course.id ? (
                <CourseCard 
                  key={course.id} 
                  course={course} 
                  uId={ userId } 
                  dClick={ delClick }
                  isExpanded={expandedId === course.id}
                  isExp={ handleExpand }
                  profile={profile}
                />
              ) : null)
          ) : (
              <p className="col-span-full text-gray-500 text-center mt-4">Нет курсов</p>
          )}
        </div>
      </aside>
    </div>
  );
}