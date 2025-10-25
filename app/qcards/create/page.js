"use client";
import React, { useState, useEffect } from "react";
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation'

// Страница создания колоды карточек (Next.js, JavaScript, Tailwind)
// Поместите этот компонент как страницу в pages/create-deck.jsx или в app/create-deck/page.jsx

export default function CreateDeckPage() {
  const [deckName, setDeckName] = useState("");
  const [deckDesc, setDeckDesc] = useState("");
  const [cards, setCards] = useState([
    { id: Date.now(), front: "", back: "" },
  ]);
  const [message, setMessage] = useState("");
  const router = useRouter()

  useEffect(() => {
    // Загружаем временно сохранённую колоду, если есть
    try {
      const raw = localStorage.getItem("draft-deck");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.deckName) {
          setDeckName(parsed.deckName);
          setCards(parsed.cards || []);
        }
      }
    } catch (e) {
      // ignore
    }
  }, []);

  useEffect(() => {
    // Автосохранение черновика
    const draft = { deckName, cards };
    localStorage.setItem("draft-deck", JSON.stringify(draft));
  }, [deckName, cards]);

  function addCard() {
    setCards((s) => [...s, { id: Math.floor(Math.random() * 1000000), front: "", back: "" }]);
  }

  function updateCard(id, field, value) {
    setCards((s) => s.map((c) => (c.id === id ? { ...c, [field]: value } : c)));
  }

  function removeCard(id) {
    setCards((s) => s.filter((c) => c.id !== id));
  }

  function moveCard(id, dir) {
    setCards((s) => {
      const idx = s.findIndex((c) => c.id === id);
      if (idx === -1) return s;
      const newIdx = idx + dir;
      if (newIdx < 0 || newIdx >= s.length) return s;
      const copy = [...s];
      const [item] = copy.splice(idx, 1);
      copy.splice(newIdx, 0, item);
      return copy;
    });
  }

  function validate() {
    if (!deckName.trim()) {
      setMessage("Enter the deck name!");
      return false;
    }
    if (!cards.length) {
      setMessage("Create at least one card!");
      return false;
    }
    for (const c of cards) {
      if (!c.front.trim() || !c.back.trim()) {
        setMessage("Every card must have all sides finished");
        return false;
      }
    }
    setMessage("");
    return true;
  }

  function downloadJSON() {
    if (!validate()) return;
    const deck = { deckName: deckName.trim(), cards };
    const blob = new Blob([JSON.stringify(deck, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${deckName || "deck"}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }
  async function createDeck() {
    if (!validate()) return;
    const deck = { cards };
    const { data, error } = await supabase.from('decks').insert({
      name: deckName.trim(),
      description: deckDesc.trim(),
      body: deck
    }).select();
    if (error) { setMessage('Ошибка при сохранении: ' + error.message); }
    else { setMessage('Сохранено в Supabase'); }
    console.log(message);
    localStorage.removeItem("draft-deck");
    router.push(`/qcards/deck?id=${data[0].id}`)
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Create Flashcard Deck</h1>

      <div className="bg-white/10 border rounded shadow-sm p-4 mb-6">
        <label className="block text-sm font-medium text-white mb-2">Deck Name</label>
        <div className="flex items-center">
          <input
            value={deckName}
            onChange={(e) => setDeckName(e.target.value)}
            placeholder="Enter the title of the deck"
            className="flex-grow border rounded px-3 py-2 mr-4"
          />
          <button
            onClick={() => {
              setDeckName("");
              setCards([{ id: Date.now(), front: "", back: "" }]);
            }}
            className="bg-red-500 text-white px-4 py-2 rounded"
            title="Reset form"
          >
            Reset
          </button>
        </div>
        <input
            value={deckDesc}
            onChange={(e) => setDeckDesc(e.target.value)}
            placeholder="Enter the description of the deck"
            className="flex-grow border rounded px-3 py-2 mr-4 w-full mt-2 h-24"
          />
      </div>

      <div className="space-y-4">
        {cards.map((card, idx) => (
          <div key={card.id} className="bg-white/10 border rounded p-4 flex items-start gap-4">
            <div className="w-6 text-sm text-white mt-2">{idx + 1}</div>

            <div className="flex-1 grid grid-cols-2 gap-4">
              <textarea
                value={card.front}
                onChange={(e) => updateCard(card.id, "front", e.target.value)}
                placeholder="Front (question/term)"
                className="border rounded p-2 w-full h-24 resize-none"
              />

              <textarea
                value={card.back}
                onChange={(e) => updateCard(card.id, "back", e.target.value)}
                placeholder="Back (answer/translation)"
                className="border rounded p-2 w-full h-24 resize-none"
              />
            </div>

            <div className="flex flex-col items-end gap-2">
              <div className="flex flex-col">
                <button
                  onClick={() => moveCard(card.id, -1)}
                  className="text-sm px-2 py-1 border rounded mb-1"
                  title="Move up"
                >
                  ↑
                </button>
                <button
                  onClick={() => moveCard(card.id, 1)}
                  className="text-sm px-2 py-1 border rounded"
                  title="Move down"
                >
                  ↓
                </button>
              </div>

              <button
                onClick={() => removeCard(card.id)}
                className="text-sm text-red-600"
                title="Remove card"
              >
                Remove
              </button>
            </div>
          </div>
        ))}

        <div className="flex gap-2">
          <button onClick={addCard} className="bg-green-500 text-white px-4 py-2 rounded">
            Add card
          </button>

          <button onClick={createDeck} className="bg-blue-600 text-white px-4 py-2 rounded">
            Create deck
          </button>

          <button onClick={downloadJSON} className="bg-gray-700 text-white px-4 py-2 rounded">
            Export JSON
          </button>

          {/* Если нужна интеграция с Supabase, раскомментируйте и вызовите saveToSupabase */}
        </div>
      </div>

      <section className="mt-8">
        <h2 className="text-xl font-medium mb-2">Preview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {cards.map((c, i) => (
            <div key={c.id} className="border rounded p-3 bg-white/10">
              <div className="text-sm text-gray-500">{i + 1}</div>
              <div className="font-medium mt-1">{c.front || <span className="text-gray-400">(пусто)</span>}</div>
              <div className="text-gray-400 mt-2">{c.back || <span className="text-gray-400">(пусто)</span>}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
