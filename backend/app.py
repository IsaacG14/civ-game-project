"""
To install all the required python packages, use `uv sync`
"""


from flask import Flask, jsonify, request
from flask_cors import CORS
from functools import wraps
import os
import jwt
import datetime
import mysql.connector
import bcrypt
import dotenv

MAX_USERNAME_LENGTH = 20
MIN_USERNAME_LENGTH = 5
MAX_PASSWORD_LENGTH = 255
MIN_PASSWORD_LENGTH = 8


# initilizes Flask application.
app = Flask(__name__)
CORS(app)


# Database connection config
env = dotenv.dotenv_values(os.path.abspath("personal.env"))

db_config = {
    "host": env["DB_HOST"], 
    "user": env["DB_USER"], 
    "password": env["DB_PASS"], 
    "database": env["DB_NAME"]
}

SECRET_KEY = env["JWT_SECRET_KEY"]

# Decorator function added as @require_jwt (below @app_route) which can be used to protect routes from access by users without a valid JWT token.
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

'''def get_user_id_from_token(token):
    try:
        # Decode the token
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        user_id = payload.get("user_id")
        return user_id
    except jwt.ExpiredSignatureError:
        print("Token has expired")
        return None
    except jwt.InvalidTokenError:
        print("Invalid token")
        return None'''

@app.route("/api/get_player_info")
@require_jwt
def get_player_info():
    user_id = request.user_id

    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        query = "SELECT username, user_id, email FROM user WHERE user_id = %s"
        cursor.execute(query, (user_id,))
        row = cursor.fetchone()
        cursor.close()
        conn.close()

        if row:
            return jsonify(row)
        else:
            return jsonify({"message": "User not found"}), 404
    except Exception as e:
        print("error -- ", {"error": str(e)})
        return jsonify({"error": str(e)}), 500


@app.route("/delete_account", methods=["DELETE"])
@require_jwt
def delete_account():
    user_id = request.user_id
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        query = "DELETE from user where user_id = %s"
        cursor.execute(query, (user_id,))
        conn.commit()  # important!
        cursor.close()
        conn.close()

        return jsonify({"message": "Account Successfully Deleted!"}), 200

    except Exception as e:
        print("error -- ", {"error": str(e)})
        return jsonify({"error": "Internal server error"}), 500


@app.route("/change_email", methods=["PUT"])
@require_jwt
def change_email():
    user_id = request.user_id

    # Get email from JSON body (NOT headers!)
    data = request.get_json()
    new_email = data.get("email")
    if not new_email:
        return jsonify({"message": "Missing email"}), 400
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        query = "UPDATE user SET email = %s WHERE user_id = %s"
        cursor.execute(query, (new_email, user_id))
        conn.commit()  # important!
        cursor.close()
        conn.close()

        return jsonify({"message": "Email updated successfully!"}), 200

    except Exception as e:
        print("error -- ", {"error": str(e)})
        return jsonify({"error": "Internal server error"}), 500
    
@app.route("/change_password", methods=["PUT"])
@require_jwt
def change_password():
    user_id = request.user_id

    # Get password from JSON body
    data = request.get_json()
    password = data.get("password")
    if (len(password) > MAX_PASSWORD_LENGTH or len(password) < MIN_PASSWORD_LENGTH):
        return jsonify({"success": False, "error": f"Password length must be {MIN_PASSWORD_LENGTH}-{MAX_PASSWORD_LENGTH}"}), 400
    password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    password = password.decode('utf-8')
    if not password:
        return jsonify({"message": "Missing password"}), 400


    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        query = "UPDATE user SET password_hash = %s WHERE user_id = %s"
        cursor.execute(query, (password, user_id))
        conn.commit()  # important!
        cursor.close()
        conn.close()

        return jsonify({"message": "Password updated successfully!"}), 200

    except Exception as e:
        print("error -- ", {"error": str(e)})
        return jsonify({"error": "Internal server error"}), 500


@app.route("/api/joinable-games")
def get_joinable_games():
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("""
            SELECT G.game_id, G.type_name, G.name, G.creation_date, G.status, U.invite_code, U.is_public, COUNT(P.user_id) AS current_players
            FROM game as G
            JOIN unstarted_game as U on G.game_id = U.game_id
            JOIN game_type as T on G.type_name = T.type_name
            LEFT JOIN plays as P on P.game_id = g.game_id
            WHERE U.is_public = 1
            GROUP BY G.game_id, G.type_name, G.name, G.creation_date, G.status, 
                U.invite_code, U.is_public, T.max_players
            HAVING COUNT(P.user_id) < T.max_players;    
            """)
        rows = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify(rows)
    except Exception as e:
        print("error -- ", {"error": str(e)})
        return jsonify({"error": str(e)}), 500
    
@app.route("/api/current-games")
@require_jwt
def get_current_games():
    try:
        user_id = request.user_id
        
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("""
            SELECT g.game_id, g.name, g.type_name, g.creation_date
            FROM Plays p
            JOIN User u ON p.user_id = u.user_id
            JOIN Game g ON p.game_id = g.game_id
            WHERE g.status = 'Ongoing' AND p.user_id = %s;
            """, (user_id,))
        rows = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify(rows)
    except Exception as e:
        print("error -- ", {"error": str(e)})
        return jsonify({"error": str(e)}), 500

@app.route("/api/leaderboard/<type_name>")
def get_leaderboard(type_name):
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("""
            SELECT username, wins, losses
            FROM User u
            JOIN Has_Stats_For h ON u.user_id = h.user_id
            WHERE h.type_name = %s AND u.is_deleted IS FALSE
            ORDER BY h.wins DESC, h.losses ASC;
            """, (type_name,))
        rows = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify(rows)
    except Exception as e:
        print("error -- ", {"error": str(e)})
        return jsonify({"error": str(e)}), 500
    
@app.route("/api/account/total_stats", methods=["GET"])
@require_jwt
def get_stats():
    user_id = request.user_id
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("""
            SELECT SUM(wins) AS total_wins, SUM(losses) AS total_losses, 
                       ROUND(SUM(wins) * 1.0/ (SUM(wins) + SUM(losses)) * 100, 2) AS total_winrate
            FROM has_stats_for
            WHERE user_id = %s;
            """, (user_id,))
        rows = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify(rows)
    except Exception as e:
        print("error -- ", {"error": str(e)})
        return jsonify({"error": str(e)}), 500

@app.route("/api/account/game_stats", methods=["GET"])
@require_jwt
def get_specific_stats():
    user_id = request.user_id
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("""
            SELECT type_name, wins, losses,
                       ROUND(wins * 1.0/ (wins + losses) * 100, 2) AS winrate
            FROM has_stats_for
            WHERE user_id = %s;
            """, (user_id,))
        rows = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify(rows)
    except Exception as e:
        print("error -- ", {"error": str(e)})
        return jsonify({"error": str(e)}), 500


def get_db_connection():
    # Mysql information (change to match your database)
    return mysql.connector.connect(
        **db_config
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
        cursor.execute("SELECT user_id, password_hash FROM user WHERE username = %s", (username,))        
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
            "INSERT INTO user (username, email, password_hash) VALUES (%s, %s, %s)",
            (username, email, password)
        )
        conn.commit()
        # Return the auto-incremented id
        return jsonify({"message": "User successfully created!"})
    except mysql.connector.Error as err:
        print("Error:", err)
        return jsonify({"success": False, "error": "Username or email address already taken"}), 400
    finally:
        cursor.close()
        conn.close()


# Run app.
if __name__ == "__main__":
    app.run(debug=True)



