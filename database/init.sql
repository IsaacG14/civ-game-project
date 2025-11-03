-- mysql -u root -p < init.sql

CREATE DATABASE user_database;
USE user_database;
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

INSERT INTO users (username, password)
VALUES ('testuser', 'password123');

SHOW DATABASES;