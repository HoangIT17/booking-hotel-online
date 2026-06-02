USE booking_hotel;

-- Giả sử ID feature từ 1 đến 21 tương ứng với thứ tự insert của bạn
-- 1:USER_CRUD, 2:AI_CHATBOT_CRUD, ..., 21:PROFILE_MANAGEMENT

-- 1. CẤP QUYỀN CHO ADMIN (Full quyền)
INSERT INTO permissions (role_id, feature_id, is_allowed, updated_at)
SELECT 1, id, true, NOW() FROM features;

-- 2. CẤP QUYỀN CHO MANAGER (Gần full, trừ User/AI)
INSERT INTO permissions (role_id, feature_id, is_allowed, updated_at)
SELECT 2, id, true, NOW() FROM features
WHERE feature_code NOT IN ('USER_CRUD', 'AI_CHATBOT_CRUD');

-- 3. CẤP QUYỀN CHO RECEPTIONIST
INSERT INTO permissions (role_id, feature_id, is_allowed, updated_at)
SELECT 3, id, true, NOW() FROM features
WHERE feature_code IN (
                       'ROOM_DETAIL_VIEW', 'BOOKING_CRUD', 'BOOKING_VIEW',
                       'BOOKING_STATUS_UPDATE', 'INVOICE_CRUD', 'CLEANING_CREATE', 'CLEANING_VIEW'
    );

-- 4. CẤP QUYỀN CHO STAFF
INSERT INTO permissions (role_id, feature_id, is_allowed, updated_at)
SELECT 4, id, true, NOW() FROM features
WHERE feature_code IN (
                       'ROOM_DETAIL_VIEW', 'CLEANING_VIEW', 'CLEANING_UPDATE',
                       'INCIDENT_CREATE', 'INCIDENT_VIEW'
    );

-- 5. CẤP QUYỀN CHO CUSTOMER
INSERT INTO permissions (role_id, feature_id, is_allowed, updated_at)
SELECT 5, id, true, NOW() FROM features
WHERE feature_code IN (
                       'ROOM_DETAIL_VIEW', 'BOOKING_CRUD', 'BOOKING_VIEW',
                       'REVIEW_CRUD', 'PROFILE_MANAGEMENT'
    );