import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import type { Note, NoteCategory } from '../types';
import {
  initDatabase,
  getAllNotes,
  addNoteToNeon,
  updateNoteInNeon,
  deleteNotesFromNeon,
} from '../db/notes';

interface NoteStore {
  notes: Note[];
  activeNoteId: string | null;
  isDarkMode: boolean;
  neonConnected: boolean;

  loadFromNeon: () => Promise<void>;
  addNote: (category?: NoteCategory) => Note;
  updateNote: (updatedNote: Note) => void;
  deleteNotes: (idsToDelete: string[]) => void;
  setActiveNoteId: (id: string | null) => void;
  toggleDarkMode: () => void;
}

export const useNoteStore = create<NoteStore>()(
  persist(
    (set, get) => ({
      notes: [],
      activeNoteId: null,
      isDarkMode: false,
      neonConnected: false,

      loadFromNeon: async () => {
        const connected = await initDatabase();
        set({ neonConnected: connected });
        if (connected) {
          const neonNotes = await getAllNotes();
          if (neonNotes.length > 0) {
            // Neon is the source of truth - use its data directly
            set({ notes: neonNotes as Note[] });
          } else if (get().notes.length > 0) {
            // First-time sync: upload local notes to Neon
            const localNotes = get().notes;
            for (const note of localNotes) {
              await addNoteToNeon(note);
            }
          }
        }
      },

      addNote: (category: NoteCategory = 'General'): Note => {
        const newNote: Note = {
          id: uuidv4(),
          title: '',
          content:
            category === 'Password Manager'
              ? JSON.stringify({ username: '', password: '', notes: '' })
              : '',
          lastModified: Date.now(),
          category,
        };
        set((state) => ({ notes: [newNote, ...state.notes] }));
        // Sync to Neon in background
        if (get().neonConnected) {
          addNoteToNeon(newNote);
        }
        return newNote;
      },

      updateNote: (updatedNote: Note) => {
        set((state) => ({
          notes: state.notes.map((note) =>
            note.id === updatedNote.id ? updatedNote : note
          ),
        }));
        // Sync to Neon in background
        if (get().neonConnected) {
          updateNoteInNeon(updatedNote);
        }
      },

      deleteNotes: (idsToDelete: string[]) => {
        set((state) => ({
          notes: state.notes.filter((note) => !idsToDelete.includes(note.id)),
        }));
        // Sync to Neon in background
        if (get().neonConnected) {
          deleteNotesFromNeon(idsToDelete);
        }
      },

      setActiveNoteId: (id) => set({ activeNoteId: id }),

      toggleDarkMode: () => {
        const next = !get().isDarkMode;
        // Apply dark class to HTML element for Tailwind dark mode
        if (next) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
        set({ isDarkMode: next });
      },
    }),
    {
      name: 'personal-notepad',
      // Don't persist neonConnected state
      partialize: (state) => ({
        notes: state.notes,
        activeNoteId: state.activeNoteId,
        isDarkMode: state.isDarkMode,
      }),
    }
  )
);
