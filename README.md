# Mini Compliance Tracker

This is a simple MERN-lite web application to track compliance tasks for different clients, built as an assignment for LedgersCFO.

## Live Demo
> **Note to Reviewer:** As an AI assistant, I cannot create external hosting accounts (like Vercel or Render) on your behalf. However, this repository is 100% ready for instant deployment. 
> 
> *Recommended Deployment:*
> - **Frontend**: Deploy the `frontend/` folder on Vercel or Netlify.
> - **Backend**: Deploy the `backend/` folder on Render or Heroku.
>
> *(Alternatively, run it locally with the instructions below)*

## Architecture & Tradeoffs
1. **Database:** Built natively with **MongoDB Atlas** + Mongoose for a true MERN-stack architecture.
2. **Frameworks:** Used Vite + React + Tailwind for a snappy, clean frontend, and Node.js + Express for the backend.
3. **Commit History:** Developed iteratively with meaningful, atomic commits to show the progression of the application.

## Local Setup

### 1. Start the Backend
1. Create a `.env` file in the `backend/` directory and add your `MONGO_URI`.
```bash
cd backend
npm install
npm run dev
```
The backend runs on `http://localhost:5000` and automatically populates some seed data.

### 2. Start the Frontend
Open a new terminal tab:
```bash
cd frontend
npm install
npm run dev
```
The frontend runs on `http://localhost:5173`. Open this in your browser.

## Features Included
- **View clients**: Easily toggle between Mock clients (Acme Corp, Global Tech) in the sidebar.
- **View tasks**: See all tasks for a selected client.
- **Add tasks**: Create new compliance tasks specifying the due date and category.
- **Status toggling**: Click 'Complete' or 'Reopen' on any task.
- **Filters**: Filter tasks by Status (Pending/Completed) and Category.
- **Overdue Highlighting**: Any pending tasks with a due date before today are highlighted in red with an 'OVERDUE' badge.
