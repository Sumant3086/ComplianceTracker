MINI COMPLIANCE TRACKER

DEMO: https://compliancetracker-hye5.onrender.com/

ABOUT THE PROJECT

This is a professional web application built to track and manage compliance tasks for various clients.

It was developed to provide a seamless user experience using a modern technology stack.

The backend is powered by Node and Express connected to a MongoDB Atlas cloud database.

The frontend is a snappy React application styled with Tailwind CSS.

DEPLOYED APPLICATION LINKS

Frontend App: https://compliancetracker-hye5.onrender.com/

Backend API: https://compliancetracker-api.onrender.com/api/clients

GitHub Repository: https://github.com/Sumant3086/ComplianceTracker

SETUP INSTRUCTIONS

To run the Backend:

1. Open your terminal and navigate to the backend directory.

2. Run the command npm install to download all dependencies.

3. Create a file named .env and add your MONGO_URI string inside it.

4. Run the command npm run dev to start the server.

5. The server will automatically seed the mock data if your database is empty.

To run the Frontend:

1. Open a new terminal and navigate to the frontend directory.

2. Run the command npm install to download all dependencies.

3. Run the command npm run dev to start the React application.

4. Open your browser to the local port indicated in the terminal.

TRADEOFFS

Authentication and complex user login flows were intentionally omitted. The decision was made to prioritize a working product end-to-end with clear core functionality, rather than building incomplete complex features.

Tailwind CSS was chosen over heavy third-party component libraries. This guarantees a clean structure and total control over the UI without bloated dependencies, perfectly aligning with the instruction to focus on usability over heavy design.

The backend API relies on standard Node and Express REST routing rather than a complex architecture. This keeps the codebase minimal, readable, and highly focused on the requested core features.

ASSUMPTIONS

It was assumed that demonstrating clear thinking and a clean full-stack structure was more important than achieving visual perfection, so the UI was kept strictly neat and functional.

It was assumed that compliance task statuses are strictly binary for the immediate scope of this tracking system.

It was assumed that overdue tasks should be dynamically calculated based purely on checking the current system date against the exact task due date, avoiding the need for complex database chron jobs.
