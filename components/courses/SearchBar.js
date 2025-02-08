"use client";
import { useState, useRef, useEffect } from "react";
import CourseCard from "./CourseCard";

export default function SearchBar( { courses, userId, delClick } ) {
  const [filters, setFilters] = useState({
    authorMe: false,
    authorOther: false
  });
  const filtersRend = filters;
  const [query, setQuery] = useState("");
  const [tagString, setTags] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef(null);
  const [expandedId, setExpandedId] = useState(null);

  const handleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id)); // Устанавливаем id карточки, которая расширена
  };

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: checked,
    }));

    console.log(!(filters.authorMe == (courses[1].author_id == userId)));
  };
  const isFilterActive = Object.values(filters).some((value) => value);

  // Закрываем меню при клике вне его
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

  const filteredCoursesSearch = courses.filter((course) => course.title.toLowerCase().includes(query.toLowerCase()))
  
  const filteredCoursesTags = tagss != null ? filteredCoursesSearch.filter((course) => tagss.every((tag) => {
    const match = course.tags.toLowerCase().includes(tag);
    return match;
  })) : filteredCoursesSearch;

  const filteredCourses = isFilterActive
    ? filteredCoursesTags.filter((course) => (filters.authorMe == (course.author_id == userId)) || (filters.authorOther == (course.author_id != userId))) // фильтруем по категории
    : filteredCoursesTags; // если все чекбоксы `false`, показываем все

  return (
    <div className="relative min-h-screen"> 
      <aside className="w-full max-w-md mx-auto">
        <div className="grid flex items-center gap-4 z-10 pb-3 border-b shadow-md">
          <div className="flex justify-between">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="bg-blue-500 text-white mr-3 px-4 py-2 rounded-md shadow-md hover:bg-blue-600 transition relative"
            >
              Filters
            </button>
            <input
              type="text"
              placeholder="Enter the course name..."
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
              <h4 className="font-semibold mb-2">Subject</h4>
              <label className="block mb-2">
                <input type="checkbox" className="mr-2" />
                Programming
              </label>
              <label className="block mb-2">
                <input type="checkbox" className="mr-2" />
                Math
              </label>
              <label className="block mb-2">
                <input type="checkbox" className="mr-2" />
                English
              </label>
            </div>

            {/* Столбец с фильтрами */}
            <div>
              <h4 className="font-semibold mb-2">Author</h4>
              <label className="block mb-2">
                <input 
                  type="checkbox" 
                  className="mr-2" 
                  name="authorMe"
                  checked={ filtersRend.authorMe }
                  onChange={ handleCheckboxChange }
                />
                Me
              </label>
              <label className="block mb-2">
                <input 
                  type="checkbox" 
                  className="mr-2" 
                  name="authorOther"
                  checked={ filtersRend.authorOther }
                  onChange={ handleCheckboxChange }
                />
                Other
              </label>
            </div>

            {/* Столбец с фильтрами */}
            <div>
              <h4 className="font-semibold mb-2">Type</h4>
              <label className="block mb-2">
                <input type="checkbox" className="mr-2" />
                With video
              </label>
              <label className="block mb-2">
                <input type="checkbox" className="mr-2" />
                With presentation
              </label>
            </div>
          </div>
            <input
              type="text"
              placeholder="Enter the tags through space"
              className="flex-1 w-full p-2 border rounded-md mt-5"
              value={tagString}
              onChange={(e) => setTags(e.target.value)}
            />
          </div>
        )}
        </div>
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
                />
              ) : null)
          ) : (
              <p className="col-span-full text-gray-500 text-center mt-4">No results</p>
          )}
        </div>
      </aside>
    </div>
  );
}