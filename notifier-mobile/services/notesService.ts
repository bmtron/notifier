import { DEV_API_URL } from '@/globals/constants';
import { GetNotesResult, Note, NoteApiResponse, transformNoteFromApi } from '@/models/Note';
import { API_KEY } from '@/secrets';

export const getUserNotes = async (userToken: string, userId: number): Promise<GetNotesResult> => {
  const api_key = API_KEY;
  const fullEndpoint = DEV_API_URL + `notes/user/${userId}`;

  try {
    const result = await fetch(fullEndpoint, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken}`,
        'X-API-Key': api_key,
      },
    });
    const transformedData: Note[] = ((await result.json()) as NoteApiResponse[]).map(
      transformNoteFromApi
    );
    const notesResult: GetNotesResult = {
      success: true,
      data: transformedData,
    };
    return notesResult;
  } catch (err) {
    console.log(err);
    const tempNotesResult: GetNotesResult = {
      success: false,
      error: err as string,
      data: undefined,
    };
    return tempNotesResult;
  }
};
