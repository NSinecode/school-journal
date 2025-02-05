"use client";
import { createMessageAction, updateMessageAction, deleteMessageAction, getMessageAction } from "@/actions/messages-actions";
import { useEffect, useState } from "react";
import { getProfileByUserIdAction, updateProfileAction } from "@/actions/profiles-actions";
import { SignedIn, useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Post from "@/components/PostBody";
import { number } from "zod";


export default function PostPage() {
    const [postId, setPostId] = useState(null);
    const [post, setPost] = useState();
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
        // Get test ID from URL
        const params = new URLSearchParams(window.location.search)
        const id = params.get("id");
        const num = Number(id);
        setPostId(num);
    }, [])
    useEffect(() => {
        async function fetchPost() {
            try {
                if (postId != null && postId != undefined) {
                    console.log(postId);
                    const res = await getMessageAction(postId);
                    if (!res) throw new Error("Не удалось загрузить пост");

                    setPost(res);
                }
            } catch (err) {
                console.error(err);
            }
        }
        fetchPost();
    }, [])

    return(
        <div className="max-w-2xl mx-auto p-4">
        </div>
    );
}