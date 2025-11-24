
-- Create the database (schema) if it doesn't already exist.
CREATE SCHEMA IF NOT EXISTS `dbgame` DEFAULT CHARACTER SET utf8mb4;

-- Tell MySQL to use this new database for the next commands.
USE `dbgame`;

-- Table `User`
-- This structure is based on your /sign_up and /log_in routes.
CREATE TABLE IF NOT EXISTS `User` (
  `user_id` INT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(50) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `privileges` INT NOT NULL DEFAULT 0,
  `is_deleted` BOOLEAN NOT NULL DEFAULT FALSE,
  
  PRIMARY KEY (`user_id`),
  UNIQUE INDEX `username_UNIQUE` (`username` ASC),
  UNIQUE INDEX `email_UNIQUE` (`email` ASC)
);


-- Table `Game_Type`
-- Holds the different types of games that can be played.

CREATE TABLE IF NOT EXISTS `Game_Type` (
  `type_name` VARCHAR(50) NOT NULL,
  `max_players` INT NOT NULL,
  `min_players` INT NOT NULL,
  PRIMARY KEY (`type_name`)
);


-- Table `Game`
-- The central table for all game instances.

CREATE TABLE IF NOT EXISTS `Game` (
  `game_id` INT NOT NULL AUTO_INCREMENT,
  `type_name` VARCHAR(50) NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `creation_date` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `start_date` DATETIME NULL,
  `counts_towards_leaderboard` BOOLEAN NOT NULL DEFAULT TRUE,
  `status` ENUM('Unstarted', 'Ongoing', 'Finished') NOT NULL DEFAULT 'Unstarted',
  PRIMARY KEY (`game_id`),
  FOREIGN KEY (`type_name`) REFERENCES `Game_Type` (`type_name`)
);

SELECT * FROM User;


-- Table `Unstarted_Game`
-- Stores extra details for games that have not yet started.
-- This is a one-to-one relationship with a `Game`.

CREATE TABLE IF NOT EXISTS `Unstarted_Game` (
  `game_id` INT NOT NULL,
  `invite_code` VARCHAR(10) UNIQUE,
  `is_public` BOOLEAN NOT NULL DEFAULT TRUE,
  PRIMARY KEY (`game_id`),
  FOREIGN KEY (`game_id`) REFERENCES `Game` (`game_id`) ON DELETE CASCADE
);


-- Table `Ongoing_Game`
-- Stores state information for games currently in progress.
-- This is a one-to-one relationship with a `Game`.

CREATE TABLE IF NOT EXISTS `Ongoing_Game` (
  `game_id` INT NOT NULL,
  `public_info` JSON NULL,
  `state` JSON NULL,
  `location_url` VARCHAR(255) NULL,
  `turn_end_date` DATETIME NULL,
  PRIMARY KEY (`game_id`),
  FOREIGN KEY (`game_id`) REFERENCES `Game` (`game_id`) ON DELETE CASCADE
);


-- Table `Finished_Game`
-- Stores results and metadata for completed games.
-- This is a one-to-one relationship with a `Game`.

CREATE TABLE IF NOT EXISTS `Finished_Game` (
  `game_id` INT NOT NULL,
  `finish_date` DATETIME NOT NULL,
  `ended_early` BOOLEAN NOT NULL DEFAULT FALSE,
  `results` JSON NULL,
  PRIMARY KEY (`game_id`),
  FOREIGN KEY (`game_id`) REFERENCES `Game` (`game_id`) ON DELETE CASCADE
);


-- Table `Plays` (Relationship Table)
-- Connects users to the games they are in (a many-to-many relationship).
-- The primary key is a combination of userID and gameID.

CREATE TABLE IF NOT EXISTS `Plays` (
  `user_id` INT NOT NULL,
  `game_id` INT NOT NULL,
  `resigned` BOOLEAN NOT NULL DEFAULT FALSE,
  `private_info` JSON NULL,
  `score` INT NOT NULL DEFAULT 0,
  `rank` INT NULL,
  PRIMARY KEY (`user_id`, `game_id`),
  FOREIGN KEY (`user_id`) REFERENCES `User` (`user_id`) ON DELETE CASCADE,
  FOREIGN KEY (`game_id`) REFERENCES `Game` (`game_id`) ON DELETE CASCADE
);


-- Table `Has_Stats_For` (Relationship Table)
-- Connects users to game types to track overall stats.

CREATE TABLE IF NOT EXISTS `Has_Stats_For` (
  `user_id` INT NOT NULL,
  `type_name` VARCHAR(50) NOT NULL,
  `wins` INT NOT NULL DEFAULT 0,
  `losses` INT NOT NULL DEFAULT 0,
  PRIMARY KEY (`user_id`, `type_name`),
  FOREIGN KEY (`user_id`) REFERENCES `User` (`user_id`) ON DELETE CASCADE,
  FOREIGN KEY (`type_name`) REFERENCES `Game_Type` (`type_name`) ON DELETE CASCADE
);







