import { useEffect, useState } from 'react';
import { CheckCircle2, Eye, EyeOff, Copy, CopyCheck } from 'lucide-react';
import { useNoteStore } from '../stores/useStore';
import type { NoteCategory } from '../types';

const CATEGORIES: NoteCategory[] = ['General', 'AI Prompts', 'Contact Details', 'Code Snippets', 'Project Ideas', 'Password Manager'];



// ==========================================
// 1. STRATEGIES (Sub-components)
// ==========================================

const StandardEditor = ({ note, onUpdateNote }: EditorSubProps) => {
  return (
    <textarea
      value={note.content}
      onChange={(e) => onUpdateNote({ ...note, content: e.target.value, lastModified: Date.now() })}
      placeholder="Start typing your thoughts here..."
      className="w-full h-full resize-none border-none outline-none focus:ring-0 bg-transparent transition-all duration-300 text-lg text-gray-700 dark:text-gray-300 leading-relaxed"
    />
  );
};

const CodeEditor = ({ note, onUpdateNote }: EditorSubProps) => {
  return (
    <textarea
      value={note.content}
      onChange={(e) => onUpdateNote({ ...note, content: e.target.value, lastModified: Date.now() })}
      placeholder="// Paste your code here..."
      className="w-full h-full resize-none border-none outline-none focus:ring-0 bg-transparent transition-all duration-300 font-mono text-sm bg-gray-50 dark:bg-gray-950 p-4 rounded-lg border border-gray-200 dark:border-gray-800 text-gray-800 dark:text-green-400"
    />
  );
};

const PasswordEditor = ({ note, onUpdateNote }: EditorSubProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => setShowPassword(false), [note.id]);

  const pwdData = (() => {
    try { return JSON.parse(note.content); } 
    catch { return { username: '', password: '', notes: note.content }; }
  })();

  const handleChange = (field: string, value: string) => {
    const newData = { ...pwdData, [field]: value };
    onUpdateNote({ ...note, content: JSON.stringify(newData), lastModified: Date.now() });
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text || '');
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="max-w-2xl mt-2 space-y-6">
      <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Username</label>
            <div className="flex items-center gap-2">
              <input 
                type="text" value={pwdData.username || ''} onChange={(e) => handleChange('username', e.target.value)}
                className="flex-1 p-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 outline-none text-gray-800 dark:text-gray-100"
              />
              <button onClick={() => copyToClipboard(pwdData.username, 'username')} className="p-2.5 text-gray-500 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/50 rounded-md transition-colors">
                {copied === 'username' ? <CopyCheck size={20} className="text-green-500" /> : <Copy size={20} />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
            <div className="flex items-center gap-2">
              <input 
                type={showPassword ? "text" : "password"} value={pwdData.password || ''} onChange={(e) => handleChange('password', e.target.value)}
                className="flex-1 p-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 outline-none text-gray-800 dark:text-gray-100 font-mono tracking-widest"
              />
              <button onClick={() => setShowPassword(!showPassword)} className="p-2.5 text-gray-500 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/50 rounded-md transition-colors">
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
              <button onClick={() => copyToClipboard(pwdData.password, 'password')} className="p-2.5 text-gray-500 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/50 rounded-md transition-colors">
                {copied === 'password' ? <CopyCheck size={20} className="text-green-500" /> : <Copy size={20} />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notes</label>
            <textarea 
              value={pwdData.notes || ''} onChange={(e) => handleChange('notes', e.target.value)}
              className="w-full p-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 outline-none text-gray-800 dark:text-gray-100 min-h-[120px] resize-y"
              placeholder="Add details about this account..."
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 2. STRATEGY MAPPER
// ==========================================
const EditorStrategyMap: Record<string, React.FC<EditorSubProps>> = {
  'Code Snippets': CodeEditor,
  'Password Manager': PasswordEditor,
  // Add new categories here mapped to specific components
};

// ==========================================
// 3. MAIN EDITOR CONTEXT
// ==========================================
export default function Editor() {
  const { notes, activeNoteId, updateNote } = useNoteStore();
  const activeNote = notes.find(n => n.id === activeNoteId) || null;
  const [saveStatus, setSaveStatus] = useState('Saved');

  // Debounced save status indicator
  useEffect(() => {
    setSaveStatus('Saving...');
    const timer = setTimeout(() => setSaveStatus('Saved'), 500);
    return () => clearTimeout(timer);
  }, [activeNote?.content, activeNote?.title, activeNote?.category]);

  if (!activeNote) return null;

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateNote({ ...activeNote, title: e.target.value, lastModified: Date.now() });
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateNote({ ...activeNote, category: e.target.value as NoteCategory, lastModified: Date.now() });
  };

  // Resolve which editor to render based on the map, fallback to Standard
  const onUpdateNote = (updatedNote) => {
    updateNote(updatedNote);
  };

  const ActiveEditorComponent = EditorStrategyMap[activeNote.category] || StandardEditor;

  return (
    <div className="flex-1 flex flex-col h-full bg-white dark:bg-gray-900 transition-colors duration-200 overflow-y-auto">
      {/* Universal Header Area */}
      <div className="px-6 py-3 flex justify-between items-center text-sm text-gray-400 dark:text-gray-500 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-2">
            {saveStatus === 'Saved' && <CheckCircle2 size={14} className="text-green-500" />}
            {saveStatus}
          </span>
          <div className="h-4 w-px bg-gray-200 dark:bg-gray-700"></div>
          
          <select
            value={activeNote.category || 'General'}
            onChange={handleCategoryChange}
            className="bg-transparent border-none outline-none cursor-pointer text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 focus:ring-0 p-0 text-sm font-medium"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat} className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200">
                {cat}
              </option>
            ))}
          </select>
        </div>
        <span>Last edited: {new Date(activeNote?.lastModified).toLocaleTimeString()}</span>
      </div>

      {/* Universal Title Input */}
      <div className="px-6 pt-6">
        <input
          type="text"
          value={activeNote.title}
          onChange={handleTitleChange}
          placeholder={activeNote.category === 'Password Manager' ? "Site name or App..." : "Untitled Note..."}
          className="w-full text-4xl font-bold text-gray-800 dark:text-gray-100 placeholder-gray-300 dark:placeholder-gray-600 border-none outline-none focus:ring-0 bg-transparent transition-colors"
        />
      </div>

      {/* Dynamic Content Area */}
      <div className="flex-1 p-6 flex flex-col">
        <ActiveEditorComponent note={activeNote} onUpdateNote={onUpdateNote} />
      </div>
    </div>
  );
}