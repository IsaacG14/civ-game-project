-- To fully reset a table:   TRUNCATE TABLE <name_of_table>;
-- To view the whole table:  SELECT * FROM <name_of_table>;
-- Reset Every Table: 
Use `dbgame`;

SET FOREIGN_KEY_CHECKS = 0;    
TRUNCATE TABLE finishedgame;
TRUNCATE TABLE game;
TRUNCATE TABLE gametype;
TRUNCATE TABLE hasstatsfor;
TRUNCATE TABLE ongoinggame;
TRUNCATE TABLE plays;
TRUNCATE TABLE unstartedgame;
TRUNCATE TABLE users;
SET FOREIGN_KEY_CHECKS = 1;