# Idea Garden Implementation Plan

> **For agentic workers:** Use superpowers:executing-plans to implement this plan task by task. Track the checkboxes below.

**Goal:** Build the complete local-only first version described in the approved design.

**Architecture:** App owns shared React state. Focused components render cards, an accessible dialog and form, details, and a fixed-layout SVG map. One storage module validates and persists a single data object.

**Tech Stack:** React, Vite, Tailwind CSS, JavaScript, localStorage, npm, Node built-in test runner.

**Spec:** docs/superpowers/specs/2026-10-11-idea-garden-design.md

## Global constraints
- No backend, authentication, deployment, AI, or extra product features.
- Use standard React state and props, system fonts, minimal dependencies, and beginner-readable names.
- Background #F7F5F0; cards #FFFFFF; text #35332F; accents #F5B88D and #C7B8EA.
- Preserve creation dates during editing and remove connections during deletion.

## Review focus
- Corrupt or unsupported stored data: show an error and do not overwrite it.
- Storage denial or quota exhaustion: keep current-session data and clearly report failed persistence.
- Duplicate, reversed, self, or dangling connections: reject invalid pairs.
- Long titles, multiline descriptions, and mobile widths: retain readable text and usable controls.
- Keyboard dialog use: move focus inside, contain Tab focus, support Escape, and restore focus.

## Task 1: Scaffold and safe data model
**Files:** package.json, package-lock.json, index.html, vite.config.js, .gitignore, src/main.jsx, src/storage.js, src/storage.test.js.
**Interfaces:** loadGarden(storage) returns { data, error }; saveGarden(storage, data) throws on failure; addConnection(data, firstId, secondId) returns updated data; deleteIdea(data, ideaId) returns updated data. Data is { version: 1, ideas: [{ id, title, description, createdAt }], connections: [[id, id]] }.
- [x] Initialize local Git and a minimal Vite/React/Tailwind project; use the bundled package manager if npm is unavailable.
- [x] Write data tests before implementation: empty store, round-trip persistence, invalid JSON/schema, unsupported version, reversed duplicate, self/dangling connection, deletion cleanup, and storage exceptions.
- [x] Run node --test and confirm missing behavior fails; implement the storage and data helpers; rerun until all tests pass.

## Task 2: Ideas and detail editing
**Files:** src/App.jsx, src/components/IdeaCard.jsx, src/components/IdeaForm.jsx, src/components/Dialog.jsx, src/components/IdeaDetails.jsx, src/index.css.
**Interfaces:** App supplies ideas and mutation callbacks to child components; cards and details use onOpen(ideaId); form uses onSave({ title, description }); dialog uses onClose().
- [x] Build header, navigation, capture action, empty state, and responsive cards using the specified palette.
- [x] Implement creation with unique IDs and automatic dates; editing and description expansion preserve dates. Require a trimmed nonblank title.
- [x] Implement detail dialog, confirmed deletion, connected-idea links, connection selector, removal, and random rediscovery.
- [x] Connect state changes to storage with visible errors. Block persistence after an unreadable initial load, preserving the stored value.
- [x] Verify create/edit/delete, multiline and long text, keyboard focus behavior, and errors during browser checks.

## Task 3: Connection map and delivery
**Files:** src/components/ConnectionMap.jsx, README.md.
**Interfaces:** ConnectionMap receives ideas, connections, and onOpen(ideaId).
- [x] Render SVG lines behind labeled keyboard-accessible nodes in deterministic circular positions; center a single node and handle the empty state.
- [x] Verify map selection, connection addition/removal, deletion cleanup, refresh persistence, mobile layout, and rediscovery in a browser if available.
- [x] Write README with installation and local run commands, file responsibilities, storage behavior, manual test sequence, and first-version limitations.
- [x] Run the full data test suite and production build; inspect all output and report any remaining verification limitations. Do not deploy or create a remote.
