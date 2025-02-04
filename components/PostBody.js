import { CornerUpLeft } from 'lucide-react';
import { Trash2 } from "lucide-react";
import { UserRound } from 'lucide-react';
import { ArrowBigUp } from 'lucide-react';
import { ArrowBigDown } from 'lucide-react';
import { getMessageAction } from '@/actions/messages-actions';
import { useEffect, useState } from 'react';

export default function Post( { post, handleUpdateScore, handleRemovePost, profile, userId, handleReply }) {
    const [repPost, setRepPost] = useState();
    useEffect(() => {
      async function fetchPost() {
          if (post.replied_to) 
            setRepPost(await getMessageAction(post.replied_to));
          console.log(repPost);
        }
      fetchPost();
    }, []);

    return (
        <div key={post.id} className="p-4 rounded shadow">
              <div className="flex gap-2 w-full">
                <UserRound className="w-4 h-4"></UserRound>
                <p className="text-xs font-bold">{post.author_id}</p>
                <span className="text-xs text-blue-400">{
                    post.created_at.replaceAll("-", ".").replaceAll("T", " ").slice(0, -5)
                }</span>
              </div>
              <h3 className="font-bold text-white whitespace-pre-line mt-2">{post.message}</h3>
              {post.replied_to && repPost ? (
                <div className="p-3 border-l">
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
                    onClick={() => handleUpdateScore(post.id, post.score, 1)}
                  >
                    <ArrowBigUp className={`ml-2 w-8 h-8 pr-2 border-r 
                      ${profile.posts_liked.includes(Number(post.id)) ? "text-green-300" : ""}`}></ArrowBigUp>
                  </button>
                  <button 
                    className=""
                    onClick={() => handleUpdateScore(post.id, post.score, -1)}
                  >
                    <ArrowBigDown className={`ml-2 w-8 h-8 pr-2
                      ${profile.posts_disliked.includes(Number(post.id)) ? "text-red-300" : ""}`}></ArrowBigDown>
                  </button>
                  <h3 className={`mt-2 pl-3 
                    ${ post.score >= 0 ? "text-green-300" : "text-red-300"}`}>{ post.score }</h3>
                </div>
                <div className="w-full flex justify-end">
                  <button
                    onClick={() => handleReply(post.id)}
                  >
                    <CornerUpLeft className="w-5 h-5 pr-1"/>
                  </button>
                  { userId == post.author_id && (
                    <button
                      onClick={() => handleRemovePost(post.id)}
                    >
                      <Trash2 className="w-5 h-5 border-l mr-2 pl-1"/>
                    </button>
                  )}
                </div>
              </div>
        </div>
    )
}