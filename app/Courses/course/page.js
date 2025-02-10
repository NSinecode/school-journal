"use client";
import { useState, useEffect } from "react";
import { getCourseAction } from "@/actions/courses-actions";
import { Document, Page } from "react-pdf";
import { pdfjs } from 'react-pdf';
import { ArrowBigRight, ArrowBigLeft } from 'lucide-react';
import ReactPlayer from 'react-player';
import TestPage from "@/components/Courses/test";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;


export default function CoursePage() {
    const [courseId, setCourseId] = useState(null);
    const [course, setCourse] = useState(null);
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [page, setPage] = useState(1);

    useEffect(() => {
        // Get test ID from URL
        const params = new URLSearchParams(window.location.search)
        const id = params.get("id");
        const num = Number(id);
        setCourseId(num);
    }, [])
    useEffect(() => {
        async function fetchCourse() {
            const res = await getCourseAction(courseId);
            setCourse(res.data);
        }
        fetchCourse();
    }, [courseId]);
    const goToPres = async () => {
      setPageNumber(1);
      setPage(1);
    }

    if (!course) {
        return <h1>Loading...</h1>
    }
  
    return (
      <div className="flex flex-col gap-5 mx-auto w-full max-w-2xl items-center">
        <div className="p-4">
          <h1 className="text-white text-4xl font-mono">{course.title}</h1>
        </div>
        <div className="wt-1 wb-1 border-b-2 border-white w-full flex gap-5 transition-all duration-1000">
          <button 
            className={`text-lg font-semibold pr-2 pl-2 rounded-t-lg transition-colors duration-500 ${Number(page) == Number(1) ? "bg-white text-black" : ""}`}
            onClick={() => setPage(1)}
          >
            Presentation
          </button>
          {course.video_url ? (
            <button 
            className={`text-lg font-semibold pr-2 pl-2 rounded-t-lg transition-colors duration-500 ${Number(page) == Number(2) ? "bg-white text-black" : ""}`}
            onClick={() => setPage(2)}
          >
            Video
          </button>
          ) : null}
          {course.test_id ? (
            <button 
              className={`text-lg font-semibold pr-2 pl-2 rounded-t-lg transition-colors duration-500 ${Number(page) == Number(3) ? "bg-white text-black" : ""}`}
              onClick={() => setPage(3)}
            >
              Test
            </button>
          ) : null}
        </div>
        {page === 1 ? (
          <div className="flex flex-col items-center">
            <Document
              file={course.presentation} // Путь к файлу
              onLoadSuccess={({ numPages }) => setNumPages(numPages)}
            >
              <Page pageNumber={pageNumber} renderTextLayer={false} renderAnnotationLayer={false}/>
            </Document>
      
            {/* Кнопки навигации */}
            <div className="mt-4 flex gap-2 w-full">
              <div className="flex">
                <button
                  className="p-2 bg-blue-500 rounded disabled:opacity-50"
                  disabled={pageNumber <= 1}
                  onClick={() => setPageNumber(pageNumber - 1)}
                >
                  <ArrowBigLeft className="h-6 w-8"/>
                </button>
        
                <p className="mt-2 font-extrabold font-sans pr-2 pl-2">
                  {pageNumber} / {numPages}
                </p>
        
                <button
                  className="p-2 bg-blue-500 rounded disabled:opacity-50"
                  disabled={pageNumber >= numPages}
                  onClick={() => setPageNumber(pageNumber + 1)}
                >
                  <ArrowBigRight className="h-6 w-8"/>
                </button>
              </div>
              {course.test_id ? (
                <div className="flex justify-end">
                  <button 
                    className={`rounded p-2 ${pageNumber >= numPages ? "bg-yellow-500" : "bg-gray-600 "}`}
                    disabled={pageNumber < numPages}
                    onClick={() => setPage(3)}
                  >
                    Go to test
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        ) : null}
        {page === 2 ? (
          <div className="w-full flex items-center">
            <ReactPlayer 
              url={course.video_url} 
              controls 
              width="100%"
            />
          </div>
        ) : null}
        {page === 3 ? (
          <TestPage 
            test_id = {course.test_id}
            goToPres = {goToPres}
          />
        ) : null }
      </div>
    );
}