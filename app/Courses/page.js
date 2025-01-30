"use client";
import Head from "next/head";

export default function MyPage() {
  return (
    <>
      <Head>
        <title>Моя страница</title>
      </Head>
      <div>
        <h2>Привет, это моя страница!</h2>
        <button id="myButton">Нажми меня</button>
      </div>
      <script src="/Courses/script.js" />
      <link rel="stylesheet" href="/Courses/style.css" />
    </>
  );
}