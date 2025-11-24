-- To fully reset a table:   TRUNCATE TABLE <name_of_table>;
-- To view the whole table:  SELECT * FROM <name_of_table>;
-- Reset Every Table: 
Use `dbgame`;

SET FOREIGN_KEY_CHECKS = 0;    
TRUNCATE TABLE finished_game;
TRUNCATE TABLE game;
TRUNCATE TABLE game_type;
TRUNCATE TABLE has_stats_for;
TRUNCATE TABLE ongoing_game;
TRUNCATE TABLE plays;
TRUNCATE TABLE unstarted_game;
TRUNCATE TABLE user;
SET FOREIGN_KEY_CHECKS = 1;

-- You can also use "DROP SCHEMA `dbgame`" to delete the entire database.
