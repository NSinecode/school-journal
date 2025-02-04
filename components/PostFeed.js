'use client';

import { useState, useEffect } from 'react';
import { createMessageAction, updateMessageAction, deleteMessageAction } from "@/actions/messages-actions";
import { getProfileByUserIdAction, updateProfileAction } from "@/actions/profiles-actions";
import { SignedIn, useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Post from "./PostBody";


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
            console.log(res.data);
            setProfile(res.data);
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
    const postsLiked = profile.posts_liked;
    const postsDisliked = profile.posts_disliked;
    const isLiked = postsLiked.includes(Number(id));
    const isDisliked = postsDisliked.includes(Number(id));
    if (!isLiked && !isDisliked) { 
      setPosts((prevPosts) => prevPosts.map((post) => (post.id === id ? { ...post, score: score + value } : post)));
      if (value > 0) {
        const updatedPostsLiked = [...(postsLiked || []), id];
        setProfile((await updateProfileAction(userId, { posts_liked: updatedPostsLiked}, path)).data);
      } else {
        const updatedPostsDisliked = [...(postsDisliked || []), id];
        setProfile((await updateProfileAction(userId, { posts_disliked: updatedPostsDisliked}, path)).data);
      }
      await updateMessageAction(id, {score: score + value})
    } else if (isLiked) {
      if (value > 0) {
        const updatedPostsLiked = postsLiked.filter(pid => pid !== Number(id));
        setProfile((await updateProfileAction(userId, { posts_liked: updatedPostsLiked}, path)).data);
        setPosts((prevPosts) => prevPosts.map((post) => (post.id === id ? { ...post, score: score - 1 } : post)));
        await updateMessageAction(id, {score: score - 1})
      } else {
        const updatedPostsLiked = postsLiked.filter(pid => pid !== Number(id));
        const updatedPostsDisliked = [...(postsDisliked || []), id];
        setPosts((prevPosts) => prevPosts.map((post) => (post.id === id ? { ...post, score: score - 2 } : post)));
        await updateMessageAction(id, {score: score - 2});
        setProfile((await updateProfileAction(userId, { posts_liked: updatedPostsLiked, posts_disliked: updatedPostsDisliked }, path)).data);
      }
    } else if (isDisliked) {
      if (value < 0) {
        const updatedPostsDisliked = postsDisliked.filter(pid => pid !== Number(id));
        setProfile((await updateProfileAction(userId, { posts_disliked: updatedPostsDisliked}, path)).data);
        setPosts((prevPosts) => prevPosts.map((post) => (post.id === id ? { ...post, score: score + 1 } : post)));
        await updateMessageAction(id, {score: score + 1})
      } else {
        const updatedPostsDisliked = postsDisliked.filter(pid => pid !== Number(id));
        const updatedPostsLiked = [...(postsLiked || []), id];
        setPosts((prevPosts) => prevPosts.map((post) => (post.id === id ? { ...post, score: score + 2 } : post)));
        await updateMessageAction(id, {score: score + 2});
        setProfile((await updateProfileAction(userId, { posts_liked: updatedPostsLiked, posts_disliked: updatedPostsDisliked }, path)).data);
      }
    }
    router.push("/forum");
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

  const handleRemovePost = async (id) => {
    setPosts((prevPosts) => prevPosts.filter((post) => post.id !== id));

    await deleteMessageAction(id);
    router.refresh();
  };
  

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
            <Post 
              key={ post.id } 
              post = { post }
              handleUpdateScore = { handleUpdateScore } 
              handleAddMessage = { handleAddMessage }
              handleRemovePost = { handleRemovePost }
              profile = { profile } 
              userId = { userId }
            />
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