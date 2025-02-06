'use client';

import { useState, useEffect } from 'react';
import { createMessageAction, updateMessageAction, deleteMessageAction, getMessageAction } from "@/actions/messages-actions";
import { getProfileByUserIdAction, updateProfileAction } from "@/actions/profiles-actions";
import { SignedIn, useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Post from "./PostBody";



export default function PostFeed({isPost, pstId}) {
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
  const [replyId, setReplyId] = useState(0);
  

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
    const postsLiked = profile.posts_liked || [];
    const postsDisliked = profile.posts_disliked || [];
    const isLiked = postsLiked.includes(Number(id));
    const isDisliked = postsDisliked.includes(Number(id));
  
    let newScore = score;
    let updatedLiked = [...postsLiked];
    let updatedDisliked = [...postsDisliked];
  
    if (!isLiked && !isDisliked) {
      newScore += value;
      if (value > 0) {
        updatedLiked.push(id);
      } else {
        updatedDisliked.push(id);
      }
    } else if (isLiked) {
      if (value > 0) {
        newScore -= 1;
        updatedLiked = updatedLiked.filter(pid => pid !== Number(id));
      } else {
        newScore -= 2;
        updatedLiked = updatedLiked.filter(pid => pid !== Number(id));
        updatedDisliked.push(id);
      }
    } else if (isDisliked) {
      if (value < 0) {
        newScore += 1;
        updatedDisliked = updatedDisliked.filter(pid => pid !== Number(id));
      } else {
        newScore += 2;
        updatedDisliked = updatedDisliked.filter(pid => pid !== Number(id));
        updatedLiked.push(id);
      }
    }
  
    setPosts((prevPosts) => prevPosts.map(post => post.id === id ? { ...post, score: newScore } : post));
    setProfile((await updateProfileAction(userId, { posts_liked: updatedLiked, posts_disliked: updatedDisliked }, path)).data);
    await updateMessageAction(id, { score: newScore });
    // router.refresh();
  };
  
  
  const handleAddMessage = async () => {
    const tempId = parseInt(Math.abs(Math.cos(Date.now()) * 100), 10);
    if (newMessage.trim() === "") {
      setIsError(true);
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }
      if (!replyId) {
        const optimisticPost = {
          id: tempId,
          message: newMessage,
          author_id: userId,
          created_at: new Date().toISOString(),
          score: 0
        };
        setPosts((prevPosts) => [...prevPosts, optimisticPost]);
        await createMessageAction({author_id: userId, message: newMessage});
      } else {
        const optimisticPost = {
          id: tempId,
          message: newMessage,
          author_id: userId,
          created_at: new Date().toISOString(),
          score: 0,
          replied_to: replyId,
        };
        const newReply = await createMessageAction({author_id: userId, message: newMessage, replied_to: replyId});
        let repPost = await getMessageAction(replyId);
        const newReplies = [...repPost.data.reply_id, newReply.data.id];
        repPost = await updateMessageAction(replyId, {reply_id: newReplies});
        setPosts(posts.map(post => 
          post.id === replyId ? { ...post, reply_id: repPost.data.reply_id } : post
        ));
        setPosts((prevPosts) => [...prevPosts, optimisticPost]);
        setReplyId(0);
      }
    
      setIsModalOpen(false);
      setNewMessage("");
  }

  const reply = async (id) => {
    setReplyId(id);
    setIsModalOpen(true);
  }

  const handleRemovePost = async (id, repId) => {
    let repliedPost;
    if (!repId) {
      await deleteMessageAction(id);
    } else {
      repliedPost = await getMessageAction(repId);
      const newReps = repliedPost.data.reply_id.filter(idp => idp !== Number(id));
      repliedPost = await updateMessageAction(repId, {reply_id: newReps});
      await deleteMessageAction(id);
    }
    setPosts(posts.map(post => 
      post.id === repId ? { ...post, reply_id: repliedPost.data.reply_id } : post
    ));
    setPosts((prevPosts) => prevPosts.filter((post) => post.id !== id));
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

  const postIsPost = isPost ? posts : posts.filter(post => post.replied_to === pstId);

  const sortedPostsByTime = postIsPost.sort((a, b) => {
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
    return <div className="max-w-2xl mx-auto p-4">Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      {isPost ? (
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
      ) : null}
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
              handleReply={ reply }

              profile = { profile } 
              userId = { userId }

              isPostPage = { !isPost }
            />
          ))
        ) : (
          <p className="text-center text-gray-500">No posts founded</p>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div
            className={`bg-gray-800 p-6 w-[400px] rounded-lg shadow-lg transition-transform ${
              shake ? "animate-shake" : ""
            }`}
          >
            <h2 className="text-lg font-bold mb-4">{replyId ? "New reply" : "New post"}</h2>
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

export { handleRemovePost, handleAddMessage, handleUpdateScore };