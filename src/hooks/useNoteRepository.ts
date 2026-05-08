import { v4 as uuidv4 } from 'uuid';
import { useLocalStorage } from './useLocalStorage';
import type { Note, NoteCategory } from '../types';

export function useNoteRepository() {
  const [notes, setNotes] = useLocalStorage<Note[]>('personal-notepads', []);

  const addNote = (category: NoteCategory = 'General'): Note => {
    const newNote: Note = {
      id: uuidv4(),
      title: '',
      content: category === 'Password Manager' ? JSON.stringify({ username: '', password: '', notes: '' }) : '',
      lastModified: Date.now(),
      category: category,
    };
    setNotes([newNote, ...notes]);
    return newNote;
  };

  const updateNote = (updatedNote: Note) => {
    setNotes(notes.map((note) => (note.id === updatedNote.id ? updatedNote : note)));
  };

  const deleteNotes = (idsToDelete: string[]) => {
    setNotes(notes.filter((note) => !idsToDelete.includes(note.id)));
  };

  return {
    notes,
    addNote,
    updateNote,
    deleteNotes,
  };
}