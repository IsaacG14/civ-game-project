Civ Game Project

A simple Civilization-style game project using React (frontend), Flask (backend), and MySQL (database).

🚀 Getting Started
1. Clone the Repository
git clone <your-repo-url>
cd CivGameProject

2. Backend Setup (Flask + MySQL)

Navigate to the backend folder:

cd backend


Create and activate a virtual environment:

python -m venv venv
venv\Scripts\activate    # Windows
source venv/bin/activate # Mac/Linux


Install dependencies from requirements.txt:

pip install -r requirements.txt


Copy .env.example to .env and fill in your database credentials:

cp .env.example .env


Example .env:

DB_USER=civ_user
DB_PASSWORD=your_password_here
DB_HOST=localhost
DB_PORT=3306
DB_NAME=civ_game


Run the backend:

flask run


The Flask API will be available at http://127.0.0.1:5000
.

3. Frontend Setup (React)

Open a new terminal and navigate to frontend:

cd frontend


Install dependencies:

npm install


Start the React app:

npm start


The app will open at http://localhost:3000
.

🛠 Tech Stack

Frontend: React

Backend: Flask

Database: MySQL

👥 Team Notes

Never commit your real .env file — only .env.example should be shared.

If you install a new Python package, update requirements.txt:

pip freeze > requirements.txt


If you install a new npm package, it will auto-update package.json.

Always pull the latest changes from GitHub before starting work.