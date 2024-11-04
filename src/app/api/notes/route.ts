import { auth } from '@/auth';
import { getNotes } from '@/lib/prisma/notes';

export async function GET() {
  const session = await auth();

  if (!session) {
    return Response.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const { notes, error } = await getNotes();
    if (error) throw new Error(error);
    return Response.json({ success: true, notes }, { status: 200 });
  } catch (error: any) {
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
