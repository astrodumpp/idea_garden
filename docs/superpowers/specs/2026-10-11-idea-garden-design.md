# Idea Garden first-version design

Build a calm personal creative workspace using React, Vite, Tailwind CSS, JavaScript, and localStorage. No backend, authentication, deployment, or AI.

## Architecture
App.jsx owns ideas, connections, navigation, and the open idea. Focused components handle cards, the create/edit form, details, and an SVG map. A small storage module handles persistence. Standard React state and props avoid routing and state-management dependencies.

## Data and features
Ideas have stable unique IDs, titles, descriptions, and automatic ISO creation dates. Editing and expanding descriptions preserves creation dates. Connections are undirected pairs of distinct existing IDs; prevent duplicates. Deleting an idea removes its connections. Save ideas and connections together under one versioned localStorage key. Validate loaded data and surface storage errors without silently overwriting unreadable data.

## Interface
Provide a header, Capture an idea button, Ideas/Connections navigation, and random rediscovery. Begin with an empty state. Cards show title, description preview, date, and connection count. Cards and map nodes open details with edit, delete, connected ideas, and a selector to add connections. Require nonblank titles and confirm deletion. Use labeled forms, keyboard access, visible focus, and accessible dialogs with focus management.

## Map and styling
Arrange labeled SVG nodes around a circle, with lines behind them; center a single node. Clicking or keyboard-activating a node opens details. Allow horizontal overflow for large maps. No dragging or graph library.
Use the requested ivory background, white cards, warm dark text, orange and lavender accents, rounded corners, subtle borders, generous whitespace, system fonts, and responsive layouts.

## Validation and documentation
Verify production build and meaningful data checks for duplicate connections, deletion cleanup, and stored-data validation. Inspect the UI in a browser if available. README documents setup, main files, persistence, manual checks, and limitations. Initialize local Git without a remote or deployment.

## Limitations
Storage is specific to the browser and origin, has finite capacity, and is lost if cleared. No synchronization or backup. Dense connection maps can become crowded.
