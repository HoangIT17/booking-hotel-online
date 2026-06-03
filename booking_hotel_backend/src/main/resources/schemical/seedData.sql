USE booking_hotel;

-- =============================================
-- TRUNCATE toàn bộ dữ liệu (giữ nguyên DB)
-- =============================================
SET FOREIGN_KEY_CHECKS = 0;

TRUNCATE TABLE reviews;
TRUNCATE TABLE housekeeping_logs;
TRUNCATE TABLE incidents;
TRUNCATE TABLE booking_details;
TRUNCATE TABLE payments;
TRUNCATE TABLE bookings;
TRUNCATE TABLE vouchers;
TRUNCATE TABLE room_furniture;
-- Bỏ comment nếu bảng đã tồn tại trong DB
-- TRUNCATE TABLE furniture_images;
-- TRUNCATE TABLE room_images;
TRUNCATE TABLE rooms;
TRUNCATE TABLE furniture;
TRUNCATE TABLE ai_knowledge_base;
TRUNCATE TABLE permissions;
TRUNCATE TABLE features;
TRUNCATE TABLE profiles;
TRUNCATE TABLE users;
TRUNCATE TABLE roles;

SET FOREIGN_KEY_CHECKS = 1;

-- =============================================
-- Seed: furniture
-- =============================================
INSERT INTO furniture (furniture_name, furniture_type, icon, description, created_at, updated_at) VALUES
('Giường đôi',      'BED',        'BedDouble',     'Giường đôi 1m8, khung gỗ tự nhiên',          NOW(), NOW()),
('Giường đơn',      'BED',        'Bed',           'Giường đơn 1m2, khung gỗ tự nhiên',          NOW(), NOW()),
('Tủ quần áo',      'STORAGE',    'Shirt',         'Tủ 4 cánh, gỗ MDF phủ melamine',             NOW(), NOW()),
('Bàn làm việc',    'TABLE',      'Laptop',        'Bàn gỗ kèm ghế văn phòng',                   NOW(), NOW()),
('TV 55 inch',      'ELECTRONIC', 'Tv',            'Smart TV 55 inch 4K',                         NOW(), NOW()),
('Điều hòa',        'ELECTRONIC', 'AirVent',       'Điều hòa inverter 2 chiều 12000 BTU',         NOW(), NOW()),
('Tủ lạnh mini',    'ELECTRONIC', 'Refrigerator',  'Tủ lạnh mini 90L',                            NOW(), NOW()),
('Máy sấy tóc',     'ELECTRONIC', 'Wind',          'Máy sấy tóc 2200W',                           NOW(), NOW()),
('Sofa đôi',        'CHAIR',      'Sofa',          'Sofa 2 chỗ ngồi, bọc vải cao cấp',           NOW(), NOW()),
('Rèm cửa',         'DECOR',      'PanelLeftOpen', 'Rèm vải dày 2 lớp chắn sáng',                NOW(), NOW()),
('Tranh trang trí', 'DECOR',      'Image',         'Tranh canvas phong cảnh thiên nhiên',         NOW(), NOW()),
('Đèn ngủ',         'LIGHTING',   'Lamp',          'Đèn ngủ để bàn ánh sáng vàng ấm',            NOW(), NOW());

-- =============================================
-- Seed: rooms
-- furniture_id reference:
--   1=Giường đôi, 2=Giường đơn, 3=Tủ quần áo, 4=Bàn làm việc
--   5=TV, 6=Điều hòa, 7=Tủ lạnh, 8=Máy sấy tóc
--   9=Sofa, 10=Rèm cửa, 11=Tranh, 12=Đèn ngủ
-- =============================================

-- Tầng 1: STANDARD (id 1-5)
INSERT INTO rooms (room_type, room_number, floor, price, area, max_people, image_url, status, description, is_deleted, created_at, updated_at) VALUES
('STANDARD', '101', 1, 500000,  20.0, 2, '/RoomImages/STANDARD.jpg', 'READY',    'Phòng hướng sân vườn', 0, NOW(), NOW()),
('STANDARD', '102', 1, 500000,  20.0, 2, '/RoomImages/STANDARD.jpg', 'OCCUPIED', 'Phòng hướng sân vườn', 0, NOW(), NOW()),
('STANDARD', '103', 1, 500000,  20.0, 2, '/RoomImages/STANDARD.jpg', 'READY',    'Phòng hướng sân vườn', 0, NOW(), NOW()),
('STANDARD', '104', 1, 500000,  20.0, 2, '/RoomImages/STANDARD.jpg', 'CLEANING', 'Phòng hướng sân vườn', 0, NOW(), NOW()),
('STANDARD', '105', 1, 500000,  20.0, 2, '/RoomImages/STANDARD.jpg', 'DIRTY',    'Phòng hướng sân vườn', 0, NOW(), NOW());

-- Tầng 2: STANDARD + DELUXE (id 6-10)
INSERT INTO rooms (room_type, room_number, floor, price, area, max_people, image_url, status, description, is_deleted, created_at, updated_at) VALUES
('STANDARD', '201', 2, 500000,  20.0, 2, '/RoomImages/STANDARD.jpg', 'READY',    'Phòng hướng hồ bơi',        0, NOW(), NOW()),
('STANDARD', '202', 2, 500000,  20.0, 2, '/RoomImages/STANDARD.jpg', 'OCCUPIED', 'Phòng hướng hồ bơi',        0, NOW(), NOW()),
('DELUXE',   '203', 2, 900000,  30.0, 2, '/RoomImages/DELUXE.jpg',   'READY',    'Phòng Deluxe hướng hồ bơi', 0, NOW(), NOW()),
('DELUXE',   '204', 2, 900000,  30.0, 2, '/RoomImages/DELUXE.jpg',   'READY',    'Phòng Deluxe hướng hồ bơi', 0, NOW(), NOW()),
('DELUXE',   '205', 2, 900000,  30.0, 2, '/RoomImages/DELUXE.jpg',   'MAINTAIN', 'Đang bảo trì điều hòa',     0, NOW(), NOW());

-- Tầng 3: DELUXE (id 11-14)
INSERT INTO rooms (room_type, room_number, floor, price, area, max_people, image_url, status, description, is_deleted, created_at, updated_at) VALUES
('DELUXE', '301', 3, 900000, 30.0, 2, '/RoomImages/DELUXE.jpg', 'READY',    'Phòng Deluxe hướng biển', 0, NOW(), NOW()),
('DELUXE', '302', 3, 900000, 30.0, 2, '/RoomImages/DELUXE.jpg', 'OCCUPIED', 'Phòng Deluxe hướng biển', 0, NOW(), NOW()),
('DELUXE', '303', 3, 900000, 30.0, 2, '/RoomImages/DELUXE.jpg', 'READY',    'Phòng Deluxe hướng biển', 0, NOW(), NOW()),
('DELUXE', '304', 3, 900000, 30.0, 2, '/RoomImages/DELUXE.jpg', 'CLEANING', 'Phòng Deluxe hướng biển', 0, NOW(), NOW());

-- Tầng 4: FAMILY (id 15-17)
INSERT INTO rooms (room_type, room_number, floor, price, area, max_people, image_url, status, description, is_deleted, created_at, updated_at) VALUES
('FAMILY', '401', 4, 1200000, 45.0, 4, '/RoomImages/FAMILY.jpg', 'READY',    'Phòng gia đình rộng rãi', 0, NOW(), NOW()),
('FAMILY', '402', 4, 1200000, 45.0, 4, '/RoomImages/FAMILY.jpg', 'OCCUPIED', 'Phòng gia đình rộng rãi', 0, NOW(), NOW()),
('FAMILY', '403', 4, 1200000, 45.0, 4, '/RoomImages/FAMILY.jpg', 'READY',    'Phòng gia đình rộng rãi', 0, NOW(), NOW());

-- Tầng 5: VIP (id 18-20)
INSERT INTO rooms (room_type, room_number, floor, price, area, max_people, image_url, status, description, is_deleted, created_at, updated_at) VALUES
('VIP', '501', 5, 2000000, 55.0, 2, '/RoomImages/VIP.jpg', 'READY',    'Phòng VIP view toàn thành phố', 0, NOW(), NOW()),
('VIP', '502', 5, 2000000, 55.0, 2, '/RoomImages/VIP.jpg', 'OCCUPIED', 'Phòng VIP view toàn thành phố', 0, NOW(), NOW()),
('VIP', '503', 5, 2000000, 55.0, 2, '/RoomImages/VIP.jpg', 'READY',    'Phòng VIP view toàn thành phố', 0, NOW(), NOW());

-- Tầng 6: SUITE (id 21-22)
INSERT INTO rooms (room_type, room_number, floor, price, area, max_people, image_url, status, description, is_deleted, created_at, updated_at) VALUES
('SUITE', '601', 6, 3500000, 80.0, 2, '/RoomImages/SUITE.jpg', 'READY',    'Suite Penthouse, view 360 độ', 0, NOW(), NOW()),
('SUITE', '602', 6, 3500000, 80.0, 2, '/RoomImages/SUITE.jpg', 'OCCUPIED', 'Suite Penthouse, view 360 độ', 0, NOW(), NOW());

-- =============================================
-- Seed: room_furniture
-- STANDARD: 1,3,4,5,6,8,10,12
-- DELUXE:   1,3,4,5,6,7,8,10,11,12
-- FAMILY:   1,2,3,5,6,7,8,10,12
-- VIP:      1,3,4,5,6,7,8,9,10,11,12
-- SUITE:    1,3,4,5,6,7,8,9,10,11,12
-- =============================================

-- Tầng 1: STANDARD (room 1-5)
INSERT INTO room_furniture (room_id, furniture_id) VALUES
(1,1),(1,3),(1,4),(1,5),(1,6),(1,8),(1,10),(1,12),
(2,1),(2,3),(2,4),(2,5),(2,6),(2,8),(2,10),(2,12),
(3,1),(3,3),(3,4),(3,5),(3,6),(3,8),(3,10),(3,12),
(4,1),(4,3),(4,4),(4,5),(4,6),(4,8),(4,10),(4,12),
(5,1),(5,3),(5,4),(5,5),(5,6),(5,8),(5,10),(5,12);

-- Tầng 2: STANDARD (room 6-7)
INSERT INTO room_furniture (room_id, furniture_id) VALUES
(6,1),(6,3),(6,4),(6,5),(6,6),(6,8),(6,10),(6,12),
(7,1),(7,3),(7,4),(7,5),(7,6),(7,8),(7,10),(7,12);

-- Tầng 2: DELUXE (room 8-10)
INSERT INTO room_furniture (room_id, furniture_id) VALUES
(8,1),(8,3),(8,4),(8,5),(8,6),(8,7),(8,8),(8,10),(8,11),(8,12),
(9,1),(9,3),(9,4),(9,5),(9,6),(9,7),(9,8),(9,10),(9,11),(9,12),
(10,1),(10,3),(10,4),(10,5),(10,6),(10,7),(10,8),(10,10),(10,11),(10,12);

-- Tầng 3: DELUXE (room 11-14)
INSERT INTO room_furniture (room_id, furniture_id) VALUES
(11,1),(11,3),(11,4),(11,5),(11,6),(11,7),(11,8),(11,10),(11,11),(11,12),
(12,1),(12,3),(12,4),(12,5),(12,6),(12,7),(12,8),(12,10),(12,11),(12,12),
(13,1),(13,3),(13,4),(13,5),(13,6),(13,7),(13,8),(13,10),(13,11),(13,12),
(14,1),(14,3),(14,4),(14,5),(14,6),(14,7),(14,8),(14,10),(14,11),(14,12);

-- Tầng 4: FAMILY (room 15-17)
INSERT INTO room_furniture (room_id, furniture_id) VALUES
(15,1),(15,2),(15,3),(15,5),(15,6),(15,7),(15,8),(15,10),(15,12),
(16,1),(16,2),(16,3),(16,5),(16,6),(16,7),(16,8),(16,10),(16,12),
(17,1),(17,2),(17,3),(17,5),(17,6),(17,7),(17,8),(17,10),(17,12);

-- Tầng 5: VIP (room 18-20)
INSERT INTO room_furniture (room_id, furniture_id) VALUES
(18,1),(18,3),(18,4),(18,5),(18,6),(18,7),(18,8),(18,9),(18,10),(18,11),(18,12),
(19,1),(19,3),(19,4),(19,5),(19,6),(19,7),(19,8),(19,9),(19,10),(19,11),(19,12),
(20,1),(20,3),(20,4),(20,5),(20,6),(20,7),(20,8),(20,9),(20,10),(20,11),(20,12);

-- Tầng 6: SUITE (room 21-22)
INSERT INTO room_furniture (room_id, furniture_id) VALUES
(21,1),(21,3),(21,4),(21,5),(21,6),(21,7),(21,8),(21,9),(21,10),(21,11),(21,12),
(22,1),(22,3),(22,4),(22,5),(22,6),(22,7),(22,8),(22,9),(22,10),(22,11),(22,12);

-- =============================================
-- Seed: bookings + reviews
-- =============================================
SET @customer_id    = (SELECT id FROM users WHERE username = 'customer');
SET @receptionist_id = (SELECT id FROM users WHERE username = 'receptionist');

INSERT INTO bookings (customer_id, voucher_id, check_in_date, check_out_date, num_nights, num_guests, extra_charge, total_price, status, created_at, updated_at) VALUES
(@customer_id, NULL, '2025-03-01', '2025-03-03', 2, 2, 0,       1000000, 'CHECKED_OUT', '2025-03-01 14:00:00', '2025-03-03 12:00:00'),
(@customer_id, NULL, '2025-03-15', '2025-03-18', 3, 2, 200000,  2900000, 'CHECKED_OUT', '2025-03-15 14:00:00', '2025-03-18 12:00:00'),
(@customer_id, NULL, '2025-04-05', '2025-04-06', 1, 1, 0,       2000000, 'CHECKED_OUT', '2025-04-05 14:00:00', '2025-04-06 12:00:00'),
(@customer_id, NULL, '2025-04-20', '2025-04-25', 5, 4, 500000,  6500000, 'CHECKED_OUT', '2025-04-20 14:00:00', '2025-04-25 12:00:00');

SET @booking1_id = (SELECT id FROM bookings WHERE customer_id = @customer_id AND check_in_date = '2025-03-01');
SET @booking2_id = (SELECT id FROM bookings WHERE customer_id = @customer_id AND check_in_date = '2025-03-15');
SET @booking3_id = (SELECT id FROM bookings WHERE customer_id = @customer_id AND check_in_date = '2025-04-05');

-- Review 1: 4 sao, đã có phản hồi
INSERT INTO reviews (customer_id, booking_id, rating, comment, staff_reply, replied_by, replied_at, created_at, updated_at) VALUES
(@customer_id, @booking1_id, 4,
 'Phòng sạch sẽ, nhân viên thân thiện. Vị trí khách sạn rất thuận tiện. Sẽ quay lại lần sau!',
 'Cảm ơn quý khách đã lưu trú và để lại đánh giá tích cực. Chúng tôi rất vui khi được phục vụ và mong sớm được đón quý khách trở lại!',
 @receptionist_id, '2025-03-04 09:00:00', '2025-03-04 08:00:00', '2025-03-04 09:00:00');

-- Review 2: 3.0 sao, chưa có phản hồi
INSERT INTO reviews (customer_id, booking_id, rating, comment, staff_reply, replied_by, replied_at, created_at, updated_at) VALUES
(@customer_id, @booking2_id, 3,
 'Phòng ổn nhưng điều hòa hơi ồn, khó ngủ vào ban đêm. Bữa sáng khá ngon nhưng ít lựa chọn.',
 NULL, NULL, NULL, '2025-03-19 10:00:00', '2025-03-19 10:00:00');

-- Review 3: 5.0 sao, đã có phản hồi
INSERT INTO reviews (customer_id, booking_id, rating, comment, staff_reply, replied_by, replied_at, created_at, updated_at) VALUES
(@customer_id, @booking3_id, 5.0,
 'Tuyệt vời! Phòng VIP xứng đáng từng đồng. View đẹp, dịch vụ 5 sao, nhân viên chuyên nghiệp. Cực kỳ hài lòng!',
 'Quý khách đã dành những lời khen tặng rất trân trọng. Đây là động lực lớn để đội ngũ chúng tôi tiếp tục cố gắng. Hẹn gặp lại quý khách!',
 @receptionist_id, '2025-04-07 08:30:00', '2025-04-07 08:00:00', '2025-04-07 08:30:00');

-- =============================================
-- Seed bổ sung: 10 dữ liệu mới liên quan nhau
-- furniture id 13-22, rooms id 23-32
-- =============================================

INSERT INTO furniture (furniture_name, furniture_type, icon, description, created_at, updated_at) VALUES
('Bồn tắm nằm',        'BATHROOM',   'Bath',          'Bồn tắm acrylic cao cấp cho phòng hạng sang',          NOW(), NOW()),
('Két sắt mini',       'STORAGE',    'Vault',         'Két sắt điện tử cỡ nhỏ đặt trong tủ quần áo',          NOW(), NOW()),
('Máy pha cà phê',     'KITCHEN',    'Coffee',        'Máy pha cà phê viên nén kèm bộ ly sứ',                 NOW(), NOW()),
('Ghế thư giãn',       'CHAIR',      'Armchair',      'Ghế đọc sách bọc nỉ đặt cạnh cửa sổ',                  NOW(), NOW()),
('Bàn trà',            'TABLE',      'Table2',        'Bàn trà mặt đá nhỏ dùng cho khu tiếp khách',           NOW(), NOW()),
('Loa bluetooth',      'ELECTRONIC', 'Speaker',       'Loa bluetooth để bàn cho phòng VIP và Suite',          NOW(), NOW()),
('Đèn cây',            'LIGHTING',   'LampFloor',     'Đèn cây ánh sáng ấm cho góc đọc sách',                 NOW(), NOW()),
('Thảm trải sàn',      'DECOR',      'SquareStack',   'Thảm lông ngắn chống trượt cạnh giường ngủ',           NOW(), NOW()),
('Gương toàn thân',    'DECOR',      'ScanFace',      'Gương toàn thân khung kim loại màu đen',               NOW(), NOW()),
('Bếp điện mini',      'KITCHEN',    'CookingPot',    'Bếp điện mini phục vụ phòng lưu trú dài ngày',         NOW(), NOW());

INSERT INTO rooms (room_type, room_number, floor, price, area, max_people, image_url, status, description, is_deleted, created_at, updated_at) VALUES
('SUPERIOR', '701', 7, 750000,  26.0, 2, '/RoomImages/STANDARD.jpg', 'READY',    'Phòng Superior yên tĩnh gần thang máy',              0, NOW(), NOW()),
('SUPERIOR', '702', 7, 750000,  26.0, 2, '/RoomImages/STANDARD.jpg', 'CLEANING', 'Phòng Superior có két sắt mini cho khách công tác', 0, NOW(), NOW()),
('DELUXE',   '703', 7, 950000,  32.0, 2, '/RoomImages/DELUXE.jpg',   'READY',    'Phòng Deluxe có máy pha cà phê và view hồ bơi',      0, NOW(), NOW()),
('DELUXE',   '704', 7, 950000,  32.0, 2, '/RoomImages/DELUXE.jpg',   'OCCUPIED', 'Phòng Deluxe có ghế thư giãn cạnh cửa sổ',          0, NOW(), NOW()),
('FAMILY',   '705', 7, 1300000, 48.0, 4, '/RoomImages/FAMILY.jpg',   'READY',    'Phòng Family có bàn trà cho khu sinh hoạt chung',    0, NOW(), NOW()),
('VIP',      '801', 8, 2200000, 58.0, 2, '/RoomImages/VIP.jpg',      'READY',    'Phòng VIP có loa bluetooth và khu tiếp khách riêng', 0, NOW(), NOW()),
('VIP',      '802', 8, 2200000, 58.0, 2, '/RoomImages/VIP.jpg',      'MAINTAIN', 'Phòng VIP đang kiểm tra hệ thống đèn cây',           0, NOW(), NOW()),
('SUITE',    '803', 8, 3600000, 82.0, 2, '/RoomImages/SUITE.jpg',    'READY',    'Suite có thảm trải sàn và phòng khách rộng',         0, NOW(), NOW()),
('SUITE',    '804', 8, 3600000, 82.0, 2, '/RoomImages/SUITE.jpg',    'READY',    'Suite có gương toàn thân trong khu thay đồ',         0, NOW(), NOW()),
('FAMILY',   '805', 8, 1450000, 52.0, 4, '/RoomImages/FAMILY.jpg',   'DIRTY',    'Phòng Family có bếp điện mini cho lưu trú dài ngày', 0, NOW(), NOW());

INSERT INTO room_furniture (room_id, furniture_id) VALUES
(23,13),
(24,14),
(25,15),
(26,16),
(27,17),
(28,18),
(29,19),
(30,20),
(31,21),
(32,22);
