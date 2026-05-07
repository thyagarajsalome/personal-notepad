import React from 'react';
import type { Note } from '../types';

interface EditorProps {
  note: Note;
  onUpdateNote: (updatedNote: Note) => void;
}

export function Editor({ note, onUpdateNote }: EditorProps) {
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdateNote({
      ...note,
      title: e.target.value,
      lastModified: Date.now(),
    });
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onUpdateNote({
      ...note,
      content: e.target.value,
      lastModified: Date.now(),
    });
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-white">
      <div className="p-6 border-b border-gray-100">
        <input
          type="text"
          value={note.title}
          onChange={handleTitleChange}
          placeholder="Note Title..."
          className="w-full text-3xl font-bold text-gray-800 placeholder-gray-300 border-none outline-none focus:ring-0 bg-transparent"
        />
      </div>
      <div className="flex-1 p-6">
        <textarea
          value={note.content}
          onChange={handleContentChange}
          placeholder="Start typing your notes here..."
          className="w-full h-full text-gray-700 text-lg resize-none border-none outline-none focus:ring-0 bg-transparent leading-relaxed"
        />
      </div>
    </div>
  );
}