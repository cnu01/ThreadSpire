# ThreadSpire Backend

This is the backend API for the ThreadSpire application. It is built with Node.js, Express, and MongoDB.

## Features
- User authentication (JWT)
- Thread creation, editing, forking, and reactions
- Collections and bookmarks
- Analytics endpoints

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB

### Setup
1. Install dependencies:
   ```sh
   npm install
   ```
2. Create a `.env` file in the Backend directory with the following variables:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   PORT=5000
   ```
3. Start the server:
   ```sh
   npm start
   ```

## API Endpoints
- `/api/auth` - User registration and login
- `/api/threads` - Thread CRUD, forking, reactions
- `/api/collections` - Collection management
- `/api/bookmarks` - Bookmark management
- `/api/analytics` - Analytics data

## Development
- Uses nodemon for hot-reloading (run with `npm run dev`)

## License
MIT
