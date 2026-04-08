CREATE DATABASE IF NOT EXISTS geometrie_das;
USE geometrie_das;

CREATE TABLE IF NOT EXISTS users (
    id              INT unsigned NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name            VARCHAR(32) UNIQUE NOT NULL,
    pass            VARCHAR(128) NOT NULL,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS levels (
    id              INT unsigned NOT NULL AUTO_INCREMENT PRIMARY KEY,
    original_id     INT NOT NULL DEFAULT -1,
    
    title           VARCHAR(25) NOT NULL,
    description     TEXT,
    author_id       INT unsigned DEFAULT NULL,
    author_name     VARCHAR(32) DEFAULT 'Player',
    song_id         INT DEFAULT 1,
    length          FLOAT DEFAULT 1.0,
    version         VARCHAR(20) NOT NULL,                        
    
    level_data      MEDIUMTEXT NOT NULL,
    
    downloads       INT DEFAULT 0,
    likes           INT DEFAULT 0,
    avg_rating      FLOAT DEFAULT 0.0,
    rating_count    INT DEFAULT 0,
    feature_level   INT DEFAULT 0,
    
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_updated    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    level_version   TINYINT unsigned DEFAULT 1,

    FOREIGN KEY (author_id) REFERENCES users (id) ON DELETE SET NULL,

    INDEX (id),
    INDEX (title)
);

CREATE TABLE IF NOT EXISTS level_ratings (
    id              INT unsigned NOT NULL AUTO_INCREMENT PRIMARY KEY,
    level_id        INT unsigned NOT NULL,
    user_id         INT unsigned NOT NULL,
    rating          INT NOT NULL,
    
    UNIQUE KEY unique_rating (level_id, user_id),
    FOREIGN KEY (level_id) REFERENCES levels (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS level_likes (
    id              INT unsigned NOT NULL AUTO_INCREMENT PRIMARY KEY,
    level_id        INT unsigned NOT NULL,
    user_id         INT unsigned NOT NULL,
    sign            TINYINT NOT NULL,
    
    UNIQUE KEY unique_like (level_id, user_id),
    FOREIGN KEY (level_id) REFERENCES levels (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS comments (
    id              INT unsigned NOT NULL AUTO_INCREMENT PRIMARY KEY,
    level_id        INT unsigned DEFAULT NULL,
    user_id         INT unsigned NOT NULL,
    scope           ENUM('level', 'user') NOT NULL,
    content         TEXT NOT NULL,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (level_id) REFERENCES levels (id) ON DELETE CASCADE
);