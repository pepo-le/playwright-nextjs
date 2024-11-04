import type { Note } from '@prisma/client';
import { cookies } from 'next/headers';

async function fetchNotes(token: string | undefined) {
  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/notes`, {
    headers: {
      cookie: `authjs.session-token=${token}`,
    },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch notes');
  }
  const json = await res.json();
  const notes: Note[] = json.notes;
  return notes;
}

export default async function FetchSc() {
  const cookieStore = await cookies();
  const token = cookieStore.get('authjs.session-token');

  const notes = await fetchNotes(token?.value);

  return (
    <main className='flex flex-col items-center'>
      <h1 className='mt-10 font-bold'>Notes page by SC</h1>
      <ul className='m-3'>
        {notes?.map((note) => (
          <li key={note.id}>{note.title}</li>
        ))}
      </ul>
    </main>
  );
}
