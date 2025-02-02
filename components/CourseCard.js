import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Pencil } from "lucide-react";
import { Bookmark } from "lucide-react";

export default function CourseCard({ course, uId, dClick, isExp, isExpanded }) {

  return (
    <div
      key={ course.id }
      className={` mt-4 relative bg-white rounded-lg cursor-pointer overflow-hidden
      transition-all duration-300 ease-in-out
      ${isExpanded ? "col-span-3 row-span-1 card-expanded" : "card col-span-1"} relative`}
      onClick={() => isExp(course.id)}
      > 
        <div className="card-image">
          {course.imageUrl ? (
          <img
          src={course.imageUrl} // изображение, если оно есть
          alt={course.title}
          className="card-img"
        />
            ) : (
            <div className="no-image-bg">
                <h2 className="no-image-title ml-2">{course.title}</h2>
            </div>
            )}
        </div>
        {isExpanded && course.description ? (
            <div
              className="w-full absolute inset-0 bg-gradient-to-l from-black/20 to-transparent 
            flex justify-end text-white p-4 text-right 
            transition-opacity duration-300"
            >
              <p className="w-1/3 text-sm md:text-base break-words font-bold uppercase text-black">{course.description || "No description available"}</p>
            </div>
        ) : null}
        <div className="card-content">
            <h3 className="card-title">{course.title}</h3>
            {isExpanded ? (
            <div className="flex justify-between gap-1 absolute right-1 bottom-1">
                {uId != course.author_id ?(
                    <button
                    className="bg-gray-500 bottom-1 rounded-lg p-1"
                    >
                        <Bookmark className="h-4 w-4"></Bookmark>
                    </button>
                ) : null }
                {uId == course.author_id ? (
                    <button
                      className="bg-gray-500 bottom-1 rounded-lg p-1"
                    >
                        <Pencil className="h-4 w-4"></Pencil>
                    </button>
                ) : null }
                {uId == course.author_id ? (
                    <button
                      className="bg-gray-500 bottom-1 rounded-lg p-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        dClick(course.id);
                      }}
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>
                ) : null }
            </div>
            ) : null }
        </div>
    </div>
    ) 
}