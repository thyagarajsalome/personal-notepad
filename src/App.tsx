import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useLocalStorage } from './hooks/useLocalStorage';
import type { Note } from './types';
import { Sidebar } from './components/Sidebar';
import { Editor } from './components/Editor';
import { Layout } from './components/Layout';
import { FileText } from 'lucide-react';

function App() {
  const [notes, setNotes] = useLocalStorage<Note[]>('personal-notepads', []);
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  
  // Dark mode state
  const [isDarkMode, setIsDarkMode] = useLocalStorage<boolean>('dark-mode', false);

  // Apply dark mode class to HTML root
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Auto-select the first note if none is selected
  useEffect(() => {
    if (!activeNoteId && notes.length > 0) {
      setActiveNoteId(notes[0].id);
    }
  }, [notes, activeNoteId]);

  const handleAddNote = () => {
    const newNote: Note = {
      id: uuidv4(),
      title: '',
      content: '',
      lastModified: Date.now(),
    };
    setNotes([newNote, ...notes]);
    setActiveNoteId(newNote.id);
  };

  const handleUpdateNote = (updatedNote: Note) => {
    const updatedNotes = notes.map((note) =>
      note.id === updatedNote.id ? updatedNote : note
    );
    setNotes(updatedNotes);
  };

  const handleBulkDelete = (idsToDelete: string[]) => {
    const filteredNotes = notes.filter((note) => !idsToDelete.includes(note.id));
    setNotes(filteredNotes);
    
    // If the active note was deleted, reset the active view
    if (activeNoteId && idsToDelete.includes(activeNoteId)) {
      setActiveNoteId(filteredNotes.length > 0 ? filteredNotes[0].id : null);
    }
  };

  const activeNote = notes.find((n) => n.id === activeNoteId);

  return (
    <Layout
      sidebar={
        <Sidebar
          notes={notes}
          activeNoteId={activeNoteId}
          isDarkMode={isDarkMode}
          onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
          onAddNote={handleAddNote}
          onSelectNote={setActiveNoteId}
          onBulkDelete={handleBulkDelete}
        />
      }
    >
      {activeNote ? (
        <Editor note={activeNote} onUpdateNote={handleUpdateNote} />
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-gray-400 dark:text-gray-600 h-full bg-gray-50/50 dark:bg-gray-900/50">
          <FileText size={64} className="mb-4 text-gray-300 dark:text-gray-700" />
          <p className="text-xl font-medium">Select a note or create a new one</p>
        </div>
      )}
    </Layout>
  );
}

export default App;