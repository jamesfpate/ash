# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Environment
Claude Code is run from within the devbox shell to ensure consistent access to development tools (Node.js, go-task).

## Project Overview
Kids' word typing game built with SvelteKit where children practice typing words, letters, or phrases that appear on screen.

## Development Checklist

### Initial Setup
- [x] Initialize SvelteKit project with TypeScript
- [x] Install necessary dependencies (idb for browser storage)
- [x] Create Taskfile.yml for running the app with `task dev`

### Core Features
- [x] Create main game page with:
  - [x] Display area for random word/phrase at top
  - [x] Text input area at bottom for kid to type
  - [x] Success animation when typed text matches target
- [x] Create settings page with:
  - [x] Ability to create multiple word lists
  - [x] Text area for each list (one word/phrase per line)
  - [x] Checkbox to enable/disable each list
  - [x] Save lists to browser storage
- [x] Implement browser storage for persistence using IndexedDB
- [x] Add navigation between game and settings pages

### Technical Implementation
- [x] Use idb for IndexedDB browser storage
- [x] Implement random word selection from enabled lists
- [x] Add CSS animations for success feedback
- [x] Ensure responsive design for various screen sizes
- [x] Add proper TypeScript types for word lists and game state

## Commands
```bash
# Run development server
task dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run type checking
npm run check

# Format code
npm run format

# Lint code
npm run lint
```

## Deployment
- This app is deployed via GitHub Actions to Portainer
- The Dockerfile uses a multi-stage build with Node.js 24
- The production app runs as the `sveltekit` user (non-root) on port 3000
- Start command in production: `node build`

## Architecture
- `/src/routes/` - SvelteKit pages (game and settings)
- `/src/lib/` - Shared components and utilities
  - `/src/lib/stores/` - Svelte stores for game state and word lists
  - `/src/lib/components/` - Reusable UI components
  - `/src/lib/storage/` - Browser storage utilities
- `/static/` - Static assets