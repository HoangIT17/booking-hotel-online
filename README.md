# Booking Hotel Online

Booking Hotel Online là hệ thống đặt phòng khách sạn full-stack, gồm backend Spring Boot và frontend React Vite. Dự án hỗ trợ khách hàng tìm phòng, đặt phòng, thanh toán, quản lý lịch sử đặt phòng; đồng thời cung cấp các màn hình vận hành cho Admin, Manager, Receptionist và Staff.

## Tính năng nổi bật

- **Xác thực và phân quyền theo role**: đăng ký, đăng nhập JWT, OAuth2 Google/Facebook, đổi mật khẩu, bảo vệ route theo các role `CUSTOMER`, `ADMIN`, `MANAGER`, `RECEPTIONIST`, `STAFF`.
- **Khách hàng**: xem trang chủ, tìm phòng trống theo ngày/số khách, xem chi tiết phòng, xem ưu đãi, tạo booking, thanh toán VNPAY, theo dõi lịch sử đặt phòng và gửi review sau khi hoàn tất lưu trú.
- **Quản trị hệ thống**: Admin quản lý người dùng, phòng, nội thất, booking, voucher, review, chatbot knowledge, lịch sử chat và báo cáo sự cố.
- **Quản lý khách sạn**: Manager quản lý phòng, nội thất, booking, voucher, review, sự cố và báo cáo hư hỏng/mất mát.
- **Lễ tân và buồng phòng**: Receptionist quản lý booking, tạo yêu cầu dọn phòng; Staff xem danh sách phòng cần dọn, nhận việc, cập nhật trạng thái phòng và báo cáo sự cố/nội thất hư hỏng.
- **Chatbot AI**: customer hỏi chatbot, admin quản lý kho tri thức AI và lịch sử hỏi đáp; backend tích hợp Gemini API.
- **Hồ sơ cá nhân**: mỗi role có trang xem/sửa profile, avatar và đổi mật khẩu.

## Công nghệ sử dụng

- **Backend**: Java 21, Spring Boot 3, Spring Security, JWT, OAuth2 Client, Spring Data JPA, MySQL, Lombok, MapStruct/ModelMapper.
- **Frontend**: React 19, Vite, React Router, Redux Toolkit, Axios, Bootstrap, Lucide React, React Hook Form, Toast/SweetAlert.
- **Tích hợp ngoài**: Gemini API cho chatbot AI, VNPAY sandbox cho thanh toán, upload ảnh phòng/avatar.

## Cấu trúc source code

```text
booking_hotel_backend/     Backend Spring Boot, REST API, security, service, repository, entity
booking_hotel_frontend/    Frontend React Vite, routes, layouts, pages, components, redux, services
uploads/                   Thư mục upload ảnh mẫu
docs/                      Tài liệu thiết kế, wireframe, API flow
```

## Hướng dẫn chạy dự án

### 1. Backend

Mở file cấu hình:

```text
booking_hotel_backend/src/main/resources/application.properties
```

Thiết lập database MySQL:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/booking_hotel
spring.datasource.username=root
spring.datasource.password=your_password
```

Thiết lập API Gemini:

```properties
gemini.api.key=your_gemini_api_key
```

Sau đó chạy backend bằng IDE hoặc Maven:

```bash
cd booking_hotel_backend
./mvnw spring-boot:run
```

Trên Windows có thể dùng:

```bash
mvnw.cmd spring-boot:run
```

Backend mặc định chạy tại `http://localhost:8080`.

### 2. Frontend

Cài đặt các thư viện React/Vite cần thiết:

```bash
cd booking_hotel_frontend
npm i
```

Chạy frontend:

```bash
npm run dev
```

Frontend mặc định chạy tại `http://localhost:5173`.

## Tài khoản mẫu

Khi database rỗng, backend sẽ tự tạo 5 tài khoản test, tất cả dùng mật khẩu `123123`:

| Role | Username |
| --- | --- |
| Admin | `admin` |
| Manager | `manager` |
| Receptionist | `receptionist` |
| Staff | `staff` |
| Customer | `customer` |

## Ghi chú

Cần tạo database MySQL `booking_hotel` trước khi chạy backend. Frontend gọi API qua `http://localhost:8080/api/v1`, nên backend cần được chạy trước để các trang có dữ liệu hoạt động đầy đủ.
