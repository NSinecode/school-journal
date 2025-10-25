'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from '@clerk/nextjs'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { motion } from 'framer-motion'
import { supabase } from '@/lib/supabaseClient';
import styles from '@/app/coming-soon/page.module.css'


export default function ChooseTestPage() {
  const { session } = useSession()
  const [decks, setDecks] = useState([])
  const [filtDecks, setFiltDecks] = useState([]);
  const [isLoading, setIsLoading] = useState(true)
  const [searchId, setSearchId] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    // Check authentication
    // if (!session?.user?.id) {
    //   router.push('/login')
    //   return
    // }
    
    async function loadDecks() {
      const result = await supabase
      .from("decks")
      .select()
      setDecks(result.data);
      setFiltDecks(result.data);
      setIsLoading(false)
    }
    loadDecks()
  }, [session, router])

  const handleSearch = () => {
    if (!searchId.trim()) return
    setDecks(decks.filter(deck => {
        return deck.name.toLowerCase().includes(searchId.trim().toLowerCase());
    }))
    router.refresh();
  }

  if (error) {
    return (
      <div className="p-8 flex flex-col items-center justify-center">
        <p className="text-white text-xl mb-4">{error}</p>
        <Button onClick={() => setError('')}>
          Choose Another Deck
        </Button>
      </div>
    )
  }

  if(isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="mb-8 flex justify-center">
            <div className={styles.loader}></div>
          </div>
        </motion.div>
      </div>
    )
  }

  if (!decks.length) {
    return <div className="p-8 text-white">Error occured while loading decks</div>
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-6 flex items-center justify-between w-full gap-4">
        <input
          placeholder="Find decks"
          value={searchId}
          onChange={(e) => {
            setFiltDecks(decks.filter(deck => deck.name.toLowerCase().includes(e.target.value.toLowerCase().trim())));
            setSearchId(e.target.value);
        }}
          className="p-2 rounded bg-white/5 border border-white/10 text-white"
        />
        <Button 
          className='bg-white ml-2'
          onClick={() => router.push("/qcards/create")}
        >Create new</Button>
      </div>

      <h1 className="text-2xl font-bold text-white mb-6">Choose deck</h1>
      <div className="grid gap-4 md:grid-cols-2">
        {filtDecks.map((deck) => (
          <Card 
            key={deck.id} 
            className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors cursor-pointer"
            onClick={() => router.push(`/qcards/deck?id=${deck.id}`)}
          >
            <CardHeader className="pb-3 pt-4">
              <CardTitle className="text-white">
                {deck.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-4">
              <p className="text-gray-300">{deck.description}</p>
              <p className="text-sm text-gray-400 mt-1">
                {deck.body.cards.length} cards
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
