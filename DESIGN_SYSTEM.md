# Personal Notepad - Design System & Contribution Rules

## 1. Architectural Patterns
To maintain a clean and scalable codebase, this project strictly adheres to the following patterns:
* **Repository Pattern:** All data access (localStorage, databases) must be abstracted through `src/hooks/useNoteRepository.ts`. UI components must never mutate storage directly.
* **Strategy Pattern:** The Editor component (`src/components/Editor.tsx`) uses a Strategy map (`EditorStrategyMap`) to render different note types. Do NOT use massive `if/else` or `switch` statements to render different note categories. Create a new sub-component and map it.

## 2. UI/UX Guidelines (Tailwind CSS)
Do not override these core design principles without a major version update.

### Color Palette
* **Light Mode Base:** `bg-gray-50` for backgrounds, `bg-white` for cards/editor.
* **Dark Mode Base:** `dark:bg-gray-950` for backgrounds, `dark:bg-gray-900` for cards/editor.
* **Text:** `text-gray-800` (light) / `dark:text-gray-100` (dark) for primary text.
* **Accents:** Use `blue-500` for primary actions and active states. 

### Layout & Spacing
* The application is a full-height `h-screen` flex layout (`Layout.tsx`). No scrolling on the body; scrolling is contained within the Sidebar and Editor sections.
* Use `flex` and `gap-*` for alignments. Avoid fixed margins/padding where flex gaps can be used.

## 3. Pull Request Protocol
1. Never commit directly to `main` or `develop`.
2. Create a `feature/<name>` branch.
3. Ensure `npm run lint` and `npm run build` pass locally with zero errors before opening a PR.