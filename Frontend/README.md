# ThreadSpire Frontend

This is the frontend for the ThreadSpire application, built with React, Zustand, and Tailwind CSS.

## Features
- Thread creation, editing, remixing, and reactions
- Personal collections and bookmarks
- Analytics dashboard with charts
- Authentication and protected routes

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)

### Setup
1. Install dependencies:
   ```sh
   npm install
   ```
2. Create a `.env` file in the Frontend directory with the following variable:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```
3. Start the development server:
   ```sh
   npm run dev
   ```

## Project Structure
- `src/components/` - Reusable UI and feature components
- `src/pages/` - Main page components
- `src/stores/` - Zustand state management
- `src/utils/` - Utility functions

## Development
- Uses Vite for fast refresh
- Tailwind CSS for styling

## License
MIT
