-- Select your database first
USE dbgame;

-- -----------------------------------------------------------
-- 1. Populate Users
-- We add three users: 'alice', 'bob', and 'charlie'.
-- The rest of the script will assume they get auto-incremented
-- IDs of 1, 2, and 3, respectively.
-- (Note: These are just dummy bcrypt hashes, not secure!)
INSERT INTO User (username, email, password_hash) VALUES
('alice', 'alice@example.com', '$2b$12$D.Uu9x/eA5GCls2N1.O2L.X1Qc/5PQgJ5fXgqN.wG/N.zI8f7gXyK'),
('bob', 'bob@example.com', '$2b$12$hP4.G2oUu0KkE5.d8P/J..Gv1Qf.uVl.O0/v.G0k3j.s5.s0k3m3Jk'),
('charlie', 'charlie@example.com', '$2b$12$wE.S.qK/E.a/z.y1x8E.O.uVw.g5s1K/e.B.e2y6s8.s0v1p3'),
('willy', 'willy@example.com', '$2b$12$GyFSyCG/rykuPFb/gerz0.TeRZZbnJjW7/dlMIiPOBls8Qu0vWRf.'),
('david', 'david@example.com', '$2b$12$fytI8DrTHmphE/M0Bl/T5.NjOeHng3WTVyHqWjDr9S02X1mGb56Ca');
-- Alice is user_id 1
-- Bob is user_id 2
-- Charlie is user_id 3

-- -----------------------------------------------------------
-- 2. Populate GameType (Lookup Table)
INSERT INTO Game_Type (type_name, max_players, min_players) VALUES
('TicTacToe', 2, 2),
('Checkers', 2, 2),
('Uno', 4, 2),
('War', 8, 4),
('Blackjack', 4, 2),
('RoShamBo', 4, 2);

-- -----------------------------------------------------------
-- 3. Scenario 1: A Finished Tic-Tac-Toe Game (Game 1)

-- First, create the main entry in the `Game` table.
INSERT INTO Game (game_id, type_name, `name`, creation_date, start_date, `status`)
VALUES (1, 'TicTacToe', 'Classic TTT Match', '2025-11-10 09:00:00', '2025-11-10 09:01:00', 'Finished');

-- Now, add the specific 'FinishedGame' details.
-- We use JSON for the results.
INSERT INTO Finished_Game (game_id, finish_date, ended_early, results)
VALUES (1, '2025-11-10 09:05:00', 0, '{"winner_id": 1, "board": ["X","O","X","O","X","O","X","",""]}');

-- Finally, link the players ('alice' (1) and 'bob' (2)) to the game.
INSERT INTO Plays (user_id, game_id, resigned, score, `rank`)
VALUES
(1, 1, 0, 100, 1), -- Alice (Winner)
(2, 1, 0, 0, 2);   -- Bob (Loser)

-- -----------------------------------------------------------
-- 4. Scenario 2: An Ongoing Checkers Game (Game 2)

-- Create the main `Game` entry.
INSERT INTO Game (game_id, type_name, `name`, creation_date, start_date, `status`)
VALUES (2, 'Checkers', 'Intense Checkers', '2025-11-11 10:00:00', '2025-11-11 10:01:00', 'Ongoing');

-- Add the 'OngoingGame' details, including a sample JSON game state.
INSERT INTO Ongoing_Game (game_id, state, turn_end_date)
VALUES (2, '{"board": "r...r...r....etc", "turn": 3, "lastMove": "c3-d4"}', '2025-11-12 10:00:00');

-- Link the players ('charlie' (3) and 'bob' (2)) to the game.
INSERT INTO Plays (user_id, game_id)
VALUES
(3, 2), -- Charlie
(2, 2); -- Bob

-- -----------------------------------------------------------
-- 5. Scenario 3: An Unstarted Public Uno Game (Game 3)

-- Create the main `Game` entry.
INSERT INTO Game (game_id, type_name, `name`, creation_date, `status`)
VALUES (3, 'Uno', 'Public Uno Lobby - Join!', '2025-11-11 12:00:00', 'Unstarted');

-- Add the 'UnstartedGame' details.
INSERT INTO Unstarted_Game (game_id, invite_code, is_public)
VALUES (3, 'UNO123', 1); -- 1 = true

-- Link the creator ('alice' (1)) to the game.
INSERT INTO Plays (user_id, game_id)
VALUES (1, 3);

-- -----------------------------------------------------------
-- 6. Scenario 4: An Unstarted Private TTT Game (Game 4)

-- Create the main `Game` entry.
INSERT INTO Game (game_id, type_name, `name`, creation_date, `status`)
VALUES (4, 'TicTacToe', 'Charlies Private Game', '2025-11-11 12:30:00', 'Unstarted');

-- Add the 'UnstartedGame' details.
INSERT INTO Unstarted_Game (game_id, invite_code, is_public)
VALUES (4, 'SECRET', 0); -- 0 = false

-- Link the creator ('charlie' (3)) to the game.
INSERT INTO Plays (user_id, game_id)
VALUES (3, 4);

-- -----------------------------------------------------------
-- 7. Scenario 5: Finished Blackjack Game (Game 5)
INSERT INTO Game (game_id, type_name, `name`, creation_date, start_date, `status`)
VALUES (5, 'Blackjack', 'Lucky Blackjack Table', '2025-11-09 21:00:00', '2025-11-09 21:05:00', 'Finished');

INSERT INTO Finished_Game (game_id, finish_date, ended_early, results)
VALUES (5, '2025-11-09 21:20:00', 0, '{"winner_id": 4, "scores": {"willy": 21, "bob": 19, "charlie": 18}}');

INSERT INTO Plays (user_id, game_id, resigned, score, `rank`) VALUES
(4, 5, 0, 21, 1),  -- Willy (Winner)
(2, 5, 0, 19, 2),  -- Bob
(3, 5, 0, 18, 3);  -- Charlie

-- -----------------------------------------------------------
-- 8. Scenario 6: Ongoing RoShamBo Game (Game 6)
INSERT INTO Game (game_id, type_name, `name`, creation_date, start_date, `status`)
VALUES (6, 'RoShamBo', 'Best of 5 Battle', '2025-11-11 09:00:00', '2025-11-11 09:02:00', 'Ongoing');

INSERT INTO Ongoing_Game (game_id, state, turn_end_date)
VALUES (6, '{"round": 3, "choices": {"alice": "rock", "david": "scissors"}, "score": {"alice": 2, "david": 0}}', '2025-11-11 09:10:00');

INSERT INTO Plays (user_id, game_id)
VALUES
(1, 6),
(5, 6);

-- -----------------------------------------------------------
-- 9. Scenario 7: Unstarted War Game (Game 7)
INSERT INTO Game (game_id, type_name, `name`, creation_date, `status`)
VALUES (7, 'War', 'Weekend War', '2025-11-08 10:00:00', 'Unstarted');

INSERT INTO Unstarted_Game (game_id, invite_code, is_public)
VALUES (7, 'WARZONE', 1);

INSERT INTO Plays (user_id, game_id) VALUES
(1, 7),
(2, 7),
(3, 7),
(4, 7),
(5, 7);

-- -----------------------------------------------------------
-- 10. Scenario 8: Finished Checkers Game (Game 8)
INSERT INTO Game (game_id, type_name, `name`, creation_date, start_date, `status`)
VALUES (8, 'Checkers', 'Bob vs David', '2025-11-05 13:00:00', '2025-11-05 13:02:00', 'Finished');

INSERT INTO Finished_Game (game_id, finish_date, ended_early, results)
VALUES (8, '2025-11-05 13:45:00', 0, '{"winner_id": 5, "moves": 42}');

INSERT INTO Plays (user_id, game_id, resigned, score, `rank`) VALUES
(2, 8, 0, 70, 2),
(5, 8, 0, 100, 1);

-- -----------------------------------------------------------
-- 11. Scenario 9: Ongoing Uno Game (Game 9)
INSERT INTO Game (game_id, type_name, `name`, creation_date, start_date, `status`)
VALUES (9, 'Uno', 'Family Uno Night', '2025-11-10 19:00:00', '2025-11-10 19:02:00', 'Ongoing');

INSERT INTO Ongoing_Game (game_id, state, turn_end_date)
VALUES (9, '{"deckSize": 45, "turn": 2, "lastCard": "Red 7"}', '2025-11-10 19:30:00');

INSERT INTO Plays (user_id, game_id)
VALUES
(1, 9),
(2, 9),
(4, 9),
(5, 9);

-- -----------------------------------------------------------
-- 12. Scenario 10: Unstarted Checkers Game (Game 10)
INSERT INTO Game (game_id, type_name, `name`, creation_date, `status`)
VALUES (10, 'Checkers', 'David’s Private Match', '2025-11-12 08:00:00', 'Unstarted');

INSERT INTO Unstarted_Game (game_id, invite_code, is_public)
VALUES (10, 'CHKPRV', 0);

INSERT INTO Plays (user_id, game_id)
VALUES (5, 10);

-- -----------------------------------------------------------
-- 12. Scenario 11: Finished TicTacToe Game (Game 11)
INSERT INTO Game (game_id, type_name, `name`, creation_date, start_date, `status`)
VALUES (11, 'TicTacToe', 'Bob vs Willy', '2025-11-09 14:00:00', '2025-11-09 14:01:00', 'Finished');

INSERT INTO Finished_Game (game_id, finish_date, ended_early, results)
VALUES (11, '2025-11-09 14:05:00', 0, '{"winner_id": 2, "board": ["O","O","O","X","X","","","",""]}');

INSERT INTO Plays (user_id, game_id, resigned, score, `rank`)
VALUES
(2, 11, 0, 100, 1),
(4, 11, 0, 0, 2);

-- -----------------------------------------------------------
-- 13. Scenario 12: Ongoing War Game (Game 12)
INSERT INTO Game (game_id, type_name, `name`, creation_date, start_date, `status`)
VALUES (12, 'War', 'Massive War', '2025-11-10 10:00:00', '2025-11-10 10:10:00', 'Ongoing');

INSERT INTO Ongoing_Game (game_id, state, turn_end_date)
VALUES (12, '{"phase": "battle", "round": 4}', '2025-11-11 10:00:00');

INSERT INTO Plays (user_id, game_id)
VALUES
(1, 12),
(2, 12),
(3, 12),
(5, 12);

-- -----------------------------------------------------------
-- 14. Scenario 13: Finished RoShamBo Game (Game 13)
INSERT INTO Game (game_id, type_name, `name`, creation_date, start_date, `status`)
VALUES (13, 'RoShamBo', 'Final Clash', '2025-11-08 18:00:00', '2025-11-08 18:01:00', 'Finished');

INSERT INTO Finished_Game (game_id, finish_date, ended_early, results)
VALUES (13, '2025-11-08 18:05:00', 0, '{"winner_id": 3, "rounds": [{"alice":"rock","charlie":"paper"}]}');

INSERT INTO Plays (user_id, game_id, resigned, score, `rank`)
VALUES
(1, 13, 0, 0, 2),
(3, 13, 0, 1, 1);

-- -----------------------------------------------------------
-- 14. Scenario 13: Finished Blackjack Game (Game 14)
INSERT INTO Game (game_id, type_name, `name`, creation_date, start_date, `status`)
VALUES (14, 'Blackjack', 'High Stakes Table', '2025-11-11 21:00:00', '2025-11-11 21:05:00', 'Finished');

INSERT INTO Finished_Game (game_id, finish_date, ended_early, results)
VALUES (14, '2025-11-11 21:25:00', 0, '{"winner_id": 4, "scores": {"willy": 21, "alice": 18, "david": 19}}');

INSERT INTO Plays (user_id, game_id, resigned, score, `rank`) VALUES
(4, 14, 0, 21, 1),
(1, 14, 0, 18, 3),
(5, 14, 0, 19, 2);

-- -----------------------------------------------------------
-- 15. Scenario 14: Finished Blackjack Game (Game 15)
INSERT INTO Game (game_id, type_name, `name`, creation_date, start_date, `status`)
VALUES (15, 'Blackjack', 'Midweek Blackjack Clash', '2025-11-12 20:00:00', '2025-11-12 20:05:00', 'Ongoing');

INSERT INTO Ongoing_Game (game_id, state, turn_end_date)
VALUES (15, '{"round": 2, "hands": {"willy": ["10♠","A♥"], "charlie": ["K♦","7♣"]}, "dealerShowing": "Q♣"}', '2025-11-12 20:15:00');

INSERT INTO Plays (user_id, game_id)
VALUES
(4, 15), -- Willy
(3, 15); -- Charlie

-- -----------------------------------------------------------
-- 16. Scenario 15: Finished Blackjack Game (Game 16)
INSERT INTO Game (game_id, type_name, `name`, creation_date, `status`)
VALUES (16, 'Uno', 'Casual Uno Lobby', '2025-11-13 09:00:00', 'Unstarted');

INSERT INTO Unstarted_Game (game_id, invite_code, is_public)
VALUES (16, 'UNOLOBBY', 1);

INSERT INTO Plays (user_id, game_id)
VALUES
(1, 16), -- Alice (host)
(2, 16), -- Bob
(3, 16), -- Charlie
(4, 16), -- Willy
(5, 16); -- David

-- -----------------------------------------------------------
-- 17. Populate HasStatsFor (Leaderboard Stats)
-- Based on the finished game (Scenario 1), we give Alice 1 win
-- and Bob 1 loss for TicTacToe. We'll add some other random stats.
INSERT INTO Has_Stats_For (user_id, type_name, wins, losses)
VALUES
(1, 'TicTacToe', 1, 0), -- Alice's win from Game 1
(1, 'Uno', 5, 2),        -- Alice also plays Uno
(2, 'TicTacToe', 0, 1), -- Bob's loss from Game 1
(2, 'Checkers', 10, 3),   -- Bob is a good Checkers player
(3, 'Checkers', 8, 8),   -- Charlie is average at Checkers
(4, 'RoShamBo', 1, 0),   -- Willy played 1 game of RoShamBo
(3, 'TicTacToe', 1, 1),
(4, 'TicTacToe', 1, 1),
(4, 'Checkers', 0, 7),
(5, 'Uno', 10, 1),
(3, 'Uno', 8, 2),
(1, 'War', 1, 2),
(2, 'War', 2, 4),
(3, 'War', 4, 0),  
(4, 'Blackjack', 5, 6),  
(5, 'Blackjack', 3, 1),  
(1, 'Blackjack', 2, 9),  
(2, 'Blackjack', 0, 2),  
(1, 'RoShamBo', 17, 13),  
(2, 'RoShamBo', 10, 14),  
(3, 'RoShamBo', 3, 9),  
(5, 'RoShamBo', 10, 10);