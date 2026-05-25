CREATE DATABASE IF NOT EXISTS booking_hotel;
USE booking_hotel;

-- Seed data: room_types
INSERT INTO room_types (type_name, base_price, area, max_people, description, created_at, updated_at) VALUES
('STANDARD', 500000,  20.0, 2, 'Phòng tiêu chuẩn, đầy đủ tiện nghi cơ bản',       NOW(), NOW()),
('DELUXE',   900000,  30.0, 2, 'Phòng cao cấp hơn, view đẹp, nội thất hiện đại',   NOW(), NOW()),
('FAMILY',   1200000, 45.0, 4, 'Phòng gia đình rộng rãi, phù hợp 3-4 người',       NOW(), NOW()),
('VIP',      2000000, 55.0, 2, 'Phòng VIP sang trọng, dịch vụ ưu tiên',            NOW(), NOW()),
('SUITE',    3500000, 80.0, 2, 'Phòng Suite cao cấp nhất, phòng khách riêng biệt', NOW(), NOW());

-- Seed data: room_images (1 thumbnail mỗi loại)
INSERT INTO room_images (room_type_id, image_url, is_thumbnail) VALUES
(1, '/RoomImages/STANDARD.jpg', TRUE),
(2, '/RoomImages/DELUXE.jpg',   TRUE),
(3, '/RoomImages/FAMILY.jpg',   TRUE),
(4, '/RoomImages/VIP.jpg',      TRUE),
(5, '/RoomImages/SUITE.jpg',    TRUE);

-- Seed data: furniture
INSERT INTO furniture (furniture_name, furniture_type, icon_name, description, created_at, updated_at) VALUES
('Giường đôi',      'WOODEN',     'BedDouble',    'Giường đôi 1m8, khung gỗ tự nhiên',         NOW(), NOW()),
('Giường đơn',      'WOODEN',     'Bed',          'Giường đơn 1m2, khung gỗ tự nhiên',         NOW(), NOW()),
('Tủ quần áo',      'WOODEN',     'Shirt',        'Tủ 4 cánh, gỗ MDF phủ melamine',            NOW(), NOW()),
('Bàn làm việc',    'WOODEN',     'Laptop',       'Bàn gỗ kèm ghế văn phòng',                  NOW(), NOW()),
('TV 55 inch',      'ELECTRONIC', 'Tv',           'Smart TV 55 inch 4K',                        NOW(), NOW()),
('Điều hòa',        'ELECTRONIC', 'AirVent',      'Điều hòa inverter 2 chiều 12000 BTU',        NOW(), NOW()),
('Tủ lạnh mini',    'ELECTRONIC', 'Refrigerator', 'Tủ lạnh mini 90L',                           NOW(), NOW()),
('Máy sấy tóc',     'ELECTRONIC', 'Wind',         'Máy sấy tóc 2200W',                          NOW(), NOW()),
('Sofa đôi',        'FABRIC',     'Sofa',         'Sofa 2 chỗ ngồi, bọc vải cao cấp',          NOW(), NOW()),
('Rèm cửa',         'FABRIC',     'PanelLeftOpen','Rèm vải dày 2 lớp chắn sáng',               NOW(), NOW()),
('Tranh trang trí', 'DECOR',      'Image',        'Tranh canvas phong cảnh thiên nhiên',        NOW(), NOW()),
('Đèn ngủ',         'DECOR',      'Lamp',         'Đèn ngủ để bàn ánh sáng vàng ấm',           NOW(), NOW());

-- Seed data: room_type_furniture
-- STANDARD (1)
INSERT INTO room_type_furniture (room_type_id, furniture_id, quantity) VALUES
(1, 1,  1), -- Giường đôi
(1, 3,  1), -- Tủ quần áo
(1, 4,  1), -- Bàn làm việc
(1, 5,  1), -- TV 55 inch
(1, 6,  1), -- Điều hòa
(1, 8,  1), -- Máy sấy tóc
(1, 10, 1), -- Rèm cửa
(1, 12, 1); -- Đèn ngủ

-- DELUXE (2)
INSERT INTO room_type_furniture (room_type_id, furniture_id, quantity) VALUES
(2, 1,  1),
(2, 3,  1),
(2, 4,  1),
(2, 5,  1),
(2, 6,  1),
(2, 7,  1), -- Tủ lạnh mini
(2, 8,  1),
(2, 10, 1),
(2, 11, 1), -- Tranh trang trí
(2, 12, 1);

-- FAMILY (3)
INSERT INTO room_type_furniture (room_type_id, furniture_id, quantity) VALUES
(3, 1,  1),
(3, 2,  2), -- Giường đơn x2
(3, 3,  1),
(3, 5,  1),
(3, 6,  1),
(3, 7,  1),
(3, 8,  1),
(3, 10, 2),
(3, 12, 2);

-- VIP (4)
INSERT INTO room_type_furniture (room_type_id, furniture_id, quantity) VALUES
(4, 1,  1),
(4, 3,  1),
(4, 4,  1),
(4, 5,  1),
(4, 6,  1),
(4, 7,  1),
(4, 8,  1),
(4, 9,  1), -- Sofa đôi
(4, 10, 2),
(4, 11, 2),
(4, 12, 2);

-- SUITE (5)
INSERT INTO room_type_furniture (room_type_id, furniture_id, quantity) VALUES
(5, 1,  1),
(5, 3,  2),
(5, 4,  1),
(5, 5,  2), -- 2 TV
(5, 6,  2), -- 2 Điều hòa
(5, 7,  1),
(5, 8,  2),
(5, 9,  1),
(5, 10, 4),
(5, 11, 3),
(5, 12, 4);

-- Seed data: rooms
-- Tầng 1: STANDARD (101-105)
INSERT INTO rooms (room_type_id, room_number, floor, status, description, is_deleted, created_at, updated_at) VALUES
(1, '101', 1, 'READY',    'Phòng hướng sân vườn', 0, NOW(), NOW()),
(1, '102', 1, 'OCCUPIED', 'Phòng hướng sân vườn', 0, NOW(), NOW()),
(1, '103', 1, 'READY',    'Phòng hướng sân vườn', 0, NOW(), NOW()),
(1, '104', 1, 'CLEANING', 'Phòng hướng sân vườn', 0, NOW(), NOW()),
(1, '105', 1, 'DIRTY',    'Phòng hướng sân vườn', 0, NOW(), NOW());

-- Tầng 2: STANDARD + DELUXE (201-205)
INSERT INTO rooms (room_type_id, room_number, floor, status, description, is_deleted, created_at, updated_at) VALUES
(1, '201', 2, 'READY',    'Phòng hướng hồ bơi',       0, NOW(), NOW()),
(1, '202', 2, 'OCCUPIED', 'Phòng hướng hồ bơi',       0, NOW(), NOW()),
(2, '203', 2, 'READY',    'Phòng Deluxe hướng hồ bơi',0, NOW(), NOW()),
(2, '204', 2, 'READY',    'Phòng Deluxe hướng hồ bơi',0, NOW(), NOW()),
(2, '205', 2, 'MAINTAIN', 'Đang bảo trì điều hòa',    0, NOW(), NOW());

-- Tầng 3: DELUXE (301-304)
INSERT INTO rooms (room_type_id, room_number, floor, status, description, is_deleted, created_at, updated_at) VALUES
(2, '301', 3, 'READY',    'Phòng Deluxe hướng biển', 0, NOW(), NOW()),
(2, '302', 3, 'OCCUPIED', 'Phòng Deluxe hướng biển', 0, NOW(), NOW()),
(2, '303', 3, 'READY',    'Phòng Deluxe hướng biển', 0, NOW(), NOW()),
(2, '304', 3, 'CLEANING', 'Phòng Deluxe hướng biển', 0, NOW(), NOW());

-- Tầng 4: FAMILY (401-403)
INSERT INTO rooms (room_type_id, room_number, floor, status, description, is_deleted, created_at, updated_at) VALUES
(3, '401', 4, 'READY',    'Phòng gia đình rộng rãi', 0, NOW(), NOW()),
(3, '402', 4, 'OCCUPIED', 'Phòng gia đình rộng rãi', 0, NOW(), NOW()),
(3, '403', 4, 'READY',    'Phòng gia đình rộng rãi', 0, NOW(), NOW());

-- Tầng 5: VIP (501-503)
INSERT INTO rooms (room_type_id, room_number, floor, status, description, is_deleted, created_at, updated_at) VALUES
(4, '501', 5, 'READY',    'Phòng VIP view toàn thành phố', 0, NOW(), NOW()),
(4, '502', 5, 'OCCUPIED', 'Phòng VIP view toàn thành phố', 0, NOW(), NOW()),
(4, '503', 5, 'READY',    'Phòng VIP view toàn thành phố', 0, NOW(), NOW());

-- Tầng 6: SUITE (601-602)
INSERT INTO rooms (room_type_id, room_number, floor, status, description, is_deleted, created_at, updated_at) VALUES
(5, '601', 6, 'READY',    'Suite Penthouse, view 360 độ', 0, NOW(), NOW()),
(5, '602', 6, 'OCCUPIED', 'Suite Penthouse, view 360 độ', 0, NOW(), NOW());

SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE rooms;
TRUNCATE TABLE room_type_furniture;
TRUNCATE TABLE room_images;
TRUNCATE TABLE furniture;
TRUNCATE TABLE room_types;
SET FOREIGN_KEY_CHECKS = 1;