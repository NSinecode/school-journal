'use client';

import { useState, useEffect } from 'react';
import { UserRound } from 'lucide-react';
import { ArrowBigUp } from 'lucide-react';
import { createMessageAction, updateMessageAction } from "@/actions/messages-actions";
import { getProfileByUserIdAction, updateProfileAction } from "@/actions/profiles-actions";
import { ArrowBigDown } from 'lucide-react';
import { SignedIn, useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { revalidatePath } from "next/cache";


export default function PostFeed() {
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const [posts, setPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userId, setUserId] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [shake, setShake] = useState(false);
  const [profile, setProfile] = useState();
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    async function fetchUserId() {
      if (isSignedIn) { // Используем isSignedIn внутри
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
      if (userId != "FUCKIN GOD") {
        const res = await getProfileByUserIdAction(userId);
        if (res.status === "success") {
          if (isSignedIn && res?.data) {
            setProfile(res);
            setLoading(false);
          }
        } else {
          console.error("Не удалось получить профиль")
        }
      } else {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [userId], [isSignedIn]);

  const handleUpdateScore = async (id, score, value) => {
    const path = "/forum";
    if (!profile.data.posts_liked.includes(Number(id))) { 
      setPosts((prevPosts) => prevPosts.map((post) => (post.id === id ? { ...post, score: score + value } : post)));
      
      const updatedPostsLiked = [...(profile.data.posts_liked || []), id];
      setProfile(await updateProfileAction(userId, { posts_liked: updatedPostsLiked}, path));
      await updateMessageAction(id, {score: score + value})
    } else {
      const updatedPostsLiked = profile.data.posts_liked.filter(pid => pid !== Number(id));
      setProfile(await updateProfileAction(userId, { posts_liked: updatedPostsLiked}, path));
      setPosts((prevPosts) => prevPosts.map((post) => (post.id === id ? { ...post, score: score - 1 } : post)));
      await updateMessageAction(id, {score: score -1 })
    }
    router.refresh();
  }
  
  const handleAddMessage = async () => {
    const tempId = parseInt(Math.abs(Math.cos(Date.now()) * 100), 10);
    if (newMessage.trim() === "") {
      setIsError(true);
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }
      const optimisticPost = {
        id: tempId,
        message: newMessage,
        author_id: userId,
        created_at: new Date().toISOString(),
        score: 0
      };
    
      setPosts((prevPosts) => [...prevPosts, optimisticPost]);
      await createMessageAction({author_id: userId, message: newMessage});
      setIsModalOpen(false);
      setNewMessage("");
  }


  

  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await fetch("/api/getMessages");
        if (!res.ok) throw new Error("Ошибка загрузки постов");
          const data = await res.json();
          setPosts(data);
        } catch (error) {
          console.error("Ошибка при загрузке:", error);
        }
      }
    fetchPosts();
  }, []);

  const sortedPostsByTime = posts.sort((a, b) => {
    const dateA = new Date(a.created_at).getTime();
    const dateB = new Date(b.created_at).getTime();
    return dateB - dateA; 
  });
  const sortedPostsByScore = sortedPostsByTime.sort((a, b) => {
    const ratingA = Number(a.score); 
    const ratingB = Number(b.score); 
    return ratingB - ratingA; 
  });

  const filteredPosts = sortedPostsByScore.filter(post =>
    post.message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <div>Загрузка...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="flex gap-2">
        {/* Кнопка добавления поста */}
        <SignedIn>
          <button 
            className="flex-1 w-full bg-blue-500 text-white py-2 rounded mb-4 hover:bg-blue-600 p-3"
            onClick={() => setIsModalOpen(true)}
          >
            New
          </button>
        </SignedIn>
        {/* Поисковая строка */}
        <input
            type="text"
            placeholder="Post search"
            className="flex-4 w-full p-2 border rounded mb-4"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>  
      {/* Лента постов */}
      <div className="space-y-4">
        {filteredPosts.length > 0 ? (
          filteredPosts.map(post => (
            <div key={post.id} className="p-4 rounded shadow">
              <div className="flex gap-2 w-full">
                <UserRound className="w-4 h-4"></UserRound>
                <p className="text-xs font-bold">{post.author_id}</p>
                <span className="text-xs text-blue-400">{
                    post.created_at.replaceAll("-", ".").replaceAll("T", " ").slice(0, -5)
                }</span>
              </div>
              <h3 className="font-bold text-white whitespace-pre-line mt-2">{post.message}</h3>
              <div className="flex border-b border-t mt-2">
                <button 
                  className="mt-1 mb-1"
                  onClick={() => handleUpdateScore(post.id, post.score, 1)}
                >
                  <ArrowBigUp className={`ml-2 w-8 h-8 pr-2 border-r 
                    ${profile.data.posts_liked.includes(Number(post.id)) ? "text-yellow-300" : ""}`}></ArrowBigUp>
                </button>
                <button 
                  className=""
                  onClick={() => handleUpdateScore(post.id, post.score, -1)}
                >
                  <ArrowBigDown className="w-8 h-8 pl-2 "></ArrowBigDown>
                </button>
                <h3 className={`mt-2 pl-3 
                  ${ post.score >= 0 ? "text-green-300" : "text-red-300"}`}>{ post.score }</h3>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">Connection error</p>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div
            className={`bg-gray-800 p-6 w-[400px] rounded-lg shadow-lg transition-transform ${
              shake ? "animate-shake" : ""
            }`}
          >
            <h2 className="text-lg font-bold mb-4">New post</h2>
            <textarea
              type="text"
              value={newMessage}
              onChange={(e) => {
                setNewMessage(e.target.value);
                setIsError(false);
              }}
              className={`w-full p-2 border rounded mt-3 border-gray-300 ${
                isError ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter the message"
            />
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-700 rounded">
                Cancel
              </button>
              <button onClick={handleAddMessage} className="px-4 py-2 bg-blue-500 text-white rounded">
                Post
              </button>
            </div>
          </div>
        </div>
      )}
      <link rel="stylesheet" href="/Courses/style.css" />
    </div>
  );
}