#  Frontend Mentor - Typing Speed Test solution
This is a solution to the Typing Speed Test challenge on Frontend Mentor

[![Vite](https://img.shields.io/badge/bundler-vite-blue)](https://vitejs.dev/) [![Framework: React](https://img.shields.io/badge/framework-react-61DAFB?logo=react&logoColor=white)](https://reactjs.org/) [![License: MIT](https://img.shields.io/badge/license-MIT-green)](#license)

**Short description**: A responsive, keyboard-first typing speed test built with React and Vite. Users can take timed tests or type full passages, track WPM and accuracy, and save a local personal best.

## Table of contents
- [Overview](#overview)
  - [The challenge](#the-challenge)
  - [Links](#links)
- [Features](#Features)
- [Tech Stack](#Tech-Stack)
- [Installation](#Installation)
- [Project Structure](Project-Structure)
- [What I learned](#what-i-learned)
- [Continued development](#continued-development)
- [Author](#author)
- [Acknowledgments](#acknowledgments)

## Overview

### The challenge

Users should be able to:

- Measure typing speed (WPM) and accuracy
- Complete either a timed test or full passage typing
- Switch between difficulty levels
- View responsive layouts across device sizes
- Receive real-time feedback while typing

This project focuses on state management, timing logic, keyboard-first UX, and persistence using localStorage.

### Links 
 - Solution URL: [Add solution URL here](https://your-solution-url.com)
- Live Site URL: [Add live site URL here](https://your-live-site-url.com)

## Features

- **Timed Mode**: 60-second test to measure WPM and accuracy.
- **Passage Mode**: Type complete passages chosen at random from the bundled dataset.
- **Difficulty Levels**: Easy / Medium / Hard that select different paragraph pools.
- **Real-time Stats**: WPM, accuracy, and time remaining are updated live.
- **Results View**: Final accuracy, correct characters, and errors are summarized after a run.
- **Personal Best**: Stores the highest WPM in `localStorage`.
- **Responsive UI**: Works on mobile and desktop; keyboard-first interactions.
- **Accessibility Considerations**: Focus states, large hit targets, and readable contrast.

## Tech Stack

- **Framework**: React (see [typing_speed_test/src/App.jsx](typing_speed_test/src/App.jsx))
- **Bundler**: Vite (see `vite.config.js`)
- **Styling**: Tailwind CSS
- **Testing Data**: `typing_speed_test/data.json` (paragraphs used by the app)
- **Linting**: ESLint

## Installation

- **Requirements**: Node.js (v16+ recommended) and npm.

Run the following commands to get started locally:

```bash
# from the project root
cd typing_speed_test
npm install
npm run dev
```

**Available scripts** (from [typing_speed_test/package.json](typing_speed_test/package.json))

- **dev**: `npm run dev` — starts the Vite dev server
- **build**: `npm run build` — builds the production bundle
- **preview**: `npm run preview` — preview the production build locally
- **lint**: `npm run lint` — run ESLint across the project

**Usage**

- Open the dev server (usually at `http://localhost:5173`) and choose a mode (Timed or Passage).
- Select difficulty (Easy / Medium / Hard) to change the paragraph pool.
- Start typing in the input; stats update in real-time. At the end, review the results and restart.

## What I learned
 - Implementing precise timing logic without unnecessary re-renders
 - Calculating WPM and accuracy from raw keystroke data
 - Managing UI state transitions between active, finished, and idle test states
 - Using localStorage safely for lightweight persistence
 - Structuring React components to separate logic from presentation

## Continued development
 Future improvements I would consider:
- **Account sync**: Optionally add user accounts to sync personal bests across devices.
- **Leaderboard**: Add an opt-in leaderboard with server-side storage.
- **Custom durations**: Allow users to choose other timed durations (15s/30s/120s).
- **Accessibility audit**: Improve ARIA attributes and screen-reader flows.

## Project Structure

```text
typing_speed_test/
├─ index.html
├─ data.json
├─ package.json
├─ vite.config.js
└─ src/
   ├─ main.jsx
   ├─ App.jsx
   └─ components/
```
## Author
- GitHub: [mikiyas Mekbib](https://github.com/mikimek23)
- Frontend Mentor:[frontend-mentor-miki](https://www.frontendmentor.io/profile/mikimek23)
## Acknowledgments
Design by [Frontend Mentor](https://www.frontendmentor.io/)


