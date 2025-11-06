-- 1. Create the database (schema) if it doesn't already exist.
-- Your Python code connects to "dbgame".
CREATE SCHEMA IF NOT EXISTS `dbgame` DEFAULT CHARACTER SET utf8mb4;

-- 2. Tell MySQL to use this new database for the next commands.
USE `dbgame`;

-- 3. Create the "Users" table.
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

-- To view Table
SELECT * FROM Users;

-- Reset Table
TRUNCATE TABLE users;



