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

def get_db_connection():
    return mysql.connector.connect(**db_config)

def query_db(query_template: str, params: list[any] | dict[str, any] = []):
    with get_db_connection() as conn:
        with conn.cursor(dictionary=True) as cursor:
            cursor.execute(query_template, params)
            rows = cursor.fetchall()
    return rows

@app.route("/api/update-stats", methods=["POST"])
@require_jwt
def update_stats():
    """
    Update the Has_Stats_For table for the logged-in user.
    Expects JSON body: { "type_name": str, "result": "win"|"loss" }
    """
    user_id = request.user_id
    data = request.get_json()

    type_name = data.get("type_name")
    result = data.get("result")

    if not type_name or result not in ("win", "loss"):
        return jsonify({"message": "Missing or invalid type_name/result"}), 400

    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        # Check if entry exists
        cursor.execute("""
            SELECT wins, losses
            FROM Has_Stats_For
            WHERE user_id = %s AND type_name = %s
        """, (user_id, type_name))
        row = cursor.fetchone()

        if row:
            # Update existing row
            if result == "win":
                cursor.execute("""
                    UPDATE Has_Stats_For
                    SET wins = wins + 1
                    WHERE user_id = %s AND type_name = %s
                """, (user_id, type_name))
            else:
                cursor.execute("""
                    UPDATE Has_Stats_For
                    SET losses = losses + 1
                    WHERE user_id = %s AND type_name = %s
                """, (user_id, type_name))
        else:
            # Insert new row if it doesn't exist
            wins = 1 if result == "win" else 0
            losses = 1 if result == "loss" else 0
            cursor.execute("""
                INSERT INTO Has_Stats_For (user_id, type_name, wins, losses)
                VALUES (%s, %s, %s, %s)
            """, (user_id, type_name, wins, losses))

        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({"message": "Stats updated successfully"}), 200

    except Exception as e:
        print("Error updating stats:", e)
        return jsonify({"message": "Server error updating stats", "error": str(e)}), 500


@app.route("/api/joinable-games")
def get_joinable_games():
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        '''cursor.execute("""
            SELECT G.game_id, G.type_name, G.name, G.creation_date, G.status, U.invite_code, U.is_public, COUNT(P.user_id) AS current_players
            FROM game as G
            JOIN unstarted_game as U on G.game_id = U.game_id
            JOIN game_type as T on G.type_name = T.type_name
            LEFT JOIN plays as P on P.game_id = g.game_id
            WHERE U.is_public = 1
            GROUP BY G.game_id, G.type_name, G.name, G.creation_date, G.status, 
                U.invite_code, U.is_public, T.max_players
            HAVING COUNT(P.user_id) < T.max_players;    
            """)'''
        cursor.execute("""
            SELECT G.game_id, G.type_name, G.name, G.creation_date, G.status, U.invite_code, U.is_public
            FROM game AS G
            JOIN unstarted_game AS U ON G.game_id = U.game_id
        """)
        results = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify(results), 200
    except Exception as e:
        print("error at endpoint /api/joinable-games --", e)
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

@app.route("/api/game/<int:id>")
def get_game(id: int):
    try:
        value = query_db(
            """
            SELECT * FROM Game WHERE game_id = %s
            """, [id])
        if len(value) == 0:
            return "not found", 404
        else:
            return jsonify(value[0]), 200
    except Exception as e:
        print(f"error at endpoint /api/game-<int:id> with id={id} --", e)
        return jsonify({"error": str(e)}), 500

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
    
@app.route("/api/game-types", methods=["GET"])
@require_jwt
def get_game_types():
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("""
            SELECT type_name, min_players, max_players
            FROM Game_Type;
        """)
        rows = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify(rows)
    except Exception as e:
        print("error -- ", {"error": str(e)})
        return jsonify({"error": str(e)}), 500

@app.route("/api/create-game", methods=["POST"])
@require_jwt
def create_game():
    user_id = request.user_id

    data = request.get_json()
    type_name = data.get("type_name")
    name = data.get("name")
    start_date = data.get("start_date")
    is_public = data.get("is_public")
    player_count = data.get("player_count")
    invite_code = data.get("invite_code", "").strip()

    if invite_code == "":
        is_public = True
    else:
        is_public = False

    if not type_name or not name or not start_date:
        return jsonify({"message": "Missing fields"}), 400

    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        #Game table 
        cursor.execute("""
            INSERT INTO Game (type_name, name, creation_date, start_date, status)
            VALUES (%s, %s, NOW(), %s, 'Unstarted');
        """, (type_name, name, start_date))
        game_id = cursor.lastrowid

        #Plays table
        cursor.execute("""
            INSERT INTO Plays (user_id, game_id, resigned, score, `rank`)
            VALUES (%s, %s, 0, 0, NULL);
        """, (user_id, game_id))

        #Unstarted_Game table
        cursor.execute("""
            INSERT INTO Unstarted_Game (game_id, invite_code, is_public)
            VALUES (%s, %s, %s);
        """, (game_id, invite_code, is_public))

        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({
            "message": "Game created",
            "game_id": game_id,
            "invite_code": invite_code
        })

    except Exception as e:
        print("Error creating game:", e)
        return jsonify({"message": "Server error creating game", "error": str(e)}), 500

@app.route("/api/join-game", methods=["POST"])
@require_jwt
def join_game():
    user_id = request.user_id

    data = request.get_json()
    invite_code = data.get("invite_code", "").strip()

    if invite_code == "":
        return jsonify({"message": "Invite code is required"}), 400

    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        #Find matching invite code
        cursor.execute("""
            SELECT g.game_id, g.type_name
            FROM Unstarted_Game u
            JOIN Game g ON g.game_id = u.game_id
            WHERE u.invite_code = %s
              AND g.status = 'Unstarted';
        """, (invite_code,))
        game = cursor.fetchone()

        if not game:
            return jsonify({"message": "Invalid invite code or game already started"}), 404

        game_id = game["game_id"]
        type_name = game["type_name"]

        #Check if user is already in the game
        cursor.execute("""
            SELECT 1
            FROM Plays
            WHERE user_id = %s AND game_id = %s;
        """, (user_id, game_id))

        if cursor.fetchone():
            return jsonify({"message": "You are already in this game"}), 400

        # Get max players
        cursor.execute("""
            SELECT max_players
            FROM Game_Type
            WHERE type_name = %s;
        """, (type_name,))
        row = cursor.fetchone()

        if not row:
            return jsonify({"message": "Game type not found"}), 500

        max_players = row["max_players"]

        #Count current players (using COUNT(user_id))
        cursor.execute("""
            SELECT COUNT(user_id) AS player_count
            FROM Plays
            WHERE game_id = %s;
        """, (game_id,))
        player_count = cursor.fetchone()["player_count"]

        if player_count >= max_players:
            return jsonify({"message": "This game is already full"}), 400

        #Add player to the game
        cursor.execute("""
            INSERT INTO Plays (user_id, game_id, resigned, score, `rank`)
            VALUES (%s, %s, 0, 0, NULL);
        """, (user_id, game_id))

        conn.commit()

        return jsonify({
            "message": "Joined game",
            "game_id": game_id
        })

    except Exception as e:
        print("Error joining game:", e)
        return jsonify({"message": "Server error joining game", "error": str(e)}), 500

    finally:
        try:
            cursor.close()
            conn.close()
        except:
            pass

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



