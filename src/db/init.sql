-- -----------------------------------------------
-- Tables
-- -----------------------------------------------

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    description TEXT,
    image VARCHAR(255),
    category VARCHAR(50),
    sales INT DEFAULT 0,
    tags JSON,
    is_featured TINYINT(1) DEFAULT 0,
    is_bestseller TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- -----------------------------------------------
-- Views: Simplify Queries
-- -----------------------------------------------

DROP VIEW IF EXISTS featured_products;
CREATE VIEW featured_products AS
SELECT id, name, price, image, category, description, created_at
FROM products
WHERE is_featured = 1
ORDER BY created_at DESC;

DROP VIEW IF EXISTS bestseller_products;
CREATE VIEW bestseller_products AS
SELECT id, name, price, image, category, sales
FROM products
WHERE is_bestseller = 1
ORDER BY sales DESC
LIMIT 10;

-- -----------------------------------------------
-- Sample Data Inserts
-- -----------------------------------------------

-- Sample product inserts (many categories & tags)
INSERT INTO products (name, price, description, image, category, sales, tags, is_featured, is_bestseller)
VALUES
('Under Armour HOVR Phantom', 139.99, 'Smart running shoe with embedded sensor compatibility.', '/images/Running Shoes.png', 'Running', 89, '["running","smart-shoe","under-armour","men"]', 1, 0),
('New Balance 574', 84.99, 'Classic lifestyle sneaker with timeless design.', '/images/Classic Sneakers.png', 'Casual', 140, '["retro","new-balance","lifestyle","casual"]', 0, 1),
('Salomon X Ultra 4', 129.95, 'Lightweight hiking boots with excellent grip.', '/images/1756303841.png', 'Outdoor', 67, '["hiking","trail","waterproof","salomon"]', 1, 0),
('Reebok Nano X1', 110.00, 'Cross-training shoe built for gym and functional fitness.', '/images/1756304073.png', 'Training', 75, '["crossfit","training","reebok","women"]', 0, 1),
('Asics Gel-Kayano 30', 160.00, 'Stable running shoe ideal for overpronators.', '/images/1756304177.png', 'Running', 92, '["running","stability","asics","long-distance"]', 0, 0),
('Fila Disruptor II', 65.00, 'Chunky sneaker with bold retro style.', '/images/gemini-2.5-flash-image-preview (nano-banana)_create_an_image_for_.png', 'Casual', 133, '["chunky","fila","fashion","women"]', 0, 1),
('Timberland Premium Boot', 189.99, 'Iconic yellow waterproof work-inspired boots.', '/images/gemini-2.5-flash-image-preview (nano-banana)_Timberland_6-Inch_Bo.png', 'Outdoor', 110, '["boots","workwear","timberland","men"]', 1, 1),
('Nike Dunk Low', 110.00, 'Basketball heritage shoe turned streetwear staple.', '/images/gemini-2.5-flash-image-preview (nano-banana)_Nike_Dunk_Low_Retro_.png', 'Casual', 165, '["dunk","nike","limited","lifestyle"]', 1, 1),
('Brooks Ghost 15', 140.00, 'Smooth and reliable daily running shoe.', '/images/1756303841.png', 'Running', 88, '["running","neutral","brooks","cushioned"]', 0, 0),
('Vans Sk8-Hi', 75.00, 'High-top canvas skate shoe with signature stripe.', '/images/gemini-2.5-flash-image-preview (nano-banana)__A_futuristic_sneake.png', 'Skate', 95, '["skate","high-top","vans","black"]', 0, 0),
('Puma Cali Sport', 70.00, 'Women’s fashion sneaker inspired by retro beach culture.', '/images/gemini-2.5-flash-image-preview (nano-banana)_create_image_for_Lap.png', 'Casual', 105, '["fashion","puma","women","retro"]', 0, 1),
('Merrell Moab 3', 119.99, 'Best-selling trail hiking shoe with breathable mesh.', '/images/gemini-2.5-flash-image-preview (nano-banana)_create_an_image_for_ (1).png', 'Outdoor', 122, '["hiking","trail","merrell","comfort"]', 0, 1),
('Adidas Samba', 85.00, 'Vintage football-inspired shoes now a streetwear icon.', '/images/gemini-2.5-flash-image-preview (nano-banana)_create_an_image_for_ (2).png', 'Casual', 170, '["samba","adidas","classic","unisex"]', 1, 1),
('On Cloud X', 129.99, 'Hybrid shoe for running, training, and everyday wear.', '/images/gemini-2.5-flash-image-preview (nano-banana)_create_an_image_of_V.png', 'Training', 60, '["on-running","hybrid","cloud","men"]', 1, 0),
('Skechers Go Walk 7', 79.99, 'Ultra-lightweight walking shoe with responsive sole.', '/images/gemini-2.5-flash-image-preview (nano-banana)_Skechers_Go_Walk_7_L.png', 'Walking', 138, '["walking","comfort","skechers","women"]', 0, 1),
('Dr. Martens 1460', 145.00, 'Legendary 8-eyelet air-cushioned boot.', '/images/Leather Boots.png', 'Casual', 90, '["boots","punk","dr-martens","leather"]', 1, 0),
('Hoka One One Clifton 9', 130.00, 'Plush cushioning with lightweight design.', '/images/gemini-2.5-flash-image-preview (nano-banana)_Hoka_One_One_Clifton.png', 'Running', 77, '["running","max-cushion","hoka","long-distance"]', 0, 0),
('Clarks Desert Boot', 100.00, 'Suede classic with crepe sole, a wardrobe essential.', '/images/Lightweight and comfortable sandals.png', 'Casual', 85, '["chukka","clarks","men","leather"]', 0, 0);