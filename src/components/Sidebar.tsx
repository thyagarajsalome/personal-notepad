import { useState, useEffect } from 'react';
import { Plus, Trash2, Sun, Moon, CheckSquare, Square, X, ChevronDown, ChevronRight, Search } from 'lucide-react';
import { useNoteStore } from '../stores/useStore';
import type { NoteCategory } from '../types';


const CATEGORIES: NoteCategory[] = ['General', 'AI Prompts', 'Contact Details', 'Code Snippets', 'Project Ideas', 'Password Manager'];

export default function Sidebar() {
  const { notes, activeNoteId, isDarkMode, addNote, setActiveNoteId, deleteNotes, toggleDarkMode, loadFromNeon, neonConnected } = useNoteStore();
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>(
    CATEGORIES.reduce((acc, cat) => ({ ...acc, [cat]: true }), {})
  );

  // Sync persisted dark mode to DOM on mount, and initialize Neon
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    loadFromNeon();
  // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional: only run on mount
  }, []);

  // Filter notes based on search query
  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedNotes = [...filteredNotes].sort((a, b) => b.lastModified - a.lastModified);

  const toggleSelection = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newSelection = new Set(selectedIds);
    if (newSelection.has(id)) newSelection.delete(id);
    else newSelection.add(id);
    setSelectedIds(newSelection);
  };

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => ({ ...prev, [category]: !prev[category] }));
  };

  const handleAddNote = (category: NoteCategory) => {
    const newNote = addNote(category);
    if (newNote) {
      setActiveNoteId(newNote.id);
    }
  };

  const handleBulkDeleteClick = () => {
    if (selectedIds.size === 0) return;
    if (window.confirm(`Are you sure you want to completely delete ${selectedIds.size} note(s)? This action cannot be undone.`)) {
      deleteNotes(Array.from(selectedIds));
      setIsSelectionMode(false);
      setSelectedIds(new Set());
    }
  };

  return (
    <div className="w-80 bg-gray-50 dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800 h-full flex flex-col transition-colors duration-200">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-gray-950 sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">My Notes</h1>
          {neonConnected && (
            <span className="w-2 h-2 rounded-full bg-green-500" title="Connected to Neon DB" />
          )}
        </div>
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
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-3 border-b border-gray-200 dark:border-gray-800">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md text-sm outline-none focus:border-blue-500 transition-colors text-gray-800 dark:text-gray-200"
          />
        </div>
      </div>

      {/* Bulk Action Bar */}
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

      {/* Categorized Notes List */}
      <div className="flex-1 overflow-y-auto pb-4">
        {CATEGORIES.map(category => {
          const categoryNotes = sortedNotes.filter(n => (n.category || 'General') === category);
          const isExpanded = expandedCategories[category];

          // If we are searching and there are no notes in this category matching the search, hide the category entirely
          if (searchQuery && categoryNotes.length === 0) return null;

          return (
            <div key={category} className="mb-2">
              {/* Category Header */}
              <div 
                className="flex items-center justify-between px-4 py-2 mt-2 cursor-pointer group"
                onClick={() => toggleCategory(category)}
              >
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-200 transition-colors">
                  {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  {category}
                  <span className="text-xs font-normal text-gray-400 dark:text-gray-600 ml-1">
                    ({categoryNotes.length})
                  </span>
                </div>
                {!isSelectionMode && !searchQuery && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!isExpanded) toggleCategory(category);
                      handleAddNote(category);
                    }}
                    className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/50 dark:hover:text-blue-400 rounded transition-colors opacity-0 group-hover:opacity-100"
                    title={`Add note to ${category}`}
                  >
                    <Plus size={16} />
                  </button>
                )}
              </div>

              {/* Category Notes List */}
              {isExpanded && (
                <div className="flex flex-col">
                  {categoryNotes.length === 0 && !searchQuery ? (
                    <div className="px-10 py-3 text-xs text-gray-400 dark:text-gray-600 italic">
                      Empty
                    </div>
                  ) : (
                    categoryNotes.map((note) => {
                      const isSelected = selectedIds.has(note.id);
                      const isActive = activeNoteId === note.id && !isSelectionMode;

                      return (
                        <div
                          key={note.id}
                          onClick={(e) => isSelectionMode ? toggleSelection(note.id, e) : setActiveNoteId(note.id)}
                          className={`px-10 py-3 cursor-pointer transition-colors flex items-start gap-3 
                            ${isActive ? 'bg-blue-50/50 dark:bg-blue-900/20 border-l-2 border-l-blue-500' : 'hover:bg-gray-100/50 dark:hover:bg-gray-800/50 border-l-2 border-l-transparent'}
                            ${isSelected ? 'bg-blue-50 dark:bg-blue-900/40' : ''}
                          `}
                        >
                          {isSelectionMode && (
                            <div className="pt-1 text-gray-400 dark:text-gray-500">
                              {isSelected ? <CheckSquare size={16} className="text-blue-500" /> : <Square size={16} />}
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <h3 className={`text-sm font-medium truncate ${isActive ? 'text-blue-700 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'}`}>
                              {note.title || 'Untitled Note'}
                            </h3>
                            <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                              {new Date(note.lastModified).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          );
        })}
        {sortedNotes.length === 0 && searchQuery && (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400 text-sm">
            No notes found matching "{searchQuery}"
          </div>
        )}
      </div>

      {/* Footer / Theme Toggle */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        <button 
          onClick={toggleDarkMode}
          className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-md transition-colors"
        >
          {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          {isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        </button>
      </div>
    </div>
  );
}