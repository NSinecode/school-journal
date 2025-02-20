import { Trash2, Bookmark, ArrowRight } from "lucide-react";
import { useState,useEffect } from "react";
import { updateProfileAction } from "@/actions/profiles-actions";
import { SignedIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function CourseCard({ course, uId, dClick, isExp, isExpanded, profile }) {
  const router = useRouter();
  const flag = profile ? profile.marked_courses.includes(course.id) : false;
  const [isMarked, setIsMarked] = useState(false);

  useEffect(() => {
      function setMarked() {
        setIsMarked(flag);
      }
      setMarked()
  }, [flag]);

  const handleMark = async () => {
    if (profile) {
      if (!isMarked) {
        const newMC = [...profile.marked_courses, course.id];
        await updateProfileAction(profile.userId, {marked_courses: newMC});
      } else {
        const newMC = profile.marked_courses.filter((id) => id != course.id);
        await updateProfileAction(profile.userId, {marked_courses: newMC});
      }
      router.refresh();
    }
  }

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
            transition-all duration-300"
            >
              <p className="w-1/3 text-sm md:text-base break-words font-bold uppercase text-black">{course.description || "No description available"}</p>
            </div>
        ) : null}
        <div className="card-content">
            <h3 className="card-title">{course.title}</h3>
            {isExpanded ? (
            <div className="flex justify-between gap-1 absolute right-1 bottom-1">
                <SignedIn>
                  {uId != course.author_id ?(
                      <button
                        className={`bottom-1 rounded-lg p-1 transition-colors duration-400 ${profile && isMarked ? "bg-yellow-400" : "bg-gray-500"}`}
                        onClick={(e) => {
                          handleMark();
                          setIsMarked(!isMarked);
                          e.stopPropagation();
                        }}
                        >
                          <Bookmark className="h-4 w-4"></Bookmark>
                      </button>
                  ) : null }
                </SignedIn>
                <SignedIn>
                  {uId == course.author_id || profile.role == "admin" ? (
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
                </SignedIn>
                <button
                  className="bg-blue-500 bottom-1 rounded-lg p-1"
                  onClick={() => router.push(`/Courses/course?id=${course.id}`)}
                >
                  <ArrowRight className="h-4 w-4"/>
                </button>
            </div>
            ) : null }
        </div>
    </div>
    ) 
}