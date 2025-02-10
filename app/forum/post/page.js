"use client";
import { useEffect, useState } from "react";
import { createMessageAction, updateMessageAction, deleteMessageAction, getMessageAction } from "@/actions/messages-actions";
import { getProfileByUserIdAction } from "@/actions/profiles-actions";
import Post from "@/components/forum/PostBody";
import PostFeed from "@/components/forum/PostFeed";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";


export default function PostPage() {
    const router = useRouter();
    const [postId, setPostId] = useState(null);
    const [post, setPost] = useState();
    const { isSignedIn } = useAuth();
    const [profile, setProfile] = useState();
    const [userId, setUserId] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newMessage, setNewMessage] = useState("");
    const [isError, setIsError] = useState(false);
    const [shake, setShake] = useState(false);
    const [loading, setLoading] = useState(true);
    const [replyId, setReplyId] = useState(0);
    
    useEffect(() => {
        // Get test ID from URL
        const params = new URLSearchParams(window.location.search)
        const id = params.get("id");
        const num = Number(id);
        setPostId(num);
    }, [])
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
            if (userId != "FUCKIN GOD" && isSignedIn) {
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
    useEffect(() => {
        async function fetchPost() {
            try {
                if (postId != null && postId != undefined) {
                    const res = await getMessageAction(postId);
                    if (!res) throw new Error("Не удалось загрузить пост");
                    setPost(res.data);
                }
            } catch (err) {
                console.error(err);
            }
        }
        fetchPost();
    }, [postId])

      
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
    
    if (loading) {
        return <h3 className="max-w-2xl mx-auto p-4">loading...</h3>
    }

    return(
        <div className="max-w-2xl mx-auto p-4">
            <Post
                key={ post.id } 
                postB = { post }
   
                handleAddMessage = { handleAddMessage }
                handleRemovePost = { handleRemovePost }
                handleReply={ reply }
  
                profile = { profile } 
                userId = { userId }

                isPostPage = { false }
            />
            <div className="border-l border-blue-500 ml-5">
                <PostFeed
                    isPost = { false }
                    pstId = { postId }
                />
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
        </div>
    );
}