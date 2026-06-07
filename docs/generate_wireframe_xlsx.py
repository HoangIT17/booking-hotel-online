from zipfile import ZipFile, ZIP_DEFLATED
from html import escape
from pathlib import Path

OUT = Path(__file__).with_name("hotel_wireframe_design.xlsx")


def col_name(n):
    s = ""
    while n:
        n, r = divmod(n - 1, 26)
        s = chr(65 + r) + s
    return s


def ref(row, col):
    return f"{col_name(col)}{row}"


STYLES = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <fonts count="6">
    <font><sz val="11"/><name val="Calibri"/></font>
    <font><b/><sz val="18"/><color rgb="FFFFFFFF"/><name val="Calibri"/></font>
    <font><b/><sz val="11"/><color rgb="FFFFFFFF"/><name val="Calibri"/></font>
    <font><sz val="10"/><name val="Consolas"/></font>
    <font><b/><sz val="13"/><color rgb="FF1F2937"/><name val="Calibri"/></font>
    <font><i/><sz val="10"/><color rgb="FF6B7280"/><name val="Calibri"/></font>
  </fonts>
  <fills count="8">
    <fill><patternFill patternType="none"/></fill>
    <fill><patternFill patternType="gray125"/></fill>
    <fill><patternFill patternType="solid"><fgColor rgb="FF111827"/></patternFill></fill>
    <fill><patternFill patternType="solid"><fgColor rgb="FF2563EB"/></patternFill></fill>
    <fill><patternFill patternType="solid"><fgColor rgb="FFE5E7EB"/></patternFill></fill>
    <fill><patternFill patternType="solid"><fgColor rgb="FFF3F4F6"/></patternFill></fill>
    <fill><patternFill patternType="solid"><fgColor rgb="FFDCFCE7"/></patternFill></fill>
    <fill><patternFill patternType="solid"><fgColor rgb="FFFEF3C7"/></patternFill></fill>
  </fills>
  <borders count="3">
    <border><left/><right/><top/><bottom/><diagonal/></border>
    <border><left style="thin"><color rgb="FFD1D5DB"/></left><right style="thin"><color rgb="FFD1D5DB"/></right><top style="thin"><color rgb="FFD1D5DB"/></top><bottom style="thin"><color rgb="FFD1D5DB"/></bottom></border>
    <border><left style="medium"><color rgb="FF374151"/></left><right style="medium"><color rgb="FF374151"/></right><top style="medium"><color rgb="FF374151"/></top><bottom style="medium"><color rgb="FF374151"/></bottom></border>
  </borders>
  <cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>
  <cellXfs count="9">
    <xf numFmtId="0" fontId="0" fillId="0" borderId="1" xfId="0"><alignment vertical="top"/></xf>
    <xf numFmtId="0" fontId="1" fillId="2" borderId="1" xfId="0" applyFont="1" applyFill="1"><alignment horizontal="center" vertical="center"/></xf>
    <xf numFmtId="0" fontId="2" fillId="3" borderId="1" xfId="0" applyFont="1" applyFill="1"><alignment horizontal="center" vertical="center" wrapText="1"/></xf>
    <xf numFmtId="0" fontId="0" fillId="0" borderId="1" xfId="0"><alignment vertical="top" wrapText="1"/></xf>
    <xf numFmtId="0" fontId="4" fillId="4" borderId="1" xfId="0" applyFont="1" applyFill="1"><alignment vertical="center" wrapText="1"/></xf>
    <xf numFmtId="0" fontId="3" fillId="5" borderId="2" xfId="0" applyFont="1" applyFill="1"><alignment vertical="top" wrapText="1"/></xf>
    <xf numFmtId="0" fontId="5" fillId="0" borderId="1" xfId="0" applyFont="1"><alignment vertical="top" wrapText="1"/></xf>
    <xf numFmtId="0" fontId="0" fillId="6" borderId="1" xfId="0" applyFill="1"><alignment vertical="top" wrapText="1"/></xf>
    <xf numFmtId="0" fontId="0" fillId="7" borderId="1" xfId="0" applyFill="1"><alignment vertical="top" wrapText="1"/></xf>
  </cellXfs>
  <cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles>
</styleSheet>"""


def sheet_xml(rows, widths=None, merges=None, heights=None, freeze=True):
    widths = widths or {}
    merges = merges or []
    heights = heights or {}
    max_col = max((c for row in rows for c, _, _ in row), default=1)
    cols = "<cols>" + "".join(
        f'<col min="{i}" max="{i}" width="{widths.get(i, 18)}" customWidth="1"/>'
        for i in range(1, max_col + 1)
    ) + "</cols>"
    views = '<sheetViews><sheetView workbookViewId="0"/></sheetViews>'
    if freeze:
        views = '<sheetViews><sheetView workbookViewId="0"><pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews>'
    data = ["<sheetData>"]
    for r_idx, row in enumerate(rows, 1):
        h = heights.get(r_idx)
        data.append(f'<row r="{r_idx}"' + (f' ht="{h}" customHeight="1"' if h else "") + ">")
        for col, value, style in row:
            text = escape("" if value is None else str(value))
            data.append(f'<c r="{ref(r_idx, col)}" s="{style}" t="inlineStr"><is><t xml:space="preserve">{text}</t></is></c>')
        data.append("</row>")
    data.append("</sheetData>")
    merge_xml = ""
    if merges:
        merge_xml = f'<mergeCells count="{len(merges)}">' + "".join(f'<mergeCell ref="{m}"/>' for m in merges) + "</mergeCells>"
    return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' + (
        '<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">'
        + views + cols + "".join(data) + merge_xml + "</worksheet>"
    )


def make_table(headers, records):
    rows = [[(i + 1, h, 2) for i, h in enumerate(headers)]]
    for rec in records:
        rows.append([(i + 1, v, 3) for i, v in enumerate(rec)])
    return rows


sheets = []


def add(name, rows, widths=None, merges=None, heights=None, freeze=True):
    sheets.append((name, sheet_xml(rows, widths, merges, heights, freeze)))


add("Overview", [
    [(1, "TÀI LIỆU WIREFRAME WEBSITE BOOKING HOTEL ONLINE", 1)],
    [(1, "Phạm vi", 2), (2, "Toàn bộ website: public/customer, auth/profile, admin, manager, receptionist, staff", 3)],
    [(1, "Nguồn", 2), (2, "Phân tích AppRoutes.jsx và cấu trúc pages/components hiện có trong frontend.", 3)],
    [(1, "Quy ước", 2), (2, "Wireframe là low-fidelity text-grid. Các block như [Header], [Sidebar], [Table], [Form], [Modal], [CTA] thể hiện khu vực UI chính.", 3)],
], {1: 24, 2: 110}, ["A1:B1"], {1: 34, 2: 48, 3: 48, 4: 60}, False)

sitemap = [
    ("Public", "/home", "Trang chủ", "CustomerLayout"),
    ("Public", "/rooms", "Danh sách phòng available", "CustomerLayout"),
    ("Public", "/offers", "Voucher/ưu đãi", "CustomerLayout"),
    ("Public", "/rooms/:roomId", "Chi tiết phòng", "CustomerLayout"),
    ("Public", "/rooms/unavailable", "Không có phòng phù hợp", "CustomerLayout"),
    ("Public", "/payment/result, /payment/status", "Kết quả/trạng thái thanh toán", "CustomerLayout"),
    ("Auth", "/login, /register, /login-success", "Đăng nhập/đăng ký/OAuth callback", "PublicRoute"),
    ("Customer", "/booking", "Tạo booking", "Protected CUSTOMER, ADMIN"),
    ("Customer", "/reservations, /reservations/:bookingId", "Lịch sử và chi tiết booking", "Protected CUSTOMER, ADMIN"),
    ("Customer", "/payment/redirect", "Redirect sang VNPAY", "Protected CUSTOMER, ADMIN"),
    ("Shared", "/profile, /profile/edit, /change-password", "Hồ sơ và đổi mật khẩu", "Protected"),
    ("Admin", "/admin/dashboard", "Dashboard admin", "AdminLayout"),
    ("Admin", "/admin/users", "Quản lý người dùng", "AdminLayout"),
    ("Admin", "/admin/furnitures", "Quản lý nội thất", "AdminLayout"),
    ("Admin", "/admin/rooms", "Quản lý phòng", "AdminLayout"),
    ("Admin", "/admin/bookings, /admin/reviews, /admin/vouchers", "Quản lý booking/review/voucher", "AdminLayout"),
    ("Admin", "/admin/chatbot, /admin/chat-history", "Chatbot knowledge và history", "AdminLayout"),
    ("Admin", "/admin/incidents, /admin/incident-reports", "Sự cố và báo cáo", "AdminLayout"),
    ("Manager", "/manager/*", "Dashboard, rooms, bookings, vouchers, incidents, reports", "ManagerLayout"),
    ("Receptionist", "/receptionist/*", "Dashboard, bookings, cleaning tasks, room detail", "ReceptionistLayout"),
    ("Staff", "/staff/*", "Dashboard, tasks, my tasks, room detail", "StaffLayout"),
]
add("Sitemap", make_table(["Nhóm", "Route", "Màn hình", "Layout/Guard"], sitemap), {1: 18, 2: 42, 3: 50, 4: 34})

wireframes = [
("Home", "/home", """+----------------------------------------------------------------------------+
| Header: logo | Rooms | Offers | Login/Profile                              |
+----------------------------------------------------------------------------+
| HERO image/banner + title + subtitle                                        |
| [StaySearchForm: check-in | check-out | guests | search CTA]                |
+----------------------------------------------------------------------------+
| Featured Rooms: [RoomCard] [RoomCard] [RoomCard] [View all]                 |
| Offers strip: [VoucherCard] [VoucherCard]                                   |
| Reviews carousel: [username/comment/rating]                                 |
| Footer                                                                       |
+----------------------------------------------------------------------------+""", "Tập trung chuyển đổi tìm phòng."),
("Rooms Listing", "/rooms", """+------------------------+---------------------------------------------------+
| FilterSidebar          | Toolbar: count | sort | pagination              |
| dates, guests, type,   | [RoomCard] [RoomCard] [RoomCard]                 |
| price, rating          | [RoomCard] [RoomCard] [RoomCard]                 |
+------------------------+---------------------------------------------------+""", "Sidebar filter desktop; collapsible mobile."),
("Room Detail", "/rooms/:roomId", """+----------------------------------------------------------------------------+
| Header                                                                       |
| Image gallery / hero room image                                              |
+-------------------------------------+--------------------------------------+
| Room info: type, price, capacity    | Booking CTA panel                    |
| Description, furniture, reviews     | dates | guests | [Book now]         |
+-------------------------------------+--------------------------------------+""", "CTA booking phải rõ và không che nội dung."),
("Offers", "/offers", """+----------------------------------------------------------------------------+
| Header                                                                       |
| Page title: Current offers                                                   |
| [VoucherCard] [VoucherCard] [VoucherCard]                                    |
| Empty state if no voucher                                                    |
+----------------------------------------------------------------------------+""", "Public/customer đều xem voucher."),
("Booking Create", "/booking", """+-------------------------------------+--------------------------------------+
| Booking form                        | Order summary                        |
| roomId, checkIn, checkOut           | Room, nights, total                  |
| numGuests, voucherCode              | paymentMethod, [Create booking]      |
+-------------------------------------+--------------------------------------+
| fullname/email/phone lấy từ profile hiện tại, không nhập tại form.           |
+----------------------------------------------------------------------------+""", "Nếu profile thiếu thông tin, backend trả lỗi."),
("Reservations", "/reservations", """+----------------------------------------------------------------------------+
| Filters: bookingId | roomNumber | status | payment | dates                  |
| Reservation row/card: room | dates | status | total | actions               |
| Pagination                                                                    |
+----------------------------------------------------------------------------+""", "Customer chỉ xem booking của chính mình."),
("Reservation Detail", "/reservations/:bookingId", """+-------------------------------------+--------------------------------------+
| Booking status/timeline              | Payment panel                       |
| Room info, stay dates, guest count   | VNPAY CTA / status                  |
| Total price                          | Cancel CTA / Review if CHECKED_OUT  |
+-------------------------------------+--------------------------------------+""", "Review chỉ mở khi booking CHECKED_OUT."),
("Login/Register", "/login, /register", """+--------------------------------------------------------------+
| Brand/logo                                                    |
| Auth form fields                                              |
| [Login/Register] [OAuth]                                      |
| Links: register/login/change password as needed               |
+--------------------------------------------------------------+""", "PublicRoute."),
("Profile", "/profile, /profile/edit", """+----------------------------+-----------------------------------------------+
| Avatar + identity         | fullName, phone, gender, birthday, address     |
| Role badge                | [Edit] / [Save] [Cancel]                       |
+----------------------------+-----------------------------------------------+""", "Dùng chung theo role."),
("Admin Base Layout", "/admin/*", """+----------------------+-----------------------------------------------------+
| Sidebar              | Topbar: profile/logout                             |
| Dashboard, Users,    | Page title + actions                              |
| Rooms, Bookings,     | KPI/filter toolbar                                |
| Vouchers, Chatbot    | Data table + modal/drawer                         |
+----------------------+-----------------------------------------------------+""", "Layout nền cho admin."),
("Room Management", "/admin/rooms, /manager/rooms", """+----------------------------------------------------------------------------+
| Filters: room number | floor | status | type | deleted                      |
| Table/Grid: room | type | price | max people | image | status | actions      |
| Modals: create/update, assign furniture, upload image                       |
+----------------------------------------------------------------------------+""", "ADMIN/MANAGER."),
("Booking Management", "/admin/bookings, /manager/bookings, /receptionist/bookings", """+----------------------------------------------------------------------------+
| Search: bookingId | customer | room | status | dates | payment              |
| Table: booking | customer | room | dates | status | payment | actions        |
| Update modal: status, payment method, dates                                 |
+----------------------------------------------------------------------------+""", "Receptionist tập trung check-in/check-out."),
("Voucher Management", "/admin/vouchers, /manager/vouchers", """+----------------------------------------------------------------------------+
| Header: [Create voucher]                                                    |
| Table/cards: code | discount | date range | usage | status | actions        |
| Modal: code, percent, maxDiscount, minBookingValue, usageLimit, dates        |
+----------------------------------------------------------------------------+""", "Backend: Admin CUD; public/customer xem."),
("Review Management", "/admin/reviews, /manager/reviews", """+----------------------------------------------------------------------------+
| Table: reviewId | username | booking | rating | comment | createdAt         |
| Actions: edit comment/rating, delete                                         |
+----------------------------------------------------------------------------+""", "Quản trị nội dung review."),
("Chatbot Admin", "/admin/chatbot, /admin/chat-history", """+----------------------------------------------------------------------------+
| Knowledge list: question | answer preview | category/status | actions        |
| Detail/edit pages: full Q/A form                                             |
| History table: user | question | response | createdAt                         |
+----------------------------------------------------------------------------+""", "Admin quản lý chatbot."),
("Incidents", "/manager/incidents, /admin/incidents", """+----------------------------------------------------------------------------+
| Filters: status | severity | date                                            |
| Table: incident | room | reporter | furniture | cost | decision | actions     |
| Detail modal + decision/resolve actions                                      |
+----------------------------------------------------------------------------+""", "Manager/Admin theo dõi sự cố."),
("Receptionist", "/receptionist/*", """+----------------------------------------------------------------------------+
| Dashboard KPI: arrivals | departures | occupied | cleaning requests          |
| Quick links: bookings | create cleaning | room detail                        |
+----------------------------------------------------------------------------+""", "Vận hành lễ tân."),
("Staff", "/staff/*", """+----------------------------------------------------------------------------+
| Task board: pending | accepted | in progress | done                          |
| Room detail: status update, maintenance/incident forms                       |
+----------------------------------------------------------------------------+""", "Nhân viên buồng phòng thao tác nhanh."),
]
wf_rows = [[(1, "Màn hình", 2), (2, "Route", 2), (3, "Wireframe", 2), (4, "Ghi chú", 2)]]
heights = {1: 28}
for i, row in enumerate(wireframes, 2):
    wf_rows.append([(1, row[0], 4), (2, row[1], 3), (3, row[2], 5), (4, row[3], 3)])
    heights[i] = max(78, min(175, 15 * (row[2].count("\n") + 2)))
add("Wireframes", wf_rows, {1: 24, 2: 42, 3: 86, 4: 48}, heights=heights)

details = [
("StaySearchForm", "/home, /rooms", "checkIn, checkOut, guests, roomType optional, submit search", "GET /api/v1/customer/rooms/search"),
("RoomCard", "/home, /rooms", "image, roomType, price, capacity, rating, detail/book CTA", "RoomAvailableResponse"),
("VoucherCard", "/offers, /booking", "code, discount, min value, date range, usage", "GET /api/v1/customer/vouchers/available"),
("Booking form", "/booking", "roomId, checkIn, checkOut, numGuests, paymentMethod, voucherCode", "POST /api/v1/reservation-create"),
("Reservation list", "/reservations", "filters, booking cards/table, pagination", "GET /api/v1/customer/reservation-search"),
("Review form", "/reservations/:bookingId", "rating, comment", "POST /api/v1/customer/reviews"),
("Admin table pattern", "/admin/*", "filter toolbar, table, row actions, modal forms", "Admin APIs"),
("Room admin modal", "/admin/rooms", "room fields, furniture assignment, image upload", "Room manager APIs"),
("Incident forms", "/staff/room-detail/:roomNumber", "maintenance/incident report fields", "Staff incident APIs"),
]
add("Screen Details", make_table(["Component/Màn hình", "Route", "Nội dung UI", "Backend/API"], details), {1: 30, 2: 38, 3: 72, 4: 48})

apis = [
("Auth", "POST", "/api/v1/auth/login", "Login, nhận accessToken"),
("Auth", "POST", "/api/v1/auth/register", "Đăng ký customer"),
("Profile", "GET/PUT", "/api/v1/profiles/me", "Xem/cập nhật profile"),
("Rooms Customer", "GET", "/api/v1/customer/rooms/search", "Tìm phòng available"),
("Rooms Customer", "GET", "/api/v1/customer/rooms/search/{roomId}", "Chi tiết phòng"),
("Booking Customer", "POST", "/api/v1/reservation-create", "Tạo booking"),
("Booking Customer", "GET", "/api/v1/customer/reservation-search", "Lịch sử booking"),
("Booking Customer", "PUT", "/api/v1/customer/reservation-update", "Customer hủy booking"),
("Payment", "POST/GET", "/api/v1/payments/vnpay/*", "Tạo URL/callback VNPAY"),
("Review", "GET", "/api/v1/reviews", "3 review mới nhất theo page"),
("Review", "POST", "/api/v1/customer/reviews", "Customer tạo review khi CHECKED_OUT"),
("Voucher", "GET", "/api/v1/vouchers, /api/v1/customer/vouchers/available", "Public/customer xem voucher"),
("Voucher Admin", "POST/PUT/DELETE", "/api/v1/vouchers/**", "Admin quản lý voucher"),
("Users Admin", "GET/POST/PUT/DELETE", "/api/v1/users/**", "Admin quản lý user"),
("Rooms Manager", "GET/POST/PUT/DELETE", "/api/v1/manager/rooms/**", "Admin/Manager phòng"),
("Chatbot Admin", "GET/POST/PUT/DELETE", "/api/v1/chatbot/knowledge/**", "Admin knowledge base"),
("Incidents", "GET/PUT/PATCH", "/api/v1/incidents/**", "Admin/Manager/Staff sự cố"),
("Staff", "GET/POST", "/api/v1/staff/**", "Room detail, tasks, report furniture"),
]
add("API Mapping", make_table(["Nhóm", "Method", "Endpoint", "Mục đích"], apis), {1: 24, 2: 20, 3: 64, 4: 70})

flows = [
("Customer booking", "Login -> Search rooms -> Room detail -> Voucher -> Create booking -> VNPAY -> Reservations -> Review after CHECKED_OUT"),
("Admin room setup", "Login admin -> Rooms -> Create/update room -> Assign furniture -> Upload image -> Verify customer room search"),
("Voucher lifecycle", "Admin create voucher -> Public/customer view voucher -> Customer apply voucher on booking -> usedCount increases"),
("Housekeeping", "Receptionist creates cleaning task -> Staff accepts task -> Staff updates room status -> Manager/Admin monitors"),
("Incident handling", "Staff reports incident -> Manager reviews detail -> Decision/resolve -> Incident report dashboard"),
("Chatbot content", "Admin creates knowledge -> Customer asks chatbot -> Admin reviews history -> Update knowledge"),
]
add("Flows", make_table(["Luồng", "Các bước"], flows), {1: 30, 2: 125})

content_types = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
  <Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>
""" + "".join(
    f'  <Override PartName="/xl/worksheets/sheet{i}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>\n'
    for i in range(1, len(sheets) + 1)
) + "</Types>"

root_rels = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
</Relationships>"""

workbook = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets>""" + "".join(
    f'<sheet name="{escape(name)}" sheetId="{i}" r:id="rId{i}"/>'
    for i, (name, _) in enumerate(sheets, 1)
) + "</sheets></workbook>"

workbook_rels = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
""" + "".join(
    f'  <Relationship Id="rId{i}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet{i}.xml"/>\n'
    for i in range(1, len(sheets) + 1)
) + f'  <Relationship Id="rId{len(sheets)+1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>\n</Relationships>'

with ZipFile(OUT, "w", ZIP_DEFLATED) as z:
    z.writestr("[Content_Types].xml", content_types)
    z.writestr("_rels/.rels", root_rels)
    z.writestr("xl/workbook.xml", workbook)
    z.writestr("xl/_rels/workbook.xml.rels", workbook_rels)
    z.writestr("xl/styles.xml", STYLES)
    for idx, (_, xml) in enumerate(sheets, 1):
        z.writestr(f"xl/worksheets/sheet{idx}.xml", xml)

print(OUT)
