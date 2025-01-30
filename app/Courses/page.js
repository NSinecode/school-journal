"use client";
import Head from "next/head";
import SearchBar from "../../components/SearchBar";

export default function MyPage() {
  
  return (
    <>
      <Head>
        <title>Моя страница</title>
      </Head>
      <div>
        <h1 className="flex flex-col items-center p-10">Courses searching</h1>
        <SearchBar/>
      </div>
      <script src="/Courses/script.js" />
      <link rel="stylesheet" href="/Courses/style.css" />
    </>
  );
}