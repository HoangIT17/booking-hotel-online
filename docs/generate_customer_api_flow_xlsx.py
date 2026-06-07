from zipfile import ZipFile, ZIP_DEFLATED
from html import escape
from pathlib import Path

OUT = Path(__file__).with_name("customer_api_flow_design.xlsx")


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
  <fonts count="5">
    <font><sz val="11"/><name val="Calibri"/></font>
    <font><b/><sz val="18"/><color rgb="FFFFFFFF"/><name val="Calibri"/></font>
    <font><b/><sz val="11"/><color rgb="FFFFFFFF"/><name val="Calibri"/></font>
    <font><sz val="10"/><name val="Consolas"/></font>
    <font><b/><sz val="13"/><color rgb="FF111827"/><name val="Calibri"/></font>
  </fonts>
  <fills count="6">
    <fill><patternFill patternType="none"/></fill>
    <fill><patternFill patternType="gray125"/></fill>
    <fill><patternFill patternType="solid"><fgColor rgb="FF111827"/></patternFill></fill>
    <fill><patternFill patternType="solid"><fgColor rgb="FF2563EB"/></patternFill></fill>
    <fill><patternFill patternType="solid"><fgColor rgb="FFE5E7EB"/></patternFill></fill>
    <fill><patternFill patternType="solid"><fgColor rgb="FFF3F4F6"/></patternFill></fill>
  </fills>
  <borders count="3">
    <border><left/><right/><top/><bottom/><diagonal/></border>
    <border><left style="thin"><color rgb="FFD1D5DB"/></left><right style="thin"><color rgb="FFD1D5DB"/></right><top style="thin"><color rgb="FFD1D5DB"/></top><bottom style="thin"><color rgb="FFD1D5DB"/></bottom></border>
    <border><left style="medium"><color rgb="FF374151"/></left><right style="medium"><color rgb="FF374151"/></right><top style="medium"><color rgb="FF374151"/></top><bottom style="medium"><color rgb="FF374151"/></bottom></border>
  </borders>
  <cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>
  <cellXfs count="7">
    <xf numFmtId="0" fontId="0" fillId="0" borderId="1" xfId="0"><alignment vertical="top"/></xf>
    <xf numFmtId="0" fontId="1" fillId="2" borderId="1" xfId="0" applyFont="1" applyFill="1"><alignment horizontal="center" vertical="center"/></xf>
    <xf numFmtId="0" fontId="2" fillId="3" borderId="1" xfId="0" applyFont="1" applyFill="1"><alignment horizontal="center" vertical="center" wrapText="1"/></xf>
    <xf numFmtId="0" fontId="0" fillId="0" borderId="1" xfId="0"><alignment vertical="top" wrapText="1"/></xf>
    <xf numFmtId="0" fontId="4" fillId="4" borderId="1" xfId="0" applyFont="1" applyFill="1"><alignment vertical="center" wrapText="1"/></xf>
    <xf numFmtId="0" fontId="3" fillId="5" borderId="2" xfId="0" applyFont="1" applyFill="1"><alignment vertical="top" wrapText="1"/></xf>
    <xf numFmtId="0" fontId="3" fillId="0" borderId="1" xfId="0" applyFont="1"><alignment vertical="top" wrapText="1"/></xf>
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


def table(headers, records):
    rows = [[(i + 1, h, 2) for i, h in enumerate(headers)]]
    for rec in records:
        rows.append([(i + 1, v, 3) for i, v in enumerate(rec)])
    return rows


sheets = []


def add(name, rows, widths=None, merges=None, heights=None, freeze=True):
    sheets.append((name, sheet_xml(rows, widths, merges, heights, freeze)))


add("Overview", [
    [(1, "TÀI LIỆU THIẾT KẾ API CUSTOMER FLOW", 1)],
    [(1, "Base URL", 2), (2, "http://localhost:8080", 6)],
    [(1, "Auth", 2), (2, "Các API cần đăng nhập dùng header: Authorization: Bearer <accessToken>", 3)],
    [(1, "Role kiểm thử", 2), (2, "CUSTOMER: username=customer, password=123123", 3)],
    [(1, "Luồng tổng quát", 2), (2, "Login -> Get profile -> Search rooms -> Room detail -> View vouchers -> Create booking -> Create VNPAY payment -> Payment return/status -> Reservation search -> Cancel nếu cần -> Review sau CHECKED_OUT", 3)],
], {1: 24, 2: 120}, ["A1:B1"], {1: 34, 5: 72}, False)

flow = [
    ("1", "Login", "POST /api/v1/auth/login", "Lấy accessToken cho customer"),
    ("2", "Get profile", "GET /api/v1/profiles/me", "Kiểm tra fullName/email/phone trước khi booking"),
    ("3", "Search rooms", "GET /api/v1/customer/rooms/search", "Tìm phòng READY, không deleted, không overlap ngày"),
    ("4", "Room detail", "GET /api/v1/customer/rooms/search/{roomId}", "Xem thông tin phòng, furniture, reviews"),
    ("5", "View vouchers", "GET /api/v1/customer/vouchers/available", "Lấy voucher còn hiệu lực"),
    ("6", "Create booking", "POST /api/v1/reservation-create", "Tạo booking PENDING, customer/profile lấy từ token"),
    ("7", "Create payment", "POST /api/v1/payments/vnpay/create", "Tạo URL thanh toán VNPAY cho booking"),
    ("8", "Payment return", "GET /api/v1/payments/vnpay/return", "VNPAY callback cập nhật trạng thái thanh toán"),
    ("9", "Reservation search", "GET /api/v1/customer/reservation-search", "Customer xem booking của chính mình"),
    ("10", "Cancel booking", "PUT /api/v1/customer/reservation-update", "Customer chỉ được CANCELLED"),
    ("11", "Create review", "POST /api/v1/customer/reviews", "Chỉ khi booking của customer đã CHECKED_OUT"),
]
add("Flow", table(["Bước", "Tên bước", "Endpoint", "Mục đích"], flow), {1: 10, 2: 28, 3: 58, 4: 78})

endpoints = [
    ("Auth", "POST", "/api/v1/auth/login", "Public", '{"username":"customer","password":"123123"}', "data.accessToken"),
    ("Profile", "GET", "/api/v1/profiles/me", "CUSTOMER", "None", "email, fullName, phone"),
    ("Room Search", "GET", "/api/v1/customer/rooms/search?checkIn=2026-06-10&checkOut=2026-06-12&numGuests=2", "Public", "Query params", "PageResponse<RoomAvailableResponse>"),
    ("Room Detail", "GET", "/api/v1/customer/rooms/search/1", "Public", "Path roomId", "CustomerRoomDetailResponse"),
    ("Voucher", "GET", "/api/v1/customer/vouchers/available", "Public", "None", "List<VoucherResponse>"),
    ("Booking", "POST", "/api/v1/reservation-create", "Authenticated", "BookingCreateRequest", "BookingCreateResponse bookingId"),
    ("Payment", "POST", "/api/v1/payments/vnpay/create", "CUSTOMER owner", "VnPayCreatePaymentRequest", "paymentUrl"),
    ("Booking Search", "GET", "/api/v1/customer/reservation-search", "Authenticated customer", "BookingSearchUserRequest as query", "PageResponse<BookingSearchCustomerResponse>"),
    ("Booking Cancel", "PUT", "/api/v1/customer/reservation-update", "Authenticated owner", "BookingUpdateRequest", "BookingUpdateResponse"),
    ("Review", "POST", "/api/v1/customer/reviews", "CUSTOMER", "ReviewCreateRequest", "ReviewResponse"),
]
add("Endpoints", table(["Nhóm", "Method", "Endpoint", "Auth", "Request", "Response"], endpoints), {1: 20, 2: 12, 3: 72, 4: 28, 5: 58, 6: 44})

samples = [
    ("Login", "POST /api/v1/auth/login", """{
  "username": "customer",
  "password": "123123"
}""", """{
  "accessToken": "...",
  "tokenType": "Bearer",
  "userId": 5,
  "username": "customer",
  "role": "CUSTOMER"
}"""),
    ("Create booking", "POST /api/v1/reservation-create", """{
  "roomId": 1,
  "paymentMethod": "BANK",
  "checkIn": "2026-06-10T14:00:00",
  "checkOut": "2026-06-12T12:00:00",
  "numGuests": 2,
  "voucherCode": "TEST20"
}""", """{
  "message": "Booking created successfully",
  "bookingId": 10
}"""),
    ("Create VNPAY payment", "POST /api/v1/payments/vnpay/create", """{
  "bookingId": 10,
  "orderInfo": "Thanh toán đặt phòng",
  "locale": "vn"
}""", """{
  "paymentUrl": "https://sandbox.vnpayment.vn/..."
}"""),
    ("Cancel booking", "PUT /api/v1/customer/reservation-update", """{
  "bookingId": 10,
  "bookingStatus": "CANCELLED"
}""", """{
  "bookingId": 10,
  "message": "Booking cancelled successfully"
}"""),
    ("Create review", "POST /api/v1/customer/reviews", """{
  "bookingId": 10,
  "rating": 5,
  "comment": "Phòng sạch, nhân viên hỗ trợ tốt"
}""", """{
  "reviewId": 1,
  "bookingId": 10,
  "customerId": 5,
  "rating": 5,
  "comment": "..."
}"""),
]
sample_rows = [[(1, "Tên", 2), (2, "Endpoint", 2), (3, "Request mẫu", 2), (4, "Response mẫu", 2)]]
heights = {1: 28}
for idx, row in enumerate(samples, 2):
    sample_rows.append([(1, row[0], 4), (2, row[1], 6), (3, row[2], 5), (4, row[3], 5)])
    heights[idx] = 130
add("Request Response", sample_rows, {1: 24, 2: 42, 3: 58, 4: 58}, heights=heights)

rules = [
    ("Booking create", "Không gửi fullName/email/phone", "Backend lấy từ user/profile hiện tại"),
    ("Booking create", "Profile phải đủ fullName, email, phone", "Thiếu sẽ bị reject"),
    ("Booking create", "paymentDate = null", "Chỉ set khi thanh toán thật thành công"),
    ("Booking create", "Room phải READY và chưa bị deleted", "Room không available sẽ lỗi conflict"),
    ("Booking create", "Không được overlap booking PENDING/CONFIRMED/CHECKED_IN", "Dựa trên checkIn/checkOut"),
    ("Booking cancel", "Customer chỉ được CANCELLED", "Không được tự CONFIRMED/CHECKED_IN/CHECKED_OUT"),
    ("Booking search", "Customer chỉ thấy booking của chính mình", "Filter bằng customer id từ token"),
    ("Review create", "Chỉ review booking của chính customer", "Không được review booking người khác"),
    ("Review create", "Chỉ khi BookingStatus = CHECKED_OUT", "Không cho review PENDING/CONFIRMED/CANCELLED"),
    ("Review create", "Mỗi booking chỉ một review", "Tránh review trùng"),
    ("Voucher view", "Customer/unauth được xem", "GET public"),
    ("Voucher apply", "Voucher phải active, chưa hết hạn, còn usageLimit, đạt minBookingValue", "Kiểm tra trong create booking"),
]
add("Business Rules", table(["Phạm vi", "Rule", "Ghi chú"], rules), {1: 24, 2: 58, 3: 78})

errors = [
    ("401 Unauthorized", "Không có token hoặc token sai/hết hạn", "Login lại và gửi Authorization Bearer"),
    ("403 Forbidden", "Role không đủ quyền", "Customer chỉ dùng endpoint customer/public"),
    ("400 Bad Request", "Validation sai field/date/rating", "Kiểm tra request body/query"),
    ("404 Not Found", "bookingId/roomId/voucherId không tồn tại", "Kiểm tra dữ liệu DB"),
    ("409 Conflict", "Room không available, overlap ngày, voucher không hợp lệ, profile thiếu thông tin", "Hiển thị message backend cho user"),
    ("500 Internal Server Error", "Lỗi server hoặc exception chưa được handle", "Xem log backend"),
]
add("Errors", table(["HTTP", "Nguyên nhân", "Cách xử lý"], errors), {1: 22, 2: 62, 3: 70})


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
