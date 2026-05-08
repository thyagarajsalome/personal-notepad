import React, { useEffect, useState } from 'react';
import { CheckCircle2, Eye, EyeOff } from 'lucide-react';
import type { Note, NoteCategory } from '../types';

interface EditorProps {
  note: Note;
  onUpdateNote: (updatedNote: Note) => void;
}

const CATEGORIES: NoteCategory[] = ['General', 'AI Prompts', 'Contact Details', 'Code Snippets', 'Project Ideas', 'Password Manager'];

export function Editor({ note, onUpdateNote }: EditorProps) {
  const [saveStatus, setSaveStatus] = useState('Saved');
  const [showPassword, setShowPassword] = useState(false);

  // Show a brief "Saving..." status whenever the note changes
  useEffect(() => {
    setSaveStatus('Saving...');
    const timer = setTimeout(() => setSaveStatus('Saved'), 500);
    return () => clearTimeout(timer);
  }, [note.content, note.title, note.category]);

  // Reset password visibility when switching notes
  useEffect(() => {
    setShowPassword(false);
  }, [note.id]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdateNote({ ...note, title: e.target.value, lastModified: Date.now() });
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onUpdateNote({ ...note, content: e.target.value, lastModified: Date.now() });
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onUpdateNote({ ...note, category: e.target.value as NoteCategory, lastModified: Date.now() });
  };

  const isCode = note.category === 'Code Snippets';
  const isPassword = note.category === 'Password Manager';

  return (
    <div className="flex-1 flex flex-col h-full bg-white dark:bg-gray-900 transition-colors duration-200">
      {/* Editor Header / Save Status & Category Selector */}
      <div className="px-6 py-3 flex justify-between items-center text-sm text-gray-400 dark:text-gray-500 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-2">
            {saveStatus === 'Saved' && <CheckCircle2 size={14} className="text-green-500" />}
            {saveStatus}
          </span>
          
          <div className="h-4 w-px bg-gray-200 dark:bg-gray-700"></div>
          
          {/* Category Dropdown */}
          <select
            value={note.category || 'General'}
            onChange={handleCategoryChange}
            className="bg-transparent border-none outline-none cursor-pointer text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 focus:ring-0 p-0 text-sm font-medium"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat} className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200">
                {cat}
              </option>
            ))}
          </select>

          {/* Password Reveal Toggle */}
          {isPassword && (
            <>
              <div className="h-4 w-px bg-gray-200 dark:bg-gray-700"></div>
              <button 
                onClick={() => setShowPassword(!showPassword)}
                className="flex items-center gap-1 text-blue-500 hover:text-blue-600 transition-colors"
              >
                {showPassword ? <><EyeOff size={14} /> Hide Content</> : <><Eye size={14} /> Reveal Content</>}
              </button>
            </>
          )}
        </div>

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
      <div className="flex-1 p-6 flex flex-col">
        <textarea
          value={note.content}
          onChange={handleContentChange}
          placeholder={isCode ? "// Paste your code here..." : "Start typing your thoughts here..."}
          className={`w-full h-full resize-none border-none outline-none focus:ring-0 bg-transparent transition-all duration-300
            ${isCode ? 'font-mono text-sm bg-gray-50 dark:bg-gray-950 p-4 rounded-lg border border-gray-200 dark:border-gray-800 text-gray-800 dark:text-green-400' : 'text-lg text-gray-700 dark:text-gray-300 leading-relaxed'}
            ${isPassword && !showPassword ? 'blur-md select-none opacity-50' : 'blur-0 opacity-100'}
          `}
        />
      </div>
    </div>
  );
}