# idea_garden

Idea Garden is a personal web app concept for capturing idea cards, connecting related ideas, and expanding them over time. A future connection map will make those relationships easier to explore.

## Current status

This repository is an initial project scaffold. The app has not been implemented yet.

## Intended direction

- Capture ideas as cards with a title and notes.
- Expand an idea as it develops.
- Connect related ideas.
- Eventually visualize those connections in a map.

These describe the project's direction, not features available today.

## Project structure

```text
idea_garden/
├── README.md       # Project overview and getting started
├── .gitignore      # Files that should stay out of Git
├── src/
│   └── README.md   # Guide for future application code
└── assets/
    └── README.md   # Guide for images and other static files
```

## Getting started

1. Clone the repository:
   ```sh
   git clone https://github.com/astrodumpp/idea_garden.git
   cd idea_garden
   ```
2. Open the folder in your preferred editor.
3. Read the folder guides before adding files.

There is nothing to install or run yet. No framework, package manager, database, or hosting service has been selected.

## Keep it simple

Begin with a small browser-based app using HTML, CSS, and JavaScript when implementation starts. Add tools only when a concrete need arises. Keep application code in `src/` and shared static files in `assets/`.

A suggested first development step is a single idea-card flow. Choose how ideas will be saved before implementing persistence. Connections and the map can follow once the basic flow works.

## Repository hygiene

Do not commit passwords, API keys, environment files, or private idea exports. The ignore rules cover common local files and generated output; check staged changes before committing.
