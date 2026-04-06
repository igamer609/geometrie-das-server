CREATE DATABASE IF NOT EXISTS geometrie_das;
USE geometrie_das;

CREATE TABLE IF NOT EXISTS users (
    id              INT unsigned NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name            VARCHAR(32) UNIQUE NOT NULL,
    pass            VARCHAR(128) NOT NULL,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE IF NOT EXISTS levels (
    id INT unsigned NOT NULL AUTO_INCREMENT PRIMARY KEY,
    original_id INT NOT NULL DEFAULT -1,
    
    title VARCHAR(25) NOT NULL,
    description TEXT,
    author_id INT unsigned NOT NULL,
    author_name VARCHAR(32) NOT NULL,
    song_id INT DEFAULT 1,
    length FLOAT DEFAULT 1.0,
    version VARCHAR(20),                        
    
    level_data MEDIUMTEXT NOT NULL,
    
    downloads INT DEFAULT 0,
    likes INT DEFAULT 0,
    avg_rating FLOAT DEFAULT 0.0,
    rating_count INT DEFAULT 0,
    feature_level INT DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX (id),
    INDEX (title)
);