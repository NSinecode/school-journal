import { useState } from "react";

export default function SearchBar({ courses }) {
  const [query, setQuery] = useState("");

  // Фильтрация статей по заголовку
  const filteredArticles = courses.filter((course) =>
    course.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="w-full max-w-md mx-auto">
      <input
        type="text"
        placeholder="Enter the course name..."
        className="w-full p-2 border rounded-md"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filteredArticles.length > 0 ? (
            filteredArticles.map((course) => (
            <div key={course.id} className="card mt-5">
                <div className="card-image">
                {course.imageUrl ? (
                    <img
                    src={course.imageUrl} // изображение, если оно есть
                    alt={course.title}
                    className="card-img"
                    />
                ) : (
                    <div className="no-image-bg">
                    <h2 className="no-image-title">{course.title}</h2>
                    </div>
                )}
                </div>
                <div className="card-content">
                <h3 className="card-title">{course.title}</h3>
                </div>
            </div>
            ))
        ) : (
            <p className="col-span-full text-gray-500 text-center mt-4">Ничего не найдено</p>
        )}
        </div>
    </div>
  );
}