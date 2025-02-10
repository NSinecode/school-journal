import { ArrowBigUp, ArrowBigDown, UserRound, Trash2, CornerUpLeft, MessageSquareText, Pencil } from 'lucide-react';
import { getMessageAction, updateMessageAction } from '@/actions/messages-actions';
import { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
import { SignedIn, useAuth } from "@clerk/nextjs";

export default function Post( { postB, profile, handleRemovePost, userId, handleReply, isPostPage, handleUpdatePost }) {
    const router = useRouter();
    const { isSignedIn } = useAuth();
    const [repPost, setRepPost] = useState();
    const [post, setPost] = useState(postB);
    const [isLiked, setIsLiked] = useState(profile.posts_liked.includes(Number(postB.id)));
    const [isDisliked, setIsDisliked] = useState(profile.posts_disliked.includes(Number(postB.id)));
    const [isEditing, setIsEditing] = useState(false);
    const [isError, setIsError] = useState(false);
    const [updateMessage, setUpdateMessage] = useState(post.message);

    useEffect(() => {
      setPost(postB);
    }, [postB]);

    const handleUpdateScore = async (value) => {
      const response = await fetch("/api/updateScore", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: post.id,
          score: post.score,
          value: value,
          profile: profile,
          isLiked: isLiked,
          isDisliked: isDisliked,
        }),
      });
  
      if (response.ok) {
        const data = await response.json();
        setPost(data.post.data);
      }
      router.refresh();
    };

    const handleEdit = async () => {
      setIsEditing(true);
    }
    const editMessage = async () => {
      if (updateMessage.trim() == "") {
        setIsError(true);
        return;
      }
      const updatedPost = await updateMessageAction(post.id, {message: updateMessage, is_edited: true});
      console.log(updatedPost);
      setPost(updatedPost.data);
      setIsEditing(false);
      setUpdateMessage(updatedPost.data.message);
      setIsError(false);
    }
    
    useEffect(() => {
      async function fetchPost() {
          if (post.replied_to) 
            setRepPost(await getMessageAction(post.replied_to));
        }
      fetchPost();
    }, []);

    const comBtn = async () => {
      router.push(`/forum/post?id=${post.id}`);
    } 
    return (
        <div key={post.id} className="p-4 rounded shadow">
              <div className="flex gap-2 w-full">
                <UserRound className="w-4 h-4"></UserRound>
                <p className="text-xs font-bold">{post.author_id}</p>
                <span className="text-xs text-blue-400">{
                    new Date(post.created_at).toISOString().replaceAll("-", ".").replaceAll("T", " ").slice(0, -5)
                }</span>
                <p className='text-xs text-gray-700'>{post.is_edited? "Edited" : ""}</p>
              </div>
              {isEditing ? (
                <textarea
                type="text"
                value={updateMessage}
                onChange={(e) => {
                  setUpdateMessage(e.target.value);
                  setIsError(false);
                }}
                className={`w-full p-2 border rounded mt-3 border-gray-300 ${
                  isError ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter the message"
              />
              ) : (
                <h3 className="font-bold text-white whitespace-pre-line mt-2">{post.message}</h3>
              )}
              {post.replied_to && repPost && !isPostPage ? (
                <div className="p-4 border-l border-blue-500 mt-2">
                  <div className="flex gap-2 w-full">
                    <UserRound className="w-4 h-4"></UserRound>
                    <p className="text-xs font-bold">{repPost.data.author_id}</p>
                  </div>
                  <h3 className="font-bold text-white whitespace-pre-line mt-2">{repPost.data.message}</h3>
                </div>
              ) : null}
              <div className="flex border-b border-t mt-2">
                <div className="flex">
                  <button 
                    className="mt-1 mb-1"
                    onClick={() => {setIsLiked(!isLiked); setIsDisliked(false); handleUpdateScore(1); setIsLiked(!isLiked); setIsDisliked(false)}}
                  >
                    <ArrowBigUp className={`ml-2 w-8 h-8 pr-2 border-r transition-all duration-200
                      ${isSignedIn && isLiked ? "text-green-300" : ""}`}/>
                  </button>
                  <button 
                    className=""
                    onClick={() => {setIsDisliked(!isDisliked); setIsLiked(false); handleUpdateScore(-1)}}
                  >
                    <ArrowBigDown className={`ml-2 w-8 h-8 pr-2 transition-all duration-200
                      ${isSignedIn && isDisliked ? "text-red-300" : ""}`}/>
                  </button>
                  <h3 className={`mt-2 pl-3 
                    ${ post.score >= 0 ? "text-green-300" : "text-red-300"}`}>{ post.score }</h3>
                </div>
                {isEditing ? (
                  <div className="w-full flex justify-end">
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setUpdateMessage(post.message);
                        setIsError(false);
                      }}
                      className="px-2 my-1 bg-gray-700 rounded-xl mr-2 hover:bg-gray-800"
                    > 
                      Cancel
                    </button>
                    <button
                      onClick={editMessage}
                      className="px-2 my-1 bg-blue-500 rounded-xl hover:bg-blue-600"
                    > 
                      Confirm
                    </button>
                  </div>
                ) : (
                  <div className="w-full flex justify-end">
                  <SignedIn>
                    <button
                      onClick={() => handleReply(post.id)}
                    >
                      <CornerUpLeft className="w-6 h-6 pr-1 hover:text-gray-400 pl-1"/>
                    </button>
                  </SignedIn>
                  <div className="flex">
                    <button
                      onClick={ comBtn }
                    >
                      <MessageSquareText className="w-6 h-6 pr-1 pl-1 border-l hover:text-gray-400"/>
                    </button>
                    {post.reply_id && post.reply_id.length > 0 ? (
                      <p className="p-1 mt-1">{ post.reply_id.length }</p>
                    ) : null}
                  </div>
                  { isSignedIn && ((userId == post.author_id || profile.role == "admin") && post.author_id != "FUCKIN GOD") && (
                    <button
                      // onClick={() => handleUpdatePost(post.id, post.message)}
                      onClick={handleEdit}
                    >
                      <Pencil className="w-6 h-6 pr-1 pl-1 hover:text-gray-400 border-l"/>
                    </button>
                  )}
                  { isSignedIn && ((userId == post.author_id || profile.role == "admin") && post.author_id != "FUCKIN GOD") && (
                    <button
                      onClick={() => handleRemovePost(post.id, post.replied_to)}
                    >
                      <Trash2 className="w-6 h-6 border-l pr-1 pl-1 hover:text-gray-400"/>
                    </button>
                  )}
                </div>
                )}
                
              </div>
        </div>
    )
}