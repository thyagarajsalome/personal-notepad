import React, { useState, useEffect } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useNoteRepository } from './hooks/useNoteRepository';
import type { NoteCategory } from './types';
import { Sidebar } from './components/Sidebar';
import { Editor } from './components/Editor';
import { Layout } from './components/Layout';
import { FileText } from 'lucide-react';

function App() {
  // Use the Repository Pattern to handle data logic
  const { notes, addNote, updateNote, deleteNotes } = useNoteRepository();
  
  // UI State
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
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

  const handleAddNote = (category?: NoteCategory) => {
    const newNote = addNote(category);
    setActiveNoteId(newNote.id);
  };

  const handleBulkDelete = (idsToDelete: string[]) => {
    deleteNotes(idsToDelete);
    
    // If the currently active note was deleted, reset the active ID
    if (activeNoteId && idsToDelete.includes(activeNoteId)) {
      setActiveNoteId(null); 
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
        <Editor note={activeNote} onUpdateNote={updateNote} />
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