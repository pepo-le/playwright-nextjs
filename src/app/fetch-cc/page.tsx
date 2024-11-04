'use client';
import type { Note } from '@prisma/client';
import { useEffect, useState } from 'react';

export const dynamic = 'force-dynamic';

export default function FetchCc() {
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    async function fetchNotes() {
      const res = await fetch('/api/notes');
      const json = await res.json();
      if (res.ok && json.success) {
        setNotes(json.notes);
      }
    }
    fetchNotes();
  }, []);

  return (
    <main className='flex flex-col items-center'>
      <h1 className='mt-10 font-bold'>Notes page by CC</h1>
      <ul>
        {notes?.map((note) => (
          <li key={note.id}>{note.title}</li>
        ))}
      </ul>
    </main>
  );
}
