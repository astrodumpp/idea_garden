# Idea Garden

A calm, personal workspace for capturing ideas, following connections, and coming back to unfinished thoughts. This first version uses React, Vite, JavaScript, Tailwind CSS, and browser localStorage.

## Run locally

Install Node.js 22.12 or newer (Node 24 LTS works). Node's standard installer includes npm. Open a terminal in this directory:

```powershell
cd C:\Users\steve\idea_garden
npm install
npm run dev
```

Open the local URL printed by Vite, normally `http://127.0.0.1:5173`. Keep the terminal running. Press Ctrl+C to stop the server. No accounts, API keys, or environment variables are needed.

```powershell
npm test         # Data validation and connection tests
npm run build    # Production files in dist/
npm run preview  # Locally preview the production build
```

The package-lock.json records the installed dependency versions. For a reproducible install on another machine, use `npm ci`. If npm is unavailable in Codex's bundled runtime, its bundled pnpm can run `pnpm dlx npm install` to install the same project. On a normal Node installation, use the npm commands above.

## Main files

| File | Responsibility |
| --- | --- |
| `src/main.jsx` | Mounts the React application and imports styles. |
| `src/App.jsx` | Shared ideas/connections state, navigation, persistence, and user actions. |
| `src/storage.js` | Validates saved data, reads/writes localStorage, prevents invalid connections, and cleans up deleted ideas. |
| `src/components/IdeaCard.jsx` | Shows an idea preview, creation date, and connection count. |
| `src/components/IdeaForm.jsx` | The shared create/edit form; validates titles and preserves multiline descriptions. |
| `src/components/IdeaDetails.jsx` | Full description, expansion, connected ideas, connection controls, and confirmed deletion. |
| `src/components/Dialog.jsx` | Native modal dialog with keyboard focus management and Escape dismissal. |
| `src/components/ConnectionMap.jsx` | Labeled SVG nodes in a circle, lines, and mouse/keyboard selection. |
| `src/index.css` | Tailwind import, theme colors, reusable classes, and map/dialog styling. |
| `src/storage.test.js` | Tests storage round trips, corrupt data, storage errors, connection rules, and deletion cleanup. |
| `vite.config.js` | Vite's React and Tailwind plugins. |
| `index.html` | Browser document and React entry point. |

State stays in App and flows down through props. This makes it easy to trace an action without a router or state library. Ideas and connections are saved together so deletion and connection cleanup use a single write. The map uses a fixed circle rather than a graph dependency. Tailwind uses its [Vite plugin](https://tailwindcss.com/docs/installation/using-vite).

## How saving works

Saving an idea, editing it, adding/removing a connection, or deleting it immediately saves the whole garden as JSON under the localStorage key `idea-garden-v1`. Ideas contain `id`, `title`, `description`, and `createdAt`. IDs use `crypto.randomUUID()`, and creation dates use ISO timestamps. Editing preserves the original date. Connections are undirected pairs of idea IDs, with no duplicates or self-connections.

Data survives refreshing and reopening the browser when you return to the same address. Storage is specific to the browser, profile, and origin (scheme, hostname, and port). `localhost` and `127.0.0.1`, different ports, and the production preview each have separate gardens. Use the same URL to return to your saved ideas.

If saved data cannot be read, the app displays an error and leaves the stored value untouched. You can use a temporary garden for that session, but it will not save. If a write fails because storage is blocked or full, the app retains your changes in memory and shows an error. Resolve the issue before relying on persistence; a later successful action saves the current garden. There is no automatic background retry.

## Manual feature check

1. Start with an empty garden. Rediscovery should be disabled. Capture an idea with a title and multiline description. Check its card and automatic date.
2. Capture a second idea. Open either card, choose the other idea under **Connect to another idea**, and click **Connect**. Check the link and card connection count. The same pair cannot be added twice.
3. Switch to **Connections**. Check both labeled nodes and the line. Click a node to open its details; keyboard users can Tab to a node and press Enter or Space.
4. Click **Edit & expand**, add text, and save. Check the full description and unchanged creation date. Cancel should discard edits. Blank or whitespace-only titles should be rejected.
5. Refresh the page, then close/reopen the tab at the same URL. Check that ideas, descriptions, dates, and connections remain.
6. Remove a connection in details. Confirm its line disappears. Reconnect the ideas, delete one, and confirm its card, node, and connections disappear. **Keep idea** cancels deletion.
7. Click **Rediscover an idea**. It should open one existing idea. Random selection may repeat an idea.
8. Try a narrow mobile window, long titles, and long descriptions. Test Tab, Shift+Tab, and Escape in dialogs. Focus should stay inside the open dialog and return to its trigger on close. If the trigger was deleted, focus returns to **Capture an idea**.

## Validation performed

- Seven Node tests passed, including persistence, invalid data, storage exceptions, reversed duplicate links, and deletion cleanup.
- The production build passed.
- Automated Chrome checks passed for create/edit/expand, date preservation, connections, refresh persistence, map selection, removal, confirmed deletion, rediscovery, mobile overflow, whitespace validation, and keyboard focus.
- Browser checks also verified that unreadable storage is preserved and write failures show a warning while retaining session data. A 30-idea map kept readable labels.

## First-version limitations

- Ideas are only in this browser's storage: no backup, export, device synchronization, or multi-tab conflict handling. Avoid editing the same garden in multiple tabs at once.
- Clearing browser storage removes ideas. Private browsing generally deletes storage when the session ends. Storage quotas also apply.
- Large maps require scrolling; many connections can cross and become crowded. Long node labels are shortened, with full titles in details and hover/accessibility labels. Node dragging is not included.
- Intended for modern browsers with localStorage, native dialogs, and `crypto.randomUUID()` on localhost or HTTPS.
- No backend, authentication, AI recommendations, or deployment. All requested first-version features are implemented.
