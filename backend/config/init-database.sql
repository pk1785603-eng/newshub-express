-- ========================================
-- 24x7 News Time Database Schema
-- Run this SQL in Hostinger phpMyAdmin
-- ========================================

-- Categories Table
CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    icon VARCHAR(50) DEFAULT 'Newspaper',
    color VARCHAR(20) DEFAULT '#DC2626',
    post_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Authors Table
CREATE TABLE IF NOT EXISTS authors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE,
    avatar VARCHAR(500),
    bio TEXT,
    role VARCHAR(50) DEFAULT 'Journalist',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Posts/News Table
CREATE TABLE IF NOT EXISTS posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    slug VARCHAR(500) UNIQUE NOT NULL,
    excerpt TEXT,
    content LONGTEXT,
    featured_image VARCHAR(500),
    category_id INT,
    author_id INT,
    tags JSON,
    keywords JSON,
    youtube_id VARCHAR(50),
    is_featured BOOLEAN DEFAULT FALSE,
    is_published BOOLEAN DEFAULT TRUE,
    views INT DEFAULT 0,
    publish_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
    FOREIGN KEY (author_id) REFERENCES authors(id) ON DELETE SET NULL,
    INDEX idx_category (category_id),
    INDEX idx_publish_date (publish_date),
    INDEX idx_featured (is_featured),
    FULLTEXT INDEX idx_search (title, excerpt, content)
);

-- YouTube Videos Table
CREATE TABLE IF NOT EXISTS youtube_videos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    video_id VARCHAR(50) NOT NULL,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    thumbnail VARCHAR(500),
    category VARCHAR(50) DEFAULT 'general',
    views VARCHAR(50) DEFAULT '0',
    is_live BOOLEAN DEFAULT FALSE,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Live Stream Settings Table
CREATE TABLE IF NOT EXISTS live_settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    channel_id VARCHAR(100),
    live_video_id VARCHAR(50),
    live_url VARCHAR(500),
    is_live BOOLEAN DEFAULT FALSE,
    live_title VARCHAR(255) DEFAULT 'LIVE NOW: 24x7 News Time',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Site Settings Table
CREATE TABLE IF NOT EXISTS site_settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert Default Categories
INSERT INTO categories (name, slug, description, icon, color) VALUES
('National', 'national', 'National news from across India', 'Flag', '#DC2626'),
('International', 'international', 'World news and global events', 'Globe', '#2563EB'),
('Local (UP/Ghaziabad)', 'local-up', 'Local news from Uttar Pradesh and Ghaziabad', 'MapPin', '#F59E0B'),
('Politics', 'politics', 'Political news and updates', 'Building', '#7C3AED'),
('Sports', 'sports', 'Sports news and match updates', 'Trophy', '#10B981'),
('Entertainment', 'entertainment', 'Bollywood, movies, and entertainment', 'Film', '#EC4899'),
('Technology', 'technology', 'Tech news and gadget reviews', 'Smartphone', '#3B82F6'),
('Business', 'business', 'Business and economy news', 'TrendingUp', '#F97316'),
('Blogs', 'blogs', 'Opinion pieces and blog articles', 'PenTool', '#6366F1')
ON DUPLICATE KEY UPDATE name=name;

-- Insert Default Author
INSERT INTO authors (name, email, avatar, bio, role) VALUES
('24x7 News Desk', 'news@24x7newstime.in', '/placeholder.svg', 'Official news desk of 24x7 News Time', 'Editor')
ON DUPLICATE KEY UPDATE name=name;

-- Insert Default Live Settings
INSERT INTO live_settings (id, channel_id, live_video_id, is_live, live_title) VALUES
(1, '', '', FALSE, 'LIVE NOW: 24x7 News Time')
ON DUPLICATE KEY UPDATE id=id;
