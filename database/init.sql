-- To fully reset a table:   TRUNCATE TABLE <name_of_table>;
-- To view the whole table:  SELECT * FROM <name_of_table>;


-- Create the database (schema) if it doesn't already exist.
CREATE SCHEMA IF NOT EXISTS `dbgame` DEFAULT CHARACTER SET utf8mb4;

-- Tell MySQL to use this new database for the next commands.
USE `dbgame`;

-- Table `Users`
-- This structure is based on your /sign_up and /log_in routes.
CREATE TABLE IF NOT EXISTS `Users` (
  `user_id` INT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(50) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  
  PRIMARY KEY (`user_id`),
  UNIQUE INDEX `username_UNIQUE` (`username` ASC),
  UNIQUE INDEX `email_UNIQUE` (`email` ASC)
);


-- Table `GameType`
-- Holds the different types of games that can be played.

CREATE TABLE IF NOT EXISTS `GameType` (
  `typeName` VARCHAR(50) NOT NULL,
  `maxPlayers` INT NOT NULL,
  `minPlayers` INT NOT NULL,
  PRIMARY KEY (`typeName`)
);


-- Table `Game`
-- The central table for all game instances.

CREATE TABLE IF NOT EXISTS `Game` (
  `gameID` INT NOT NULL AUTO_INCREMENT,
  `typeName` VARCHAR(50) NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `creationDate` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `startDate` DATETIME NULL,
  `countsTowardsLeaderboard` BOOLEAN NOT NULL DEFAULT TRUE,
  `status` ENUM('Unstarted', 'Ongoing', 'Finished') NOT NULL DEFAULT 'Unstarted',
  PRIMARY KEY (`gameID`),
  FOREIGN KEY (`typeName`) REFERENCES `GameType` (`typeName`)
);

SELECT * FROM Users;


-- Table `UnstartedGame`
-- Stores extra details for games that have not yet started.
-- This is a one-to-one relationship with a `Game`.

CREATE TABLE IF NOT EXISTS `UnstartedGame` (
  `gameID` INT NOT NULL,
  `inviteCode` VARCHAR(10) UNIQUE,
  `isPublic` BOOLEAN NOT NULL DEFAULT TRUE,
  PRIMARY KEY (`gameID`),
  FOREIGN KEY (`gameID`) REFERENCES `Game` (`gameID`) ON DELETE CASCADE
);


-- Table `OngoingGame`
-- Stores state information for games currently in progress.
-- This is a one-to-one relationship with a `Game`.

CREATE TABLE IF NOT EXISTS `OngoingGame` (
  `gameID` INT NOT NULL,
  `publicInfo` JSON NULL,
  `state` JSON NULL,
  `locationURL` VARCHAR(255) NULL,
  `turnEndDate` DATETIME NULL,
  PRIMARY KEY (`gameID`),
  FOREIGN KEY (`gameID`) REFERENCES `Game` (`gameID`) ON DELETE CASCADE
);


-- Table `FinishedGame`
-- Stores results and metadata for completed games.
-- This is a one-to-one relationship with a `Game`.

CREATE TABLE IF NOT EXISTS `FinishedGame` (
  `gameID` INT NOT NULL,
  `finishDate` DATETIME NOT NULL,
  `endedEarly` BOOLEAN NOT NULL DEFAULT FALSE,
  `results` JSON NULL,
  PRIMARY KEY (`gameID`),
  FOREIGN KEY (`gameID`) REFERENCES `Game` (`gameID`) ON DELETE CASCADE
);


-- Table `Plays` (Relationship Table)
-- Connects users to the games they are in (a many-to-many relationship).
-- The primary key is a combination of userID and gameID.

CREATE TABLE IF NOT EXISTS `Plays` (
  `userID` INT NOT NULL,
  `gameID` INT NOT NULL,
  `resigned` BOOLEAN NOT NULL DEFAULT FALSE,
  `privateInfo` JSON NULL,
  `score` INT NOT NULL DEFAULT 0,
  `rank` INT NULL,
  PRIMARY KEY (`userID`, `gameID`),
  FOREIGN KEY (`userID`) REFERENCES `Users` (`user_id`) ON DELETE CASCADE,
  FOREIGN KEY (`gameID`) REFERENCES `Game` (`gameID`) ON DELETE CASCADE
);


-- Table `HasStatsFor` (Relationship Table)
-- Connects users to game types to track overall stats.

CREATE TABLE IF NOT EXISTS `HasStatsFor` (
  `userID` INT NOT NULL,
  `typeName` VARCHAR(50) NOT NULL,
  `wins` INT NOT NULL DEFAULT 0,
  `losses` INT NOT NULL DEFAULT 0,
  PRIMARY KEY (`userID`, `typeName`),
  FOREIGN KEY (`userID`) REFERENCES `Users` (`user_id`) ON DELETE CASCADE,
  FOREIGN KEY (`typeName`) REFERENCES `GameType` (`typeName`) ON DELETE CASCADE
);







