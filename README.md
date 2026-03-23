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

Authentication and complex user login flows were intentionally omitted to prioritize core compliance tracking logic and maintain absolute simplicity as requested by the assignment parameters.

Tailwind CSS was chosen over a heavy third party component library to guarantee complete control over the interface styling without introducing bloated package dependencies.

The backend API relies on standard Express routing rather than a complex GraphQL architecture which perfectly suits the straightforward operations required by this assignment.

ASSUMPTIONS

It was assumed that the primary goal is a fully functional end to end data system highlighting a true architecture rather than an overly complex dashboard.

It was assumed that compliance task statuses are strictly binary for the immediate scope of this tracking system.

It was assumed that overdue tasks should be dynamically calculated based purely on checking the current system date against the exact task due date.
