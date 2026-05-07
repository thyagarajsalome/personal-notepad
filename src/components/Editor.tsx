import React, { useEffect, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import type { Note } from '../types';

interface EditorProps {
  note: Note;
  onUpdateNote: (updatedNote: Note) => void;
}

export function Editor({ note, onUpdateNote }: EditorProps) {
  const [saveStatus, setSaveStatus] = useState('Saved');

  // Show a brief "Saving..." status whenever the note changes
  useEffect(() => {
    setSaveStatus('Saving...');
    const timer = setTimeout(() => setSaveStatus('Saved'), 500);
    return () => clearTimeout(timer);
  }, [note.content, note.title]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdateNote({ ...note, title: e.target.value, lastModified: Date.now() });
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onUpdateNote({ ...note, content: e.target.value, lastModified: Date.now() });
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-white dark:bg-gray-900 transition-colors duration-200">
      {/* Editor Header / Save Status */}
      <div className="px-6 py-3 flex justify-between items-center text-sm text-gray-400 dark:text-gray-500 border-b border-gray-100 dark:border-gray-800">
        <span className="flex items-center gap-2">
          {saveStatus === 'Saved' && <CheckCircle2 size={14} className="text-green-500" />}
          {saveStatus}
        </span>
        <span>Last edited: {new Date(note.lastModified).toLocaleTimeString()}</span>
      </div>

      {/* Title Input */}
      <div className="px-6 pt-6">
        <input
          type="text"
          value={note.title}
          onChange={handleTitleChange}
          placeholder="Untitled Note..."
          className="w-full text-4xl font-bold text-gray-800 dark:text-gray-100 placeholder-gray-300 dark:placeholder-gray-600 border-none outline-none focus:ring-0 bg-transparent transition-colors"
        />
      </div>

      {/* Content Textarea */}
      <div className="flex-1 p-6">
        <textarea
          value={note.content}
          onChange={handleContentChange}
          placeholder="Start typing your thoughts here..."
          className="w-full h-full text-gray-700 dark:text-gray-300 text-lg resize-none border-none outline-none focus:ring-0 bg-transparent leading-relaxed transition-colors"
        />
      </div>
    </div>
  );
}