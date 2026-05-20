import { neon } from '@neondatabase/serverless';

const DATABASE_URL = import.meta.env.VITE_DATABASE_URL || '';

let sql: ReturnType<typeof neon> | null = null;
let initialized = false;

/**
 * Initialize the database connection and auto-create the notes table.
 * Call once at app startup.
 */
export async function initDatabase(): Promise<boolean> {
  if (initialized) return true;

  if (!DATABASE_URL) {
    console.warn('Neon DB: VITE_DATABASE_URL not set. Running without persistence.');
    return false;
  }

  try {
    sql = neon(DATABASE_URL);
    // Auto-create the notes table if it doesn't exist
    await sql`CREATE TABLE IF NOT EXISTS notes (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL DEFAULT '',
      content TEXT NOT NULL DEFAULT '',
      last_modified BIGINT NOT NULL,
      category TEXT NOT NULL DEFAULT 'General'
    )`;
    initialized = true;
    console.log('Neon DB: Connected and ready');
    return true;
  } catch (error) {
    console.error('Neon DB: Failed to connect:', error);
    return false;
  }
}

// ========== NOTE CRUD OPERATIONS ==========

export async function getAllNotes(): Promise<{
  id: string;
  title: string;
  content: string;
  lastModified: number;
  category: string;
}[]> {
  if (!sql) return [];
  try {
    const rows = await sql`SELECT * FROM notes ORDER BY last_modified DESC`;
    return rows.map((row: {
    id: string;
    title: string;
    content: string;
    last_modified: number;
    category: string;
  }) => ({
      id: row.id,
      title: row.title || '',
      content: row.content || '',
      lastModified: Number(row.last_modified),
      category: row.category || 'General',
    }));
  } catch (error) {
    console.error('Neon DB: getAllNotes failed:', error);
    return [];
  }
}

export async function addNoteToNeon(note: {
  id: string;
  title: string;
  content: string;
  lastModified: number;
  category: string;
}): Promise<boolean> {
  if (!sql) return false;
  try {
    await sql`
      INSERT INTO notes (id, title, content, last_modified, category)
      VALUES (${note.id}, ${note.title}, ${note.content}, ${note.lastModified}, ${note.category})
    `;
    return true;
  } catch (error) {
    console.error('Neon DB: addNote failed:', error);
    return false;
  }
}

export async function updateNoteInNeon(note: {
  id: string;
  title: string;
  content: string;
  lastModified: number;
  category: string;
}): Promise<boolean> {
  if (!sql) return false;
  try {
    await sql`
      UPDATE notes
      SET title = ${note.title},
          content = ${note.content},
          last_modified = ${note.lastModified},
          category = ${note.category}
      WHERE id = ${note.id}
    `;
    return true;
  } catch (error) {
    console.error('Neon DB: updateNote failed:', error);
    return false;
  }
}

export async function deleteNotesFromNeon(ids: string[]): Promise<boolean> {
  if (!sql || ids.length === 0) return false;
  try {
    await sql`DELETE FROM notes WHERE id = ANY(${ids})`;
    return true;
  } catch (error) {
    console.error('Neon DB: deleteNotes failed:', error);
    return false;
  }
}
