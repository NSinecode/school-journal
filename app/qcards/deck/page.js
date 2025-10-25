"use client";
import { useState, useEffect } from "react";
// import { supabase } from '@/lib/supabaseClient';

export default function CreateDeckPage() { 
    const [deckId, setDeckId] = useState();
    useEffect(() => {
            // Get test ID from URL
            const params = new URLSearchParams(window.location.search)
            const id = params.get("id");
            const num = Number(id);
            setDeckId(num);
        }, [])

    return(
        <h1 className="text-4xl text-red-600">{deckId}</h1>
    )
}