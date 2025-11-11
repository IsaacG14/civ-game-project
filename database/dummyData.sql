-- Select your database first
USE dbgame;

-- -----------------------------------------------------------
-- 1. Populate Users
-- We add three users: 'alice', 'bob', and 'charlie'.
-- The rest of the script will assume they get auto-incremented
-- IDs of 1, 2, and 3, respectively.
-- (Note: These are just dummy bcrypt hashes, not secure!)
INSERT INTO Users (username, email, password_hash) VALUES
('alice', 'alice@example.com', '$2b$12$D.Uu9x/eA5GCls2N1.O2L.X1Qc/5PQgJ5fXgqN.wG/N.zI8f7gXyK'),
('bob', 'bob@example.com', '$2b$12$hP4.G2oUu0KkE5.d8P/J..Gv1Qf.uVl.O0/v.G0k3j.s5.s0k3m3Jk'),
('charlie', 'charlie@example.com', '$2b$12$wE.S.qK/E.a/z.y1x8E.O.uVw.g5s1K/e.B.e2y6s8.s0v1p3'),
('admin', 'admin@example.com', '$2b$12$GyFSyCG/rykuPFb/gerz0.TeRZZbnJjW7/dlMIiPOBls8Qu0vWRf.'),
('david', 'david@example.com', '$2b$12$fytI8DrTHmphE/M0Bl/T5.NjOeHng3WTVyHqWjDr9S02X1mGb56Ca');
-- Alice is user_id 1
-- Bob is user_id 2
-- Charlie is user_id 3

-- -----------------------------------------------------------
-- 2. Populate GameType (Lookup Table)
INSERT INTO GameType (typeName, maxPlayers, minPlayers) VALUES
('TicTacToe', 2, 2),
('Checkers', 2, 2),
('Uno', 4, 2),
('War', 8, 4),
('Blackjack', 4, 2),
('RoShamBo', 4, 2);

-- -----------------------------------------------------------
-- 3. Scenario 1: A Finished Tic-Tac-Toe Game (Game 1)

-- First, create the main entry in the `Game` table.
INSERT INTO Game (gameID, typeName, name, creationDate, startDate, status)
VALUES (1, 'TicTacToe', 'Classic TTT Match', '2025-11-10 09:00:00', '2025-11-10 09:01:00', 'Finished');

-- Now, add the specific 'FinishedGame' details.
-- We use JSON for the results.
INSERT INTO FinishedGame (gameID, finishDate, endedEarly, results)
VALUES (1, '2025-11-10 09:05:00', 0, '{"winner_id": 1, "board": ["X","O","X","O","X","O","X","",""]}');

-- Finally, link the players ('alice' (1) and 'bob' (2)) to the game.
INSERT INTO Plays (userID, gameID, resigned, score, `rank`)
VALUES
(1, 1, 0, 100, 1), -- Alice (Winner)
(2, 1, 0, 0, 2);   -- Bob (Loser)

-- -----------------------------------------------------------
-- 4. Scenario 2: An Ongoing Checkers Game (Game 2)

-- Create the main `Game` entry.
INSERT INTO Game (gameID, typeName, name, creationDate, startDate, status)
VALUES (2, 'Checkers', 'Intense Checkers', '2025-11-11 10:00:00', '2025-11-11 10:01:00', 'Ongoing');

-- Add the 'OngoingGame' details, including a sample JSON game state.
INSERT INTO OngoingGame (gameID, state, turnEndDate)
VALUES (2, '{"board": "r...r...r....etc", "turn": 3, "lastMove": "c3-d4"}', '2025-11-12 10:00:00');

-- Link the players ('charlie' (3) and 'bob' (2)) to the game.
INSERT INTO Plays (userID, gameID)
VALUES
(3, 2), -- Charlie
(2, 2); -- Bob

-- -----------------------------------------------------------
-- 5. Scenario 3: An Unstarted Public Uno Game (Game 3)

-- Create the main `Game` entry.
INSERT INTO Game (gameID, typeName, name, creationDate, status)
VALUES (3, 'Uno', 'Public Uno Lobby - Join!', '2025-11-11 12:00:00', 'Unstarted');

-- Add the 'UnstartedGame' details.
INSERT INTO UnstartedGame (gameID, inviteCode, isPublic)
VALUES (3, 'UNO123', 1); -- 1 = true

-- Link the creator ('alice' (1)) to the game.
INSERT INTO Plays (userID, gameID)
VALUES (1, 3);

-- -----------------------------------------------------------
-- 6. Scenario 4: An Unstarted Private TTT Game (Game 4)

-- Create the main `Game` entry.
INSERT INTO Game (gameID, typeName, name, creationDate, status)
VALUES (4, 'TicTacToe', 'Charlies Private Game', '2025-11-11 12:30:00', 'Unstarted');

-- Add the 'UnstartedGame' details.
INSERT INTO UnstartedGame (gameID, inviteCode, isPublic)
VALUES (4, 'SECRET', 0); -- 0 = false

-- Link the creator ('charlie' (3)) to the game.
INSERT INTO Plays (userID, gameID)
VALUES (3, 4);

-- -----------------------------------------------------------
-- 7. Populate HasStatsFor (Leaderboard Stats)
-- Based on the finished game (Scenario 1), we give Alice 1 win
-- and Bob 1 loss for TicTacToe. We'll add some other random stats.
INSERT INTO HasStatsFor (userID, typeName, wins, losses)
VALUES
(1, 'TicTacToe', 1, 0), -- Alice's win from Game 1
(1, 'Uno', 5, 2),        -- Alice also plays Uno
(2, 'TicTacToe', 0, 1), -- Bob's loss from Game 1
(2, 'Checkers', 10, 3),   -- Bob is a good Checkers player
(3, 'Checkers', 8, 8);   -- Charlie is average at Checkers
