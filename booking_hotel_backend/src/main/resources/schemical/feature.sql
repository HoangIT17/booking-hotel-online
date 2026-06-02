-- thêm feature ms thm dc permision nhé

use booking_hotel;
INSERT INTO features (feature_name, feature_code, description, created_at, updated_at) VALUES
                                                                                           ('Quản lý người dùng', 'USER_CRUD', 'Thêm, sửa, xóa, tìm kiếm người dùng (Admin)', NOW(), NOW()),
                                                                                           ('Quản lý AI Chatbot', 'AI_CHATBOT_CRUD', 'Cấu hình, training và xem lịch sử hội thoại AI', NOW(), NOW()),
                                                                                           ('Quản lý loại phòng', 'ROOM_TYPE_CRUD', 'CRUD và tìm kiếm danh mục loại phòng', NOW(), NOW()),
                                                                                           ('Quản lý phòng & Nội thất', 'ROOM_CRUD', 'CRUD, tìm kiếm, lọc danh sách phòng và nội thất', NOW(), NOW()),
                                                                                           ('Xem chi tiết phòng', 'ROOM_DETAIL_VIEW', 'Xem thông tin chi tiết phòng (Public)', NOW(), NOW()),
                                                                                           ('Quản lý đơn đặt phòng', 'BOOKING_CRUD', 'Tạo, sửa, hủy đơn đặt phòng', NOW(), NOW()),
                                                                                           ('Xem danh sách đặt phòng', 'BOOKING_VIEW', 'Xem danh sách và bộ lọc đặt phòng', NOW(), NOW()),
                                                                                           ('Xác nhận trạng thái Booking', 'BOOKING_STATUS_UPDATE', 'Confirm, Check-in, Check-out', NOW(), NOW()),
                                                                                           ('Quản lý Hóa đơn/Thanh toán', 'INVOICE_CRUD', 'Xử lý thanh toán, xem và xuất hóa đơn', NOW(), NOW()),
                                                                                           ('Tạo phiếu dọn dẹp', 'CLEANING_CREATE', 'Tạo yêu cầu dọn dẹp phòng', NOW(), NOW()),
                                                                                           ('Xem danh sách dọn dẹp', 'CLEANING_VIEW', 'Xem danh sách các phòng cần dọn', NOW(), NOW()),
                                                                                           ('Cập nhật trạng thái dọn dẹp', 'CLEANING_UPDATE', 'Cập nhật trạng thái từ In_Progress sang Complete', NOW(), NOW()),
                                                                                           ('Tạo báo cáo sự cố', 'INCIDENT_CREATE', 'Staff báo cáo hỏng hóc thiết bị', NOW(), NOW()),
                                                                                           ('Xem danh sách sự cố', 'INCIDENT_VIEW', 'Xem danh sách báo cáo sự cố', NOW(), NOW()),
                                                                                           ('Xử lý/Duyệt sự cố', 'INCIDENT_UPDATE', 'Manager cập nhật trạng thái sự cố', NOW(), NOW()),
                                                                                           ('Quản lý Voucher', 'VOUCHER_CRUD', 'CRUD và tìm kiếm mã giảm giá', NOW(), NOW()),
                                                                                           ('Quản lý đánh giá', 'REVIEW_CRUD', 'CRUD và phản hồi đánh giá khách hàng', NOW(), NOW()),
                                                                                           ('Báo cáo doanh thu', 'REVENUE_REPORT', 'Xem báo cáo và thống kê doanh thu', NOW(), NOW());
INSERT INTO features (feature_name, feature_code, description, created_at, updated_at) VALUES
                                                                                           ('Đăng ký tài khoản', 'AUTH_REGISTER', 'Cho phép khách hàng đăng ký tài khoản mới', NOW(), NOW()),
                                                                                           ('Đăng nhập hệ thống', 'AUTH_LOGIN', 'Cho phép người dùng đăng nhập', NOW(), NOW()),
                                                                                           ('Quản lý thông tin cá nhân', 'PROFILE_MANAGEMENT', 'Xem profile, sửa thông tin và đổi mật khẩu', NOW(), NOW());