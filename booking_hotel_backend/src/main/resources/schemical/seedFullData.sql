USE booking_hotel;

SET FOREIGN_KEY_CHECKS = 0;

TRUNCATE TABLE ai_knowledge_base;
TRUNCATE TABLE incidents;
TRUNCATE TABLE housekeeping_logs;
TRUNCATE TABLE reviews;
TRUNCATE TABLE booking_details;
TRUNCATE TABLE bookings;
TRUNCATE TABLE vouchers;
TRUNCATE TABLE room_furniture;
TRUNCATE TABLE rooms;
TRUNCATE TABLE furniture;

SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================
-- 1. FURNITURE
-- ============================================================
INSERT INTO furniture (furniture_name, furniture_type, icon, description, created_at, updated_at) VALUES
-- BED
('Giường King Size',   'BED',       'fa-bed',         'Giường đôi 1.8×2m, nệm cao su tự nhiên cao cấp, đệm lông vũ',                  NOW(), NOW()),
('Giường Queen Size',  'BED',       'fa-bed',         'Giường đôi 1.6×2m, nệm lò xo túi cao cấp',                                     NOW(), NOW()),
('Giường đơn Twin',    'BED',       'fa-bed',         '2 giường đơn 0.9×2m, phù hợp bạn bè hoặc đồng nghiệp',                        NOW(), NOW()),
-- ELECTRONIC
('Smart TV 55 inch',   'ELECTRONIC','fa-tv',          'Samsung QLED 4K, tích hợp Netflix, YouTube, Disney+',                          NOW(), NOW()),
('Điều hòa Inverter',  'ELECTRONIC','fa-snowflake',   'Daikin Inverter 2 chiều 12000BTU, lọc không khí PM2.5',                        NOW(), NOW()),
('Tủ lạnh Minibar',    'ELECTRONIC','fa-box',         'Minibar 40L, làm lạnh nhanh, ngăn đông mini',                                  NOW(), NOW()),
('Két sắt điện tử',    'ELECTRONIC','fa-lock',        'Két an toàn điện tử, mã 4-6 số, đủ để laptop 15 inch',                        NOW(), NOW()),
('Máy sấy tóc',        'ELECTRONIC','fa-wind',        'Panasonic 1800W, ion âm chống tĩnh điện',                                      NOW(), NOW()),
-- BATHROOM
('Bồn tắm',            'BATHROOM',  'fa-bath',        'Bồn acrylic 170×75cm, vòi tắm mưa gắn trần',                                  NOW(), NOW()),
('Vòi sen đứng',       'BATHROOM',  'fa-shower',      'Sen đứng Grohe nhiệt độ hằng định, 3 chế độ',                                 NOW(), NOW()),
('Bồn cầu thông minh', 'BATHROOM',  'fa-toilet',      'TOTO thông minh tự xịt, sấy, khử mùi tự động',                               NOW(), NOW()),
-- TABLE
('Bàn làm việc',       'TABLE',     'fa-desktop',     'Bàn gỗ sồi 120×60cm, ngăn kéo, ổ cắm USB',                                   NOW(), NOW()),
('Bàn trà',            'TABLE',     'fa-coffee',      'Kính cường lực chân inox, 80×80cm',                                           NOW(), NOW()),
-- CHAIR
('Sofa 2 người',       'CHAIR',     'fa-couch',       'Sofa da thật màu kem, 2 chỗ ngồi, đệm lò xo túi',                            NOW(), NOW()),
('Ghế làm việc',       'CHAIR',     'fa-chair',       'Ghế công thái học, có bánh xe, chỉnh độ cao, tay vịn 4D',                    NOW(), NOW()),
-- LIGHTING
('Đèn ngủ đầu giường', 'LIGHTING',  'fa-lightbulb',   'Đèn LED cảm ứng, điều chỉnh độ sáng và màu sắc 3 tone',                     NOW(), NOW()),
('Đèn cây góc phòng',  'LIGHTING',  'fa-lightbulb',   'Đèn cây phong cách Bắc Âu, ánh sáng vàng ấm 2700K',                         NOW(), NOW()),
-- STORAGE
('Tủ quần áo',         'STORAGE',   'fa-door-closed', 'Tủ gỗ 4 cánh tích hợp gương, 180cm, có ngăn kéo',                           NOW(), NOW()),
('Kệ hành lý',         'STORAGE',   'fa-suitcase',    'Kệ inox 304, chịu lực 80kg, gấp gọn được',                                   NOW(), NOW()),
-- KITCHEN
('Ấm siêu tốc',        'KITCHEN',   'fa-mug-hot',     'Philips 1.0L, tự ngắt khi sôi, lọc cặn',                                     NOW(), NOW()),
('Máy pha cà phê',     'KITCHEN',   'fa-coffee',      'Nespresso Essenza Mini, kèm 12 viên đa dạng hương vị',                       NOW(), NOW()),
-- DECOR
('Gương toàn thân',    'DECOR',     'fa-border-all',  'Gương oval 50×150cm, khung mạ vàng 18K',                                     NOW(), NOW()),
('Tranh trang trí',    'DECOR',     'fa-image',       'Tranh sơn dầu phong cảnh biển Đà Nẵng 60×90cm, khung gỗ',                   NOW(), NOW());

-- ============================================================
-- 2. ROOMS
-- Furniture IDs (theo thứ tự INSERT):
--  1=King, 2=Queen, 3=Twin, 4=TV, 5=AC, 6=Fridge, 7=Safe, 8=HairDryer
--  9=Bathtub, 10=Shower, 11=SmartWC, 12=WorkDesk, 13=CoffeeTable
-- 14=Sofa, 15=WorkChair, 16=BedLamp, 17=FloorLamp, 18=Wardrobe
-- 19=LuggageRack, 20=Kettle, 21=CoffeeMaker, 22=Mirror, 23=Painting
-- ============================================================

-- Tầng 1: STANDARD (101-106)
INSERT INTO rooms (room_type, room_number, floor, price, area, max_people, status, description, is_deleted, created_at, updated_at) VALUES
('STANDARD', '101', 1,  800000, 28.0, 2, 'READY',    'Phòng Standard tầng 1 view hồ bơi. Trang bị đầy đủ tiện nghi cơ bản, phù hợp cặp đôi hoặc khách công tác.',           0, NOW(), NOW()),
('STANDARD', '102', 1,  800000, 28.0, 2, 'OCCUPIED', 'Phòng Standard view vườn cây xanh yên tĩnh. Ánh sáng tự nhiên tốt, gần thang máy.',                                   0, NOW(), NOW()),
('STANDARD', '103', 1,  850000, 30.0, 2, 'READY',    'Phòng Standard 2 giường đơn, phù hợp 2 bạn bè hoặc đồng nghiệp đi công tác.',                                        0, NOW(), NOW()),
('STANDARD', '104', 1,  800000, 28.0, 2, 'DIRTY',    'Phòng Standard cần vệ sinh sau trả phòng. Đang chờ nhân viên dọn dẹp.',                                               0, NOW(), NOW()),
('STANDARD', '105', 1,  800000, 28.0, 2, 'CLEANING', 'Phòng Standard đang được vệ sinh để đón khách mới.',                                                                   0, NOW(), NOW()),
('STANDARD', '106', 1,  900000, 32.0, 3, 'READY',    'Phòng Standard 3 người, 1 giường đôi + 1 giường phụ. Phù hợp gia đình nhỏ.',                                         0, NOW(), NOW());

-- Tầng 2: SUPERIOR (201-204)
INSERT INTO rooms (room_type, room_number, floor, price, area, max_people, status, description, is_deleted, created_at, updated_at) VALUES
('SUPERIOR', '201', 2, 1200000, 35.0, 2, 'READY',    'Phòng Superior view thành phố tuyệt đẹp. Nội thất gỗ tự nhiên, tủ lạnh minibar, máy pha cà phê.',                    0, NOW(), NOW()),
('SUPERIOR', '202', 2, 1200000, 35.0, 2, 'OCCUPIED', 'Phòng Superior King Bed lãng mạn, view hồ bơi ban đêm. Thích hợp cặp đôi nghỉ dưỡng.',                              0, NOW(), NOW()),
('SUPERIOR', '203', 2, 1250000, 38.0, 3, 'READY',    'Phòng Superior 3 người, 2 giường đơn + sofa bed. Không gian rộng, thích hợp nhóm bạn.',                             0, NOW(), NOW()),
('SUPERIOR', '204', 2, 1200000, 35.0, 2, 'MAINTAIN', 'Phòng Superior đang bảo trì điều hòa (nạp gas). Dự kiến hoàn thành sau 1 ngày.',                                    0, NOW(), NOW());

-- Tầng 3: DELUXE (301-304)
INSERT INTO rooms (room_type, room_number, floor, price, area, max_people, status, description, is_deleted, created_at, updated_at) VALUES
('DELUXE', '301', 3, 1800000, 45.0, 2, 'READY',    'Phòng Deluxe King Bed bồn tắm view thành phố tầng cao. Nội thất nhập khẩu Ý, két sắt điện tử, bộ pha cà phê Nespresso.', 0, NOW(), NOW()),
('DELUXE', '302', 3, 1800000, 45.0, 2, 'OCCUPIED', 'Phòng Deluxe romantique, bồn tắm kính nhìn ra thành phố về đêm. Được yêu thích nhất cho tuần trăng mật.',               0, NOW(), NOW()),
('DELUXE', '303', 3, 1900000, 50.0, 4, 'READY',    'Phòng Deluxe gia đình, 2 giường đôi. Khu vui chơi góc phòng cho trẻ. View vườn hoa tầng 3.',                             0, NOW(), NOW()),
('DELUXE', '304', 3, 1800000, 45.0, 2, 'READY',    'Phòng Deluxe phong cách tối giản Nhật Bản. Sàn gỗ hinoki, đèn dịu, không gian thiền định.',                             0, NOW(), NOW());

-- Tầng 4: VIP (401-403)
INSERT INTO rooms (room_type, room_number, floor, price, area, max_people, status, description, is_deleted, created_at, updated_at) VALUES
('VIP', '401', 4, 2800000, 60.0, 2, 'READY',    'Phòng VIP toàn kính panorama 180° tầng cao nhất. Nội thất nhập khẩu Ý, butler service 24/7, truy cập VIP Lounge.', 0, NOW(), NOW()),
('VIP', '402', 4, 2800000, 60.0, 2, 'OCCUPIED', 'Phòng VIP phong cách Art Deco. Sàn đá cẩm thạch, đèn chùm crystal, rượu chào mừng miễn phí.',                      0, NOW(), NOW()),
('VIP', '403', 4, 3000000, 70.0, 4, 'READY',    'Phòng VIP 4 người, 2 phòng ngủ liên thông. Phòng khách riêng, bếp nhỏ đầy đủ tiện nghi.',                          0, NOW(), NOW());

-- Tầng 5: SUITE & FAMILY (501-504)
INSERT INTO rooms (room_type, room_number, floor, price, area, max_people, status, description, is_deleted, created_at, updated_at) VALUES
('SUITE',  '501', 5, 5000000, 90.0, 2, 'READY',    'Presidential Suite — tầng đỉnh. Phòng khách riêng, phòng ăn, phòng ngủ master tách biệt. Bể ngâm sục jacuzzi, sân thượng riêng view 360°.', 0, NOW(), NOW()),
('SUITE',  '502', 5, 4500000, 80.0, 2, 'READY',    'Executive Suite — không gian làm việc riêng biệt, phòng họp mini 4 người. Lý tưởng cho doanh nhân cần làm việc kết hợp nghỉ ngơi.',         0, NOW(), NOW()),
('FAMILY', '503', 5, 3500000, 75.0, 6, 'READY',    'Family Suite 6 người — 3 phòng ngủ (1 master + 2 twin), phòng khách lớn, bếp mini, góc vui chơi trẻ em, máy giặt riêng.',                   0, NOW(), NOW()),
('FAMILY', '504', 5, 3200000, 70.0, 5, 'OCCUPIED', 'Family Deluxe 5 người. Bữa sáng miễn phí cho cả nhóm, xe đưa đón sân bay, cũi em bé miễn phí khi yêu cầu.',                                0, NOW(), NOW());

-- ============================================================
-- 3. ROOM FURNITURE
-- ============================================================

-- 101: Queen(2), TV(4), AC(5), HairDryer(8), Shower(10), WorkDesk(12), BedLamp(16), Wardrobe(18), LuggageRack(19), Kettle(20)
INSERT INTO room_furniture (room_id, furniture_id)
SELECT r.id, f.id FROM rooms r JOIN furniture f ON f.furniture_name IN ('Giường Queen Size','Smart TV 55 inch','Điều hòa Inverter','Máy sấy tóc','Vòi sen đứng','Bàn làm việc','Đèn ngủ đầu giường','Tủ quần áo','Kệ hành lý','Ấm siêu tốc')
WHERE r.room_number = '101';

-- 102: same as 101
INSERT INTO room_furniture (room_id, furniture_id)
SELECT r.id, f.id FROM rooms r JOIN furniture f ON f.furniture_name IN ('Giường Queen Size','Smart TV 55 inch','Điều hòa Inverter','Máy sấy tóc','Vòi sen đứng','Bàn làm việc','Đèn ngủ đầu giường','Tủ quần áo','Kệ hành lý','Ấm siêu tốc')
WHERE r.room_number = '102';

-- 103: Twin(3), TV, AC, HairDryer, Shower, WorkDesk, BedLamp, Wardrobe, LuggageRack, Kettle
INSERT INTO room_furniture (room_id, furniture_id)
SELECT r.id, f.id FROM rooms r JOIN furniture f ON f.furniture_name IN ('Giường đơn Twin','Smart TV 55 inch','Điều hòa Inverter','Máy sấy tóc','Vòi sen đứng','Bàn làm việc','Đèn ngủ đầu giường','Tủ quần áo','Kệ hành lý','Ấm siêu tốc')
WHERE r.room_number = '103';

-- 104, 105: Queen, TV, AC, HairDryer, Shower, WorkDesk, BedLamp, Wardrobe, Kettle (no luggage rack)
INSERT INTO room_furniture (room_id, furniture_id)
SELECT r.id, f.id FROM rooms r JOIN furniture f ON f.furniture_name IN ('Giường Queen Size','Smart TV 55 inch','Điều hòa Inverter','Máy sấy tóc','Vòi sen đứng','Bàn làm việc','Đèn ngủ đầu giường','Tủ quần áo','Ấm siêu tốc')
WHERE r.room_number IN ('104','105');

-- 106: Queen, TV, AC, HairDryer, Shower, WorkDesk, BedLamp, Wardrobe, LuggageRack, Kettle
INSERT INTO room_furniture (room_id, furniture_id)
SELECT r.id, f.id FROM rooms r JOIN furniture f ON f.furniture_name IN ('Giường Queen Size','Smart TV 55 inch','Điều hòa Inverter','Máy sấy tóc','Vòi sen đứng','Bàn làm việc','Đèn ngủ đầu giường','Tủ quần áo','Kệ hành lý','Ấm siêu tốc')
WHERE r.room_number = '106';

-- 201: Queen, TV, AC, Fridge, HairDryer, Shower, WorkDesk, CoffeeTable, Sofa, BedLamp, Wardrobe, LuggageRack, Kettle, CoffeeMaker
INSERT INTO room_furniture (room_id, furniture_id)
SELECT r.id, f.id FROM rooms r JOIN furniture f ON f.furniture_name IN ('Giường Queen Size','Smart TV 55 inch','Điều hòa Inverter','Tủ lạnh Minibar','Máy sấy tóc','Vòi sen đứng','Bàn làm việc','Bàn trà','Sofa 2 người','Đèn ngủ đầu giường','Tủ quần áo','Kệ hành lý','Ấm siêu tốc','Máy pha cà phê')
WHERE r.room_number = '201';

-- 202: King, TV, AC, Fridge, HairDryer, Shower, WorkDesk, CoffeeTable, Sofa, BedLamp, Wardrobe, LuggageRack, Kettle, CoffeeMaker
INSERT INTO room_furniture (room_id, furniture_id)
SELECT r.id, f.id FROM rooms r JOIN furniture f ON f.furniture_name IN ('Giường King Size','Smart TV 55 inch','Điều hòa Inverter','Tủ lạnh Minibar','Máy sấy tóc','Vòi sen đứng','Bàn làm việc','Bàn trà','Sofa 2 người','Đèn ngủ đầu giường','Tủ quần áo','Kệ hành lý','Ấm siêu tốc','Máy pha cà phê')
WHERE r.room_number = '202';

-- 203: Twin, TV, AC, Fridge, HairDryer, Shower, WorkDesk, CoffeeTable, Sofa, BedLamp, Wardrobe, LuggageRack, Kettle
INSERT INTO room_furniture (room_id, furniture_id)
SELECT r.id, f.id FROM rooms r JOIN furniture f ON f.furniture_name IN ('Giường đơn Twin','Smart TV 55 inch','Điều hòa Inverter','Tủ lạnh Minibar','Máy sấy tóc','Vòi sen đứng','Bàn làm việc','Bàn trà','Sofa 2 người','Đèn ngủ đầu giường','Tủ quần áo','Kệ hành lý','Ấm siêu tốc')
WHERE r.room_number = '203';

-- 204: Queen, TV, AC, Fridge, HairDryer, Shower, WorkDesk, Sofa, BedLamp, Wardrobe, Kettle
INSERT INTO room_furniture (room_id, furniture_id)
SELECT r.id, f.id FROM rooms r JOIN furniture f ON f.furniture_name IN ('Giường Queen Size','Smart TV 55 inch','Điều hòa Inverter','Tủ lạnh Minibar','Máy sấy tóc','Vòi sen đứng','Bàn làm việc','Sofa 2 người','Đèn ngủ đầu giường','Tủ quần áo','Ấm siêu tốc')
WHERE r.room_number = '204';

-- 301: King, TV, AC, Fridge, Safe, HairDryer, Bathtub, Shower, WorkDesk, CoffeeTable, Sofa, WorkChair, BedLamp, FloorLamp, Wardrobe, LuggageRack, Kettle, CoffeeMaker, Mirror, Painting
INSERT INTO room_furniture (room_id, furniture_id)
SELECT r.id, f.id FROM rooms r JOIN furniture f ON f.furniture_name IN ('Giường King Size','Smart TV 55 inch','Điều hòa Inverter','Tủ lạnh Minibar','Két sắt điện tử','Máy sấy tóc','Bồn tắm','Vòi sen đứng','Bàn làm việc','Bàn trà','Sofa 2 người','Ghế làm việc','Đèn ngủ đầu giường','Đèn cây góc phòng','Tủ quần áo','Kệ hành lý','Ấm siêu tốc','Máy pha cà phê','Gương toàn thân','Tranh trang trí')
WHERE r.room_number = '301';

-- 302: King, TV, AC, Fridge, Safe, HairDryer, Bathtub, Shower, WorkDesk, CoffeeTable, Sofa, BedLamp, FloorLamp, Wardrobe, LuggageRack, Kettle, CoffeeMaker, Mirror
INSERT INTO room_furniture (room_id, furniture_id)
SELECT r.id, f.id FROM rooms r JOIN furniture f ON f.furniture_name IN ('Giường King Size','Smart TV 55 inch','Điều hòa Inverter','Tủ lạnh Minibar','Két sắt điện tử','Máy sấy tóc','Bồn tắm','Vòi sen đứng','Bàn làm việc','Bàn trà','Sofa 2 người','Đèn ngủ đầu giường','Đèn cây góc phòng','Tủ quần áo','Kệ hành lý','Ấm siêu tốc','Máy pha cà phê','Gương toàn thân')
WHERE r.room_number = '302';

-- 303: Queen, Twin, TV, AC, Fridge, Safe, HairDryer, Shower, WorkDesk, CoffeeTable, Sofa, BedLamp, Wardrobe, LuggageRack, Kettle
INSERT INTO room_furniture (room_id, furniture_id)
SELECT r.id, f.id FROM rooms r JOIN furniture f ON f.furniture_name IN ('Giường Queen Size','Giường đơn Twin','Smart TV 55 inch','Điều hòa Inverter','Tủ lạnh Minibar','Két sắt điện tử','Máy sấy tóc','Vòi sen đứng','Bàn làm việc','Bàn trà','Sofa 2 người','Đèn ngủ đầu giường','Tủ quần áo','Kệ hành lý','Ấm siêu tốc')
WHERE r.room_number = '303';

-- 304: Queen, TV, AC, Fridge, Safe, HairDryer, Bathtub, Shower, WorkDesk, BedLamp, Wardrobe, LuggageRack, Kettle, CoffeeMaker, Mirror, Painting
INSERT INTO room_furniture (room_id, furniture_id)
SELECT r.id, f.id FROM rooms r JOIN furniture f ON f.furniture_name IN ('Giường Queen Size','Smart TV 55 inch','Điều hòa Inverter','Tủ lạnh Minibar','Két sắt điện tử','Máy sấy tóc','Bồn tắm','Vòi sen đứng','Bàn làm việc','Đèn ngủ đầu giường','Tủ quần áo','Kệ hành lý','Ấm siêu tốc','Máy pha cà phê','Gương toàn thân','Tranh trang trí')
WHERE r.room_number = '304';

-- 401, 402: King, TV, AC, Fridge, Safe, HairDryer, Bathtub, Shower, SmartWC, WorkDesk, CoffeeTable, Sofa, WorkChair, BedLamp, FloorLamp, Wardrobe, LuggageRack, Kettle, CoffeeMaker, Mirror, Painting
INSERT INTO room_furniture (room_id, furniture_id)
SELECT r.id, f.id FROM rooms r JOIN furniture f ON f.furniture_name IN ('Giường King Size','Smart TV 55 inch','Điều hòa Inverter','Tủ lạnh Minibar','Két sắt điện tử','Máy sấy tóc','Bồn tắm','Vòi sen đứng','Bồn cầu thông minh','Bàn làm việc','Bàn trà','Sofa 2 người','Ghế làm việc','Đèn ngủ đầu giường','Đèn cây góc phòng','Tủ quần áo','Kệ hành lý','Ấm siêu tốc','Máy pha cà phê','Gương toàn thân','Tranh trang trí')
WHERE r.room_number IN ('401','402');

-- 403: King, Twin, TV, AC, Fridge, Safe, HairDryer, Bathtub, Shower, SmartWC, WorkDesk, CoffeeTable, Sofa, BedLamp, FloorLamp, Wardrobe, LuggageRack, Kettle, CoffeeMaker, Mirror
INSERT INTO room_furniture (room_id, furniture_id)
SELECT r.id, f.id FROM rooms r JOIN furniture f ON f.furniture_name IN ('Giường King Size','Giường đơn Twin','Smart TV 55 inch','Điều hòa Inverter','Tủ lạnh Minibar','Két sắt điện tử','Máy sấy tóc','Bồn tắm','Vòi sen đứng','Bồn cầu thông minh','Bàn làm việc','Bàn trà','Sofa 2 người','Đèn ngủ đầu giường','Đèn cây góc phòng','Tủ quần áo','Kệ hành lý','Ấm siêu tốc','Máy pha cà phê','Gương toàn thân')
WHERE r.room_number = '403';

-- 501: King, TV, AC, Fridge, Safe, HairDryer, Bathtub, Shower, SmartWC, WorkDesk, CoffeeTable, Sofa, WorkChair, BedLamp, FloorLamp, Wardrobe, LuggageRack, Kettle, CoffeeMaker, Mirror, Painting
INSERT INTO room_furniture (room_id, furniture_id)
SELECT r.id, f.id FROM rooms r JOIN furniture f ON f.furniture_name IN ('Giường King Size','Smart TV 55 inch','Điều hòa Inverter','Tủ lạnh Minibar','Két sắt điện tử','Máy sấy tóc','Bồn tắm','Vòi sen đứng','Bồn cầu thông minh','Bàn làm việc','Bàn trà','Sofa 2 người','Ghế làm việc','Đèn ngủ đầu giường','Đèn cây góc phòng','Tủ quần áo','Kệ hành lý','Ấm siêu tốc','Máy pha cà phê','Gương toàn thân','Tranh trang trí')
WHERE r.room_number = '501';

-- 502: same as 501 but no Painting
INSERT INTO room_furniture (room_id, furniture_id)
SELECT r.id, f.id FROM rooms r JOIN furniture f ON f.furniture_name IN ('Giường King Size','Smart TV 55 inch','Điều hòa Inverter','Tủ lạnh Minibar','Két sắt điện tử','Máy sấy tóc','Bồn tắm','Vòi sen đứng','Bồn cầu thông minh','Bàn làm việc','Bàn trà','Sofa 2 người','Ghế làm việc','Đèn ngủ đầu giường','Đèn cây góc phòng','Tủ quần áo','Kệ hành lý','Ấm siêu tốc','Máy pha cà phê','Gương toàn thân')
WHERE r.room_number = '502';

-- 503: King, Twin, TV, AC, Fridge, Safe, HairDryer, Shower, WorkDesk, CoffeeTable, Sofa, BedLamp, Wardrobe, LuggageRack, Kettle
INSERT INTO room_furniture (room_id, furniture_id)
SELECT r.id, f.id FROM rooms r JOIN furniture f ON f.furniture_name IN ('Giường King Size','Giường đơn Twin','Smart TV 55 inch','Điều hòa Inverter','Tủ lạnh Minibar','Két sắt điện tử','Máy sấy tóc','Vòi sen đứng','Bàn làm việc','Bàn trà','Sofa 2 người','Đèn ngủ đầu giường','Tủ quần áo','Kệ hành lý','Ấm siêu tốc')
WHERE r.room_number = '503';

-- 504: King, Twin, TV, AC, Fridge, Safe, HairDryer, Shower, WorkDesk, CoffeeTable, Sofa, BedLamp, Wardrobe, LuggageRack, Kettle, CoffeeMaker
INSERT INTO room_furniture (room_id, furniture_id)
SELECT r.id, f.id FROM rooms r JOIN furniture f ON f.furniture_name IN ('Giường King Size','Giường đơn Twin','Smart TV 55 inch','Điều hòa Inverter','Tủ lạnh Minibar','Két sắt điện tử','Máy sấy tóc','Vòi sen đứng','Bàn làm việc','Bàn trà','Sofa 2 người','Đèn ngủ đầu giường','Tủ quần áo','Kệ hành lý','Ấm siêu tốc','Máy pha cà phê')
WHERE r.room_number = '504';

-- ============================================================
-- 4. VOUCHERS
-- ============================================================
INSERT INTO vouchers (code, discount_percent, max_discount, min_booking_value, usage_limit, used_count, start_date, end_date) VALUES
('WELCOME10',  10,  200000,  500000, 100, 23,  '2026-01-01 00:00:00', '2026-12-31 23:59:00'),
('SUMMER20',   20,  500000, 1000000,  50, 31,  '2026-05-01 00:00:00', '2026-08-31 23:59:00'),
('VIP30',      30, 1500000, 3000000,  20,  7,  '2026-01-01 00:00:00', '2026-12-31 23:59:00'),
('HOLIDAY15',  15,  300000,  800000, 200, 89,  '2026-04-25 00:00:00', '2026-05-10 23:59:00'),
('FLASH50',    50, 1000000, 2000000,  10, 10,  '2026-03-01 00:00:00', '2026-03-31 23:59:00'),
('NEWMEMBER',   5,  100000,  300000, 500, 142, '2025-06-01 00:00:00', '2026-12-31 23:59:00');

-- ============================================================
-- 5. BOOKINGS
-- DataSeeder tạo users: customer (CUSTOMER), staff (STAFF), manager (MANAGER), admin (ADMIN)
-- ============================================================
SET @cust_id = (SELECT id FROM users WHERE username = 'customer');

INSERT INTO bookings (customer_id, voucher_id, check_in_date, check_out_date, num_nights, num_guests, extra_charge, total_price, status, payment_method, payment_date, created_at, updated_at) VALUES
-- CHECKED_OUT
(@cust_id, (SELECT id FROM vouchers WHERE code='WELCOME10'), '2026-01-10 14:00:00', '2026-01-13 12:00:00', 3, 2, 0,  2160000, 'CHECKED_OUT', 'BANK',   '2026-01-10 14:30:00', '2026-01-10 14:00:00', '2026-01-13 12:00:00'),
(@cust_id, NULL,                                             '2026-02-05 14:00:00', '2026-02-08 12:00:00', 3, 2, 0,  3600000, 'CHECKED_OUT', 'CASH',   '2026-02-05 15:00:00', '2026-02-05 14:00:00', '2026-02-08 12:00:00'),
(@cust_id, (SELECT id FROM vouchers WHERE code='SUMMER20'),  '2026-03-15 14:00:00', '2026-03-18 12:00:00', 3, 2, 0,  4320000, 'CHECKED_OUT', 'WALLET', '2026-03-15 14:20:00', '2026-03-15 14:00:00', '2026-03-18 12:00:00'),
(@cust_id, NULL,                                             '2026-04-01 14:00:00', '2026-04-05 12:00:00', 4, 2, 0, 20000000, 'CHECKED_OUT', 'BANK',   '2026-04-01 14:00:00', '2026-04-01 14:00:00', '2026-04-05 12:00:00'),
(@cust_id, (SELECT id FROM vouchers WHERE code='VIP30'),     '2026-04-20 14:00:00', '2026-04-23 12:00:00', 3, 2, 0,  5880000, 'CHECKED_OUT', 'BANK',   '2026-04-20 14:00:00', '2026-04-20 14:00:00', '2026-04-23 12:00:00'),
-- CHECKED_IN
(@cust_id, NULL, '2026-06-02 14:00:00', '2026-06-05 12:00:00', 3, 2, 0, 5400000, 'CHECKED_IN', 'CASH',   '2026-06-02 14:30:00', '2026-06-02 14:00:00', NOW()),
(@cust_id, NULL, '2026-06-01 14:00:00', '2026-06-04 12:00:00', 3, 2, 0, 8400000, 'CHECKED_IN', 'BANK',   '2026-06-01 14:00:00', '2026-06-01 14:00:00', NOW()),
-- CONFIRMED
(@cust_id, NULL,                                             '2026-06-10 14:00:00', '2026-06-13 12:00:00', 3, 2, 0,  3600000, 'CONFIRMED', 'BANK',   '2026-06-01 10:00:00', '2026-06-01 10:00:00', NOW()),
(@cust_id, (SELECT id FROM vouchers WHERE code='WELCOME10'), '2026-06-15 14:00:00', '2026-06-18 12:00:00', 3, 4, 0,  9450000, 'CONFIRMED', 'WALLET', '2026-06-03 09:00:00', '2026-06-03 09:00:00', NOW()),
-- PENDING
(@cust_id, NULL, '2026-07-01 14:00:00', '2026-07-03 12:00:00', 2, 1, 0, 1600000, 'PENDING', 'BANK', NULL, NOW(), NOW()),
-- CANCELLED
(@cust_id, NULL, '2026-05-01 14:00:00', '2026-05-03 12:00:00', 2, 2, 0, 2400000, 'CANCELLED', 'WALLET', NULL, '2026-04-25 10:00:00', NOW()),
-- REFUNDED
(@cust_id, NULL, '2026-05-10 14:00:00', '2026-05-12 12:00:00', 2, 2, 0, 1600000, 'REFUNDED', 'BANK', '2026-05-10 14:00:00', '2026-05-10 14:00:00', NOW());

-- ============================================================
-- 6. BOOKING DETAILS
-- Booking order: 1=101, 2=201, 3=301, 4=501, 5=401, 6=302, 7=402, 8=202, 9=503, 10=101, 11=201, 12=102
-- ============================================================
SET @b1  = (SELECT id FROM bookings WHERE customer_id=@cust_id AND check_in_date='2026-01-10 14:00:00');
SET @b2  = (SELECT id FROM bookings WHERE customer_id=@cust_id AND check_in_date='2026-02-05 14:00:00');
SET @b3  = (SELECT id FROM bookings WHERE customer_id=@cust_id AND check_in_date='2026-03-15 14:00:00');
SET @b4  = (SELECT id FROM bookings WHERE customer_id=@cust_id AND check_in_date='2026-04-01 14:00:00');
SET @b5  = (SELECT id FROM bookings WHERE customer_id=@cust_id AND check_in_date='2026-04-20 14:00:00');
SET @b6  = (SELECT id FROM bookings WHERE customer_id=@cust_id AND check_in_date='2026-06-02 14:00:00');
SET @b7  = (SELECT id FROM bookings WHERE customer_id=@cust_id AND check_in_date='2026-06-01 14:00:00');
SET @b8  = (SELECT id FROM bookings WHERE customer_id=@cust_id AND check_in_date='2026-06-10 14:00:00');
SET @b9  = (SELECT id FROM bookings WHERE customer_id=@cust_id AND check_in_date='2026-06-15 14:00:00');
SET @b10 = (SELECT id FROM bookings WHERE customer_id=@cust_id AND check_in_date='2026-07-01 14:00:00');
SET @b11 = (SELECT id FROM bookings WHERE customer_id=@cust_id AND check_in_date='2026-05-01 14:00:00');
SET @b12 = (SELECT id FROM bookings WHERE customer_id=@cust_id AND check_in_date='2026-05-10 14:00:00');

INSERT INTO booking_details (booking_id, room_id) VALUES
(@b1,  (SELECT id FROM rooms WHERE room_number='101')),
(@b2,  (SELECT id FROM rooms WHERE room_number='201')),
(@b3,  (SELECT id FROM rooms WHERE room_number='301')),
(@b4,  (SELECT id FROM rooms WHERE room_number='501')),
(@b5,  (SELECT id FROM rooms WHERE room_number='401')),
(@b6,  (SELECT id FROM rooms WHERE room_number='302')),
(@b7,  (SELECT id FROM rooms WHERE room_number='402')),
(@b8,  (SELECT id FROM rooms WHERE room_number='202')),
(@b9,  (SELECT id FROM rooms WHERE room_number='503')),
(@b10, (SELECT id FROM rooms WHERE room_number='101')),
(@b11, (SELECT id FROM rooms WHERE room_number='201')),
(@b12, (SELECT id FROM rooms WHERE room_number='102'));

-- ============================================================
-- 7. REVIEWS  (chỉ cho các booking CHECKED_OUT)
-- ============================================================
SET @mgr_id = (SELECT id FROM users WHERE username = 'manager');

INSERT INTO reviews (customer_id, booking_id, rating, comment, staff_reply, replied_by, replied_at, created_at, updated_at) VALUES
(@cust_id, @b1, 5,
 'Phòng cực kỳ sạch sẽ và sang trọng! Nhân viên phục vụ tận tình chu đáo, bữa sáng buffet đa dạng. Sẽ quay lại lần sau!',
 'Cảm ơn quý khách! Chúng tôi rất vui khi được phục vụ. Hẹn gặp lại!',
 @mgr_id, '2026-01-14 09:00:00', '2026-01-14 08:00:00', '2026-01-14 09:00:00'),

(@cust_id, @b2, 4,
 'Phòng đẹp, vị trí trung tâm rất thuận tiện. Điều hòa hơi ồn lúc ban đêm nhưng không ảnh hưởng nhiều. Giá cả hợp lý so với chất lượng nhận được.',
 'Cảm ơn phản hồi! Chúng tôi đã ghi nhận vấn đề điều hòa và sẽ kiểm tra, bảo trì ngay.',
 @mgr_id, '2026-02-10 10:00:00', '2026-02-09 08:00:00', '2026-02-10 10:00:00'),

(@cust_id, @b3, 5,
 'Phòng Deluxe thực sự xứng đáng với giá tiền! Bồn tắm view thành phố ban đêm tuyệt vời. Dịch vụ butler chu đáo, luôn đáp ứng đúng nhu cầu.',
 'Trân trọng cảm ơn! Rất vinh dự được đón tiếp quý khách. Đặc biệt dành ưu đãi thành viên thân thiết cho lần tiếp theo!',
 @mgr_id, '2026-03-20 09:00:00', '2026-03-19 08:00:00', '2026-03-20 09:00:00'),

(@cust_id, @b4, 5,
 'Presidential Suite hoàn hảo tuyệt đối! Sân thượng riêng view 360° quá đẹp, bể ngâm sục tuyệt vời. Đây là kỳ nghỉ đáng nhớ nhất của chúng tôi!',
 'Trân trọng cảm ơn quý khách VIP! Chúng tôi rất vinh dự. Luôn chào đón quý khách trở lại!',
 @mgr_id, '2026-04-07 09:00:00', '2026-04-06 08:00:00', '2026-04-07 09:00:00'),

(@cust_id, @b5, 3,
 'Phòng VIP ổn nhưng chưa đạt kỳ vọng với mức giá này. WiFi khá chậm vào buổi tối, nhân viên phản hồi đôi khi chậm. Hy vọng cải thiện hơn.',
 NULL, NULL, NULL, '2026-04-25 10:00:00', '2026-04-25 10:00:00');

-- ============================================================
-- 8. HOUSEKEEPING LOGS
-- ============================================================
SET @staff_id = (SELECT id FROM users WHERE username = 'staff');

INSERT INTO housekeeping_logs (room_id, staff_id, start_time, end_time, notes, status, priority) VALUES
((SELECT id FROM rooms WHERE room_number='101'), @staff_id, '2026-06-02 08:00:00', '2026-06-02 09:30:00',
 'Dọn phòng sau check-out. Thay toàn bộ ga, gối, khăn. Vệ sinh phòng tắm. Bổ sung amenities đầy đủ.',
 'COMPLETED', 'NORMAL'),

((SELECT id FROM rooms WHERE room_number='104'), @staff_id, '2026-06-03 09:00:00', NULL,
 'Phòng dirty sau check-out lúc 8h. Cần dọn gấp chuẩn bị cho booking 14h.',
 'IN_PROGRESS', 'HIGH'),

((SELECT id FROM rooms WHERE room_number='105'), @staff_id, '2026-06-03 08:30:00', '2026-06-03 10:00:00',
 'Dọn định kỳ sáng. Phát hiện bóng đèn phòng tắm bị cháy, đã thay mới.',
 'COMPLETED', 'NORMAL'),

((SELECT id FROM rooms WHERE room_number='202'), @staff_id, '2026-06-01 19:00:00', '2026-06-01 19:45:00',
 'Turn-down service buổi tối: gấp chăn hình thú, đặt chocolate hộp, bổ sung nước khoáng và hoa quả.',
 'COMPLETED', 'NORMAL'),

((SELECT id FROM rooms WHERE room_number='301'), @staff_id, '2026-05-31 10:00:00', '2026-05-31 12:00:00',
 'Deep cleaning định kỳ tuần. Vệ sinh bồn tắm, kính cửa, làm sạch dàn lạnh. Xịt khử khuẩn toàn phòng bằng máy phun sương.',
 'COMPLETED', 'NORMAL'),

((SELECT id FROM rooms WHERE room_number='401'), @staff_id, '2026-06-03 11:00:00', NULL,
 'Chuẩn bị VIP welcome: setup hoa tươi hồng nhập khẩu, rượu Champagne, trái cây theo mùa, thư chào mừng.',
 'PENDING', 'HIGH'),

((SELECT id FROM rooms WHERE room_number='502'), @staff_id, '2026-06-02 13:00:00', '2026-06-02 15:00:00',
 'Dọn Executive Suite sau sự kiện họp công ty. Vệ sinh bảng họp, thu dọn đồ ăn, khử mùi thức ăn.',
 'COMPLETED', 'URGENT'),

((SELECT id FROM rooms WHERE room_number='503'), @staff_id, '2026-06-03 10:30:00', NULL,
 'Chuẩn bị Family Suite cho đoàn 6 người có 2 trẻ em. Setup cũi em bé, ghế ăn dặm, đồ chơi an toàn.',
 'IN_PROGRESS', 'HIGH');

-- ============================================================
-- 9. INCIDENTS
-- ============================================================
INSERT INTO incidents (room_id, staff_id, furniture_id, incident_type, description, status, manager_note, decided_at, resolution_note, resolved_at, created_at, updated_at) VALUES
((SELECT id FROM rooms WHERE room_number='302'), @staff_id, (SELECT id FROM furniture WHERE furniture_name='Smart TV 55 inch'),
 'DAMAGED',
 'Smart TV 55 inch phòng 302 màn hình vỡ góc trái. Phát hiện khi setup phòng cho khách mới. Nghi do vật cứng va chạm. Cần liên hệ Samsung service để thay màn hình.',
 'APPROVED', 'Đã phê duyệt. Liên hệ Samsung service center, dự kiến sửa trong 3 ngày.',
 '2026-05-24 10:00:00', NULL, NULL, NOW(), NOW()),

((SELECT id FROM rooms WHERE room_number='401'), @staff_id, (SELECT id FROM furniture WHERE furniture_name='Bồn tắm'),
 'DAMAGED',
 'Bồn tắm phòng 401 bị nứt góc phải, nước rò rỉ thấm xuống trần phòng 301. Cần xử lý khẩn cấp. Đã đặt xô hứng nước tạm thời.',
 'FIXING', NULL, NULL, NULL, NULL, NOW(), NOW()),

((SELECT id FROM rooms WHERE room_number='204'), @staff_id, (SELECT id FROM furniture WHERE furniture_name='Điều hòa Inverter'),
 'DAMAGED',
 'Điều hòa phòng 204 không lạnh, kiểm tra phát hiện hết gas hoàn toàn. Cần nạp gas R32 và vệ sinh dàn lạnh. Phòng đang trạng thái MAINTAIN.',
 'PENDING', NULL, NULL, NULL, NULL, NOW(), NOW()),

((SELECT id FROM rooms WHERE room_number='103'), @staff_id, (SELECT id FROM furniture WHERE furniture_name='Két sắt điện tử'),
 'MISSING',
 'Két sắt điện tử phòng 103 không tìm thấy sau khi khách check-out. Đã kiểm tra khu vực phòng và hành lang nhưng không có.',
 'REJECTED',
 'Xem camera: két sắt được gắn cố định bằng bu-lông vào tường, không thể tháo rời. Xác nhận không bị mất. Đóng ticket, nhắc nhở staff kiểm tra kỹ hơn trước khi báo cáo.',
 '2026-05-29 10:00:00', NULL, NULL, NOW(), NOW()),

((SELECT id FROM rooms WHERE room_number='502'), @staff_id, (SELECT id FROM furniture WHERE furniture_name='Máy pha cà phê'),
 'DAMAGED',
 'Máy pha cà phê Nespresso phòng 502 hỏng bơm áp suất, không thể pha. Đã thông báo khách và mang lên máy thay thế tạm thời.',
 'FIXED', NULL, NULL,
 'Đã thay máy pha cà phê mới cùng model. Khách hài lòng với xử lý nhanh chóng.',
 '2026-06-01 15:00:00', NOW(), NOW()),

((SELECT id FROM rooms WHERE room_number='301'), @staff_id, (SELECT id FROM furniture WHERE furniture_name='Giường King Size'),
 'DAMAGED',
 'Giường King Size phòng 301 gãy 1 chân gỗ phía cuối, nệm bị nghiêng. Phát hiện khi dọn phòng sau check-out. Không rõ nguyên nhân.',
 'PENDING', NULL, NULL, NULL, NULL, NOW(), NOW());

-- ============================================================
-- 10. AI KNOWLEDGE BASE
-- ============================================================
SET @admin_id = (SELECT id FROM users WHERE username = 'admin');

INSERT INTO ai_knowledge_base (admin_id, question_pattern, answer_content) VALUES
(@admin_id,
 'giờ check-in check-out | mấy giờ nhận phòng | mấy giờ trả phòng | checkin lúc mấy giờ',
 'Giờ nhận phòng (Check-in): 14:00. Giờ trả phòng (Check-out): 12:00. Quý khách có thể yêu cầu Early Check-in (từ 8:00, phụ thu 50%) hoặc Late Check-out (đến 16:00, phụ thu 50%) tùy tình trạng phòng trống. Vui lòng thông báo trước để chúng tôi sắp xếp.'),

(@admin_id,
 'thanh toán | phương thức thanh toán | có nhận thẻ không | thanh toán bằng gì | vnpay momo',
 'LuxeStay chấp nhận: (1) Chuyển khoản ngân hàng, (2) Ví điện tử MoMo/ZaloPay/VNPay, (3) Tiền mặt tại quầy lễ tân. Có thể thanh toán online lúc đặt phòng hoặc trực tiếp khi check-in. Xuất hóa đơn VAT theo yêu cầu.'),

(@admin_id,
 'hủy phòng | hủy đặt | hoàn tiền | chính sách hủy | cancel booking',
 'Chính sách hủy phòng LuxeStay: Hủy trước 48 giờ check-in → hoàn 100%. Hủy 24–48 giờ → hoàn 50%. Hủy trong vòng 24 giờ → không hoàn tiền. Trường hợp bất khả kháng (thiên tai, bệnh viện) liên hệ lễ tân để được hỗ trợ riêng.'),

(@admin_id,
 'tiện ích | dịch vụ | hồ bơi | gym | spa | có những gì',
 'LuxeStay cung cấp đầy đủ tiện ích 5 sao: Hồ bơi vô cực tầng 6 (6:00–22:00), Phòng gym hiện đại 24/7, Spa & Wellness Center (9:00–21:00), Nhà hàng The Grand (6:00–22:00), Rooftop Bar (17:00–24:00), Business Center, Dịch vụ giặt là 24/7, Xe đưa đón sân bay (đặt trước 2 tiếng).'),

(@admin_id,
 'bữa sáng | breakfast | ăn sáng | có bữa sáng không | buffet',
 'Bữa sáng buffet tại nhà hàng The Grand: 6:30–10:00 hàng ngày. Phòng Suite và Family bao gồm bữa sáng miễn phí. Các loại phòng khác thêm 150.000đ/người/ngày. Thực đơn đa dạng Âu–Á hơn 50 món, đổi thực đơn mỗi ngày.'),

(@admin_id,
 'wifi | mật khẩu wifi | internet | tốc độ mạng',
 'WiFi miễn phí tốc độ cao toàn khách sạn: Tên mạng LuxeStay_Guest, mật khẩu ghi trong thẻ thông tin phòng hoặc hỏi lễ tân. Tốc độ 500Mbps, hỗ trợ nhiều thiết bị. Phòng VIP/Suite có mạng riêng LuxeStay_Premium tốc độ 1Gbps.'),

(@admin_id,
 'thú cưng | mang chó | mang mèo | pet | vật nuôi',
 'LuxeStay rất tiếc không nhận thú cưng để đảm bảo vệ sinh và sức khỏe cho toàn thể khách lưu trú. Nếu cần, chúng tôi có thể giới thiệu dịch vụ giữ thú cưng uy tín trong bán kính 500m từ khách sạn.'),

(@admin_id,
 'phòng gia đình | phòng nhiều người | trẻ em | em bé | cũi',
 'LuxeStay có phòng Family Suite tầng 5 (503–504) cho 4–6 người, gồm 3 phòng ngủ riêng biệt. Trẻ dưới 6 tuổi miễn phí (ngủ chung giường bố mẹ). Trẻ 6–12 tuổi phụ thu 200.000đ/đêm. Cũi em bé, ghế ăn dặm, đồ chơi an toàn được cung cấp miễn phí khi yêu cầu trước.'),

(@admin_id,
 'đậu xe | bãi xe | parking | gửi xe | phí gửi xe',
 'Bãi đậu xe ngầm 100 chỗ, camera 24/7, bảo vệ thường trực. Miễn phí 24 giờ đầu cho khách lưu trú. Từ ngày thứ 2: xe máy 30.000đ/đêm, ô tô 80.000đ/đêm. Xe điện có 5 trụ sạc miễn phí.'),

(@admin_id,
 'địa chỉ | ở đâu | vị trí | cách sân bay | đường đi',
 'LuxeStay Hotel: 123 Nguyễn Huệ, Quận 1, TP.HCM. Cách sân bay Tân Sơn Nhất 7km (15–25 phút). Cách Bến Thành 500m, phố đi bộ Nguyễn Huệ 200m. Xe đưa đón sân bay 250.000đ/lượt — đặt trước 2 tiếng qua lễ tân hoặc app.');
