# Copilot Instructions for careergraph-client

## Project Overview

- **Framework:** React (with Vite for build and dev server)
- **Language:** JavaScript (no TypeScript by default)
- **Entry Point:** `src/main.jsx` loads `App.jsx`
- **Routing:** Defined in `src/routes/` (`index.js`, `routes.jsx`)
- **State Management:** Context API (see `src/contexts/AuthContext.jsx`)
- **API Layer:** All external API calls are in `src/api/` (e.g., `authApis.js`, `candidateApis.js`, `jobsApi.js`).
- **Component Organization:**
  - UI components are grouped by type in `src/components/`
  - Dashboard-specific components in `src/components/ProfileDashboard/`
  - Layouts in `src/layouts/`

## Build & Run

- **Dev server:** `npm run dev` (uses Vite)
- **Build:** `npm run build`
- **Lint:** `npm run lint` (uses ESLint, config in `eslint.config.js`)

## Key Patterns & Conventions

- **Component Structure:**
  - Prefer functional components and hooks.
  - Use `src/components/Containers/ProtectedRoute.jsx` for route protection.
  - UI elements (buttons, cards, tags) are in subfolders under `src/components/`.
- **Styling:**
  - Global styles in `src/index.css`.
  - Component-specific styles are inline or imported per component.
- **Assets:**
  - Images and SVGs in `src/assets/` (organized by type).
- **Data:**
  - Static data (mock, config, lists) in `src/data/` and `src/mock/`.

## Integration Points

- **APIs:** All network requests go through files in `src/api/`. Use these for backend communication.
- **Context:** Use `AuthContext` for authentication state and user info.
- **Routing:** Use React Router (see `src/routes/`).

## Examples

- To add a new dashboard card, create a component in `src/components/ProfileDashboard/` and import it in `ProfileDashboard.jsx`.
- To add a new API call, extend the relevant file in `src/api/` and use it in your component.

## Tips for AI Agents

- Always use existing API and context patterns for new features.
- Follow the folder structure for new components and assets.
- Reference `README.md` and `eslint.config.js` for build/lint details.
- For cross-component communication, prefer context or props.

---

If any section is unclear or missing, please provide feedback for further refinement.
