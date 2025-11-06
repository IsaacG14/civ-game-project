"""
Required Python packages for this project:

# Core backend framework
pip install Flask

# JWT authentication
pip install PyJWT

# Cross-Origin Resource Sharing (allow React frontend to call Flask backend)
pip install Flask-CORS

# Optional: MySQL database support (if using database later)
pip install mysql-connector-python

# Optional: Load environment variables from a .env file (for secrets like JWT_SECRET_KEY)
pip install python-dotenv

# Minimal working backend install command (everything you need for current setup):
pip install Flask PyJWT Flask-CORS
"""


from flask import Flask, jsonify, request
from flask_cors import CORS
from functools import wraps
import jwt
import datetime
import os
import mysql.connector
import bcrypt

# Define key for token encryption
SECRET_KEY = os.environ.get("JWT_SECRET_KEY", "gameApp")
MAX_USERNAME_LENGTH = 20
MIN_USERNAME_LENGTH = 5
MAX_PASSWORD_LENGTH = 255
MIN_PASSWORD_LENGTH = 8

#import mysql.connector

# initilizes Flask application.
app = Flask(__name__)
CORS(app, origins=["http://localhost:8080"])

# Sample game data.
sample_games = [
    {"id": 1, "type": "Tic-Tac-Toe", "name": "i want tic tac", "players": ["Alice", "Bob"], "data": "[0,4,1,2,6]"},
    {"id": 2, "type": "Tic-Tac-Toe", "name": "naughts and crosses (oi mate)", "players": ["Charlie", "Bob"], "data": "[4,7,6,1,2]", "winner": "Charlie"},
]

# Database connection config
db_config = {
    "host": "127.0.0.1",
    "user": "civ_user",       # the user you created
    "password": "civ_pass123",# the password you set
    "database": "civ_game"
}

'''
@app.route("/players")
def get_players():
    try:
        #conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM players")
        rows = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify(rows)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
'''

def get_db_connection():
    # Mysql information (change to match your database)
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="DataPassword1", 
        database="dbgame"
    )


# Checks for validity of token.
@app.route("/api/hub")
def hub_data():
    # Checks if request is in the correct format with header.
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        return jsonify({"message": "Missing token"}), 401
    
    # Separate token out of request.
    token = auth_header.split(" ")[1]

    # Check if given token is valid, expired, or invalid. Return error if not valid.
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        return jsonify({"message": f"Hello user {payload['user_id']}!"})
    except jwt.ExpiredSignatureError:
        return jsonify({"message": "Token expired"}), 401
    except jwt.InvalidTokenError:
        return jsonify({"message": "Invalid token"}), 401

# Decorator function added as @require_jwt (below @app_route) which can be used to protect routes from access by users without a valid JWT token.
# Currently not used.
def require_jwt(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get("Authorization")
        if not token:
            return jsonify({"message": "Missing token"}), 401

        try:
            token = token.split(" ")[1]  # remove "Bearer"
            decoded = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            request.user_id = decoded["user_id"]  # attach to request
        except Exception:
            return jsonify({"message": "Invalid or expired token"}), 401
        
        return f(*args, **kwargs)
    return decorated

# Finds if user exists in list of example users. 
def find_user(username):
    for user in users:
        if user["username"] == username:
            return user
    return None

# Handles login attempts.
@app.route("/log_in", methods=["POST"])
def log_in():
    conn = get_db_connection()
    # Store data sent by user containing username and password.
    data = request.get_json() 
    print("Received:", data)

    # Seperate username and password into variables
    username = data.get("username")
    password = data.get("password")
    dbpassword = None

    # Find user using username. If user is not found return error.
    try:
        cursor = conn.cursor()
        # Use parameterized query to avoid SQL injection
        cursor.execute("SELECT user_id, password_hash FROM users WHERE username = %s", (username,))        
        row = cursor.fetchone()
        if row:
            id = row[0]
            dbpassword = row[1]  # password
        else:
            return jsonify({"message": "User not found."}), 401
    finally:
        cursor.close()
        conn.close()
   

    # Check if attempted password is users password.
    if bcrypt.checkpw(password.encode('utf-8'), dbpassword.encode('utf-8')):
        # Create a JWT token valid for 1 hour.
        token = jwt.encode(
            {
                "user_id": id,
                "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=1)
            },
            SECRET_KEY,
            algorithm="HS256"
        )
        return jsonify({"token": token})
    
    # If password is incorrect, return error.
    return jsonify({"message": "Invalid credentials"}), 401

@app.route("/sign_up", methods = ["POST"])
def sign_up():
    conn = get_db_connection()
    # Store data sent by user containing username and password.
    data = request.get_json() 
    print("Received:", data)

    # Seperate username and password into variables
    username = data.get("username")
    if (len(username) > MAX_USERNAME_LENGTH or len(username) < MIN_USERNAME_LENGTH):
        return jsonify({"success": False, "error": f"Username length must be {MIN_USERNAME_LENGTH}-{MAX_USERNAME_LENGTH}"}), 400
    email = data.get("email")
    password = data.get("password")
    if (len(password) > MAX_PASSWORD_LENGTH or len(password) < MIN_PASSWORD_LENGTH):
        return jsonify({"success": False, "error": f"Password length must be {MIN_PASSWORD_LENGTH}-{MAX_PASSWORD_LENGTH}"}), 400
    password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    password = password.decode('utf-8')

    try:
        cursor = conn.cursor()
        # Parameterized query prevents SQL injection
        cursor.execute(
            "INSERT INTO users (username, email, password_hash) VALUES (%s, %s, %s)",
            (username, email, password)
        )
        conn.commit()
        # Return the auto-incremented id
        return jsonify({"message": "User successfully created!"})
    except mysql.connector.Error as err:
        print("Error:", err)
        return jsonify({"success": False, "error": "Username already taken"}), 400
    finally:
        cursor.close()
        conn.close()


# Run app.
if __name__ == "__main__":
    app.run(debug=True)



