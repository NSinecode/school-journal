import { useState } from "react";

export default function SearchBar({ data }) {
  const [query, setQuery] = useState("");

  const articles = [
    { id: 1, title: "Учимся JavaScript", imageUrl: "/_DSC168690.jpg"},
    { id: 2, title: "React: руководство"},
    { id: 3, title: "Next.js для начинающих"},
    { id: 4, title: "Trigonometry"}
  ];

  // Фильтрация статей по заголовку
  const filteredArticles = articles.filter((article) =>
    article.title.toLowerCase().includes(query.toLowerCase())
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
            filteredArticles.map((article) => (
            <div key={article.id} className="card mt-5">
                <div className="card-image">
                {article.imageUrl ? (
                    <img
                    src={article.imageUrl} // изображение, если оно есть
                    alt={article.title}
                    className="card-img"
                    />
                ) : (
                    <div className="no-image-bg">
                    <h2 className="no-image-title">{article.title}</h2>
                    </div>
                )}
                </div>
                <div className="card-content">
                <h3 className="card-title">{article.title}</h3>
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