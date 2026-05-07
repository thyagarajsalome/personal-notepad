import React from 'react';
import { Plus, Trash2 } from 'lucide-react'; // Removed unused FileText
import type { Note } from '../types';

interface SidebarProps {
  notes: Note[];
  activeNoteId: string | null;
  onAddNote: () => void;
  onSelectNote: (id: string) => void;
  onDeleteNote: (id: string, e: React.MouseEvent) => void;
}

export function Sidebar({ notes, activeNoteId, onAddNote, onSelectNote, onDeleteNote }: SidebarProps) {
  const sortedNotes = [...notes].sort((a, b) => b.lastModified - a.lastModified);

  return (
    <div className="w-72 bg-white border-r border-gray-200 h-full flex flex-col">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800">My Notes</h1>
        <button 
          onClick={onAddNote}
          className="p-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors"
          title="New Note"
        >
          <Plus size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {sortedNotes.length === 0 ? (
          <div className="p-4 text-center text-gray-500 text-sm">No notes yet. Create one!</div>
        ) : (
          sortedNotes.map((note) => (
            <div
              key={note.id}
              onClick={() => onSelectNote(note.id)}
              className={`p-4 cursor-pointer border-b border-gray-100 group transition-colors ${
                activeNoteId === note.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : 'hover:bg-gray-50 border-l-4 border-l-transparent'
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1 truncate pr-2">
                  <h3 className="font-semibold text-gray-800 truncate">
                    {note.title || 'Untitled Note'}
                  </h3>
                  <p className="text-sm text-gray-500 truncate mt-1">
                    {note.content || 'No content...'}
                  </p>
                </div>
                <button
                  onClick={(e) => onDeleteNote(note.id, e)}
                  className="text-gray-400 opacity-0 group-hover:opacity-100 hover:text-red-500 transition-all"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <div className="text-xs text-gray-400 mt-2">
                {new Date(note.lastModified).toLocaleDateString()}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}