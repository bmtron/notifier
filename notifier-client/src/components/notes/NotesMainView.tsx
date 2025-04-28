import { useState, useEffect, useRef } from 'react';

import { useAuth } from '../../context/AuthContext';
import { createNote } from '../../services/api/createNote';
import { getNotes } from '../../services/api/getNote';
import { updateNote } from '../../services/api/updateNote';
import type { Note } from '../../utils/models/Note';

import styles from './NotesMainView.module.css';

export const NotesMainView = () => {
  const { user } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [clickedNote, setClickedNote] = useState<Note | null>(null);
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [titleClicked, setTitleClicked] = useState<boolean>(false);
  const [editingTitle, setEditingTitle] = useState<boolean>(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchNotes = async () => {
      if (!user?.id) return;
      const notesResult = await getNotes(Number(user.id));
      if (notesResult.success && notesResult.data) {
        setNotes(notesResult.data);
      }
      setIsLoading(false);
    };
    void fetchNotes();
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [user?.id]);

  const handleCreateNote = async () => {
    if (!user?.id || !newNoteTitle.trim()) return;

    const newNote: Note = {
      noteId: null,
      userId: Number(user.id),
      title: newNoteTitle.trim(),
      content: '',
      deleted: false,
      createdAt: new Date(),
      updatedAt: null,
      dirty: false,
    };

    const result = await createNote(newNote);
    if (result.success && result.data) {
      setNotes([...notes, result.data]);
      setNewNoteTitle('');
    }
  };

  const handleUpdateNote = (noteId: number, content: string) => {
    setNotes(notes.map((n) => (n.noteId === noteId ? { ...n, content } : n)));
    const timeoutId = timeoutRef.current;
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutRef.current = setTimeout(async () => {
      const noteToUpdate = notes.find((n) => n.noteId === noteId);
      if (!noteToUpdate) return;
      // TODO: handle update note in API
      try {
        await updateNote({ ...noteToUpdate, content });
      } catch (error) {
        console.error('Error updating note:', error);
        alert('Error updating note');
      }
    }, 500);
  };

  const handleTextAreaInput = (e: React.ChangeEvent<HTMLTextAreaElement>, noteId: number) => {
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight.toString()}px`;
    handleUpdateNote(noteId, textarea.value);
  };

  const handleTitleClick = (noteId: number) => {
    if (titleClicked && clickedNote && clickedNote.noteId === noteId) {
      setEditingTitle(true);
      return;
    }

    if (!editingTitle) {
      setTitleClicked(true);
      setClickedNote(notes.find((n) => n.noteId === noteId) ?? null);
      setTimeout(() => {
        setTitleClicked(false);
      }, 200);
    }
  };

  const handleUpdateNoteTitle = async (noteId: number, title: string) => {
    if (!clickedNote) return;

    const notesUpdated = notes.map((n) => (n.noteId === noteId ? { ...n, title } : n));
    const noteToUpdate = notesUpdated.find((n) => n.noteId === noteId);
    setNotes(noteToUpdate ? [...notesUpdated] : notes);
    if (noteToUpdate) {
      await updateNote(noteToUpdate);
    }
  };

  const handleSubmitNoteTitleEdit = async (noteId: number, title: string) => {
    if (!clickedNote) return;

    const notesUpdated = notes.map((n) => (n.noteId === noteId ? { ...n, title } : n));
    const noteToUpdate = notesUpdated.find((n) => n.noteId === noteId);
    if (noteToUpdate) {
      await updateNote(noteToUpdate);
    }
    setEditingTitle(false);
    setClickedNote(null);
  };

  if (isLoading) {
    return <div className={styles.loading}>Loading...</div>;
  }
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>My Notes</h1>
        <div className={styles.createSet}>
          <input
            type='text'
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
            }}
            placeholder='Search notes...'
            className={styles.input}
          />
          <input
            type='text'
            value={newNoteTitle}
            onChange={(e) => {
              setNewNoteTitle(e.target.value);
            }}
            placeholder='New note title'
            className={styles.input}
          />
          <button onClick={() => void handleCreateNote()} className={styles.button}>
            Create Note
          </button>
        </div>
      </div>
      <div className={styles.notes}>
        {notes.map((note) => (
          <div key={note.noteId} className={styles.note}>
            <div
              className={styles.noteTitleWrapper}
              onClick={() => {
                handleTitleClick(note.noteId ?? 0);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleTitleClick(note.noteId ?? 0);
                }
              }}
              role='button'
              tabIndex={0}
            >
              {editingTitle && clickedNote && clickedNote.noteId === note.noteId ? (
                <div className={styles.noteTitleEditWrapper}>
                  <input
                    type='text'
                    className={styles.noteTitleInput}
                    value={note.title}
                    onChange={(e) => {
                      void handleUpdateNoteTitle(note.noteId ?? 0, e.target.value);
                    }}
                  />
                  <button
                    className={styles.button}
                    onClick={() => {
                      void handleSubmitNoteTitleEdit(note.noteId ?? 0, note.title);
                    }}
                  >
                    ✓
                  </button>
                </div>
              ) : (
                <h2 className={styles.noteTitle}>{note.title}</h2>
              )}
            </div>
            <div className={styles.noteDate}>
              Created: {note.createdAt ? new Date(note.createdAt).toLocaleDateString() : 'Unknown'}
            </div>
            <div className={styles.noteContent}>
              <textarea
                value={note.content}
                onChange={(e) => {
                  handleTextAreaInput(e, note.noteId ?? 0);
                }}
                placeholder='Enter your note here...'
                rows={1}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
