export type NoteCategory = 'General' | 'AI Prompts' | 'Contact Details' | 'Code Snippets' | 'Project Ideas';

export interface Note {
  id: string;
  title: string;
  content: string;
  lastModified: number;
  category: NoteCategory;
}