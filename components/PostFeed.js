'use client';

import { useState, useEffect } from 'react';
import { UserRound } from 'lucide-react';
import { ArrowBigUp } from 'lucide-react';
import { createMessageAction } from "@/actions/messages-actions";
import { ArrowBigDown } from 'lucide-react';


export default function PostFeed() {
  const [posts, setPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userId, setUserId] = useState("");
  const [newMessage, setNewMessage] = useState("");


  const [isError, setIsError] = useState(false);
  const [isErrorTag, setIsErrorTag] = useState(false);
  const [shake, setShake] = useState(false);

  const handleAddMessage = async () => {
    const tempId = parseInt(Math.abs(Math.cos(Date.now()) * 100), 10);
    if (newMessage.trim() == "") {
      setIsError(true);
      setShake(true);
      setTimeout(() => setShake(false), 500); // Останавливаем тряску
      return;
    }
      const optimisticPost = {
        id: tempId,
        message: newMessage,
        author_id: userId,
      };
    
      setPosts((prevPosts) => [...prevPosts, optimisticPost]);
      await createMessageAction({author_id: userId, message: newMessage});
      setIsModalOpen(false);
      setNewMessage("");
  }

  useEffect(() => {
    async function fetchUserId() {
      try {
        const res = await fetch("/api/user");
        if (!res.ok) throw new Error("Ошибка при получении userId");
        
        const data = await res.json();
        setUserId(data.userId);
      } catch (err) {
        console.error("❌ Ошибка загрузки userId:", err);
      }
    }

    fetchUserId();
  }, []);

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

  const filteredPosts = posts.filter(post =>
    post.message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="flex gap-2">
        {/* Кнопка добавления поста */}
        <button 
            className="flex-1 w-full bg-blue-500 text-white py-2 rounded mb-4 hover:bg-blue-600 p-3"
            onClick={() => setIsModalOpen(true)}
        >
            New
        </button>

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
              <div className="flex gap-2">
                <UserRound className="w-4 h-4"></UserRound>
                <p className="text-sm font-bold">{post.author_id}</p>
              </div>
              <h3 className="font-bold text-white whitespace-pre-line">{post.message}</h3>
              <div className="border-b border-t mt-2">
                <button className="mt-2">
                  <ArrowBigUp className="w-8 h-8 pr-2 border-r"></ArrowBigUp>
                </button>
                <button className="mt-2">
                  <ArrowBigDown className="w-8 h-8 pl-2 "></ArrowBigDown>
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">Connection error</p>
        )}
      </div>

      {/* Модальное окно для нового поста */}
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
            }}
            className="w-full p-2 border rounded mt-3 border-gray-300"
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
    </div>
  );
}