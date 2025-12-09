# USE THE DEMO BRANCH FOR TESTING ON YOUR LOCAL MACHINE

# Online Game Platform

A simple Online Game Platform built using:

- React (frontend)
- Flask (backend)
- MySQL (database)

This project allows users to create and join game rooms through a simple web interface.

Follow these steps to set up the entire project on your local machine.

Getting Started
1. Clone the Repository
git clone <your-repo-url>
cd OnlineGamePlatform

2. Setup
This setup is designed for Windows.
If you are using a different platform, the setup process will differ.

Run the setup script
This installs dependencies and prepares the environment:
  setup.cmd

Create your .env file:
Copy the example environment file:
  cp .env.example .env


Fill in your MySQL database credentials:

Example .env:
  - DB_USER=your_username
  - DB_PASSWORD=your_password_here
  - DB_HOST=localhost
  - DB_PORT=3306
  - DB_NAME=game-platform

Make sure your MySQL server is running before starting the backend.
Flask Backend

The Flask API will run at:
  http://127.0.0.1:5000

To start the backend server, use:
  backend.cmd

3. Frontend Setup (React)
Open a new terminal and navigate to the frontend folder:
  cd frontend

  Install dependencies:
  npm install

  Start the React App:
  npm start


The app will automatically open at:
  http://localhost:3000


To simplify startup, you can also use:
  frontend.cmd

# Summary of Commands
|Task|Command|
|---|---|
|Full setup|setup.cmd|
|Start backend (Flask)|backend.cmd|
|Start frontend (React)|frontend.cmd|
|Ensure MySQL server is running|(manual step)|

# Team Notes

Never commit your real .env file — only .env.example should be shared.

If you install a new Python package, update requirements.txt:

pip freeze > requirements.txt

If you install a new npm package, it will auto-update package.json.

Always pull the latest changes from GitHub before starting work.
