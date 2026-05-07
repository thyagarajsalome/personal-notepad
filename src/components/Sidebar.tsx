import React, { useState } from 'react';
import { Plus, Trash2, Sun, Moon, CheckSquare, Square, X } from 'lucide-react';
import type { Note } from '../types';

interface SidebarProps {
  notes: Note[];
  activeNoteId: string | null;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onAddNote: () => void;
  onSelectNote: (id: string) => void;
  onBulkDelete: (ids: string[]) => void;
}

export function Sidebar({ notes, activeNoteId, isDarkMode, onToggleDarkMode, onAddNote, onSelectNote, onBulkDelete }: SidebarProps) {
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const sortedNotes = [...notes].sort((a, b) => b.lastModified - a.lastModified);

  const toggleSelection = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newSelection = new Set(selectedIds);
    if (newSelection.has(id)) newSelection.delete(id);
    else newSelection.add(id);
    setSelectedIds(newSelection);
  };

  const handleBulkDeleteClick = () => {
    if (selectedIds.size === 0) return;
    if (window.confirm(`Are you sure you want to completely delete ${selectedIds.size} note(s)? This action cannot be undone.`)) {
      onBulkDelete(Array.from(selectedIds));
      setIsSelectionMode(false);
      setSelectedIds(new Set());
    }
  };

  return (
    <div className="w-80 bg-gray-50 dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800 h-full flex flex-col transition-colors duration-200">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">My Notes</h1>
        <div className="flex gap-2">
          <button 
            onClick={() => {
              setIsSelectionMode(!isSelectionMode);
              setSelectedIds(new Set());
            }}
            className={`p-2 rounded-md transition-colors ${isSelectionMode ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300' : 'text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-800'}`}
            title="Bulk Select"
          >
            {isSelectionMode ? <X size={20} /> : <CheckSquare size={20} />}
          </button>
          {!isSelectionMode && (
            <button 
              onClick={onAddNote}
              className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              title="New Note"
            >
              <Plus size={20} />
            </button>
          )}
        </div>
      </div>

      {/* Bulk Action Bar (Only visible when selection mode is active) */}
      {isSelectionMode && (
        <div className="p-3 bg-blue-50 dark:bg-blue-900/30 flex justify-between items-center border-b border-blue-100 dark:border-blue-900">
          <span className="text-sm font-medium text-blue-700 dark:text-blue-300">{selectedIds.size} selected</span>
          <button 
            onClick={handleBulkDeleteClick}
            disabled={selectedIds.size === 0}
            className="flex items-center gap-1 px-3 py-1.5 bg-red-500 text-white text-sm rounded-md disabled:opacity-50 hover:bg-red-600 transition-colors"
          >
            <Trash2 size={16} /> Delete
          </button>
        </div>
      )}

      {/* Notes List */}
      <div className="flex-1 overflow-y-auto">
        {sortedNotes.length === 0 ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400 text-sm">No notes yet. Create one!</div>
        ) : (
          sortedNotes.map((note) => {
            const isSelected = selectedIds.has(note.id);
            const isActive = activeNoteId === note.id && !isSelectionMode;

            return (
              <div
                key={note.id}
                onClick={(e) => isSelectionMode ? toggleSelection(note.id, e) : onSelectNote(note.id)}
                className={`p-4 cursor-pointer border-b border-gray-100 dark:border-gray-800/50 transition-colors flex items-start gap-3 
                  ${isActive ? 'bg-white dark:bg-gray-900 border-l-4 border-l-blue-500' : 'hover:bg-white dark:hover:bg-gray-900 border-l-4 border-l-transparent'}
                  ${isSelected ? 'bg-blue-50/50 dark:bg-blue-900/20' : ''}
                `}
              >
                {isSelectionMode && (
                  <div className="pt-1 text-gray-400 dark:text-gray-500">
                    {isSelected ? <CheckSquare size={18} className="text-blue-500" /> : <Square size={18} />}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className={`font-semibold truncate ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-800 dark:text-gray-200'}`}>
                    {note.title || 'Untitled Note'}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate mt-1">
                    {note.content || 'No content...'}
                  </p>
                  <div className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                    {new Date(note.lastModified).toLocaleDateString()}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer / Theme Toggle */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        <button 
          onClick={onToggleDarkMode}
          className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-md transition-colors"
        >
          {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          {isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        </button>
      </div>
    </div>
  );
}