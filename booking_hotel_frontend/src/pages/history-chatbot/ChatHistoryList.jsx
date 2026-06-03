import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchChatHistory } from '../../redux/slices/chatbotSlice';

const ChatHistoryList = () => {
    const dispatch = useDispatch();

    const {
        historyList = [],
        historyPageInfo = { page: 0, pageSize: 10, totalElements: 0 },
        isLoading,
        error
    } = useSelector((state) => state.chatbot);

    const [search, setSearch] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [page, setPage] = useState(0);
    const size = 10;

    const [selectedChat, setSelectedChat] = useState(null);

    const handleFetchData = (pageNumber = page) => {
        dispatch(fetchChatHistory({
            page: pageNumber,
            size,
            search,
            startDate,
            endDate
        }));
    };

    useEffect(() => {
        handleFetchData(page);
    }, [page]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setPage(0);
        handleFetchData(0);
    };

    const handleResetFilters = () => {
        setSearch("");
        setStartDate("");
        setEndDate("");
        setPage(0);
        dispatch(fetchChatHistory({ page: 0, size, search: "", startDate: "", endDate: "" }));
    };

    return (
        <div className="container-fluid p-1">
            {/* Khu vực Bộ lọc - Đơn giản hóa */}
            <div className="card mb-4">
                <div className="card-body">
                    <form onSubmit={handleSearchSubmit} className="row g-3 align-items-end">
                        <div className="col-md-4">
                            <label className="form-label fw-bold">Từ khóa tìm kiếm</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Nhập tên khách hàng, câu hỏi..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>

                        <div className="col-md-3">
                            <label className="form-label fw-bold">Từ ngày</label>
                            <input
                                type="date"
                                className="form-control"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                            />
                        </div>

                        <div className="col-md-3">
                            <label className="form-label fw-bold">Đến ngày</label>
                            <input
                                type="date"
                                className="form-control"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                            />
                        </div>

                        <div className="col-md-2 d-flex gap-2">
                            <button type="submit" className="btn btn-primary w-100">
                                Tìm kiếm
                            </button>
                            <button type="button" className="btn btn-secondary" onClick={handleResetFilters}>
                                Xóa
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Bảng hiển thị - Chuẩn bảng dữ liệu Admin */}
            <div className="card">
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-bordered table-hover mb-0">
                            <thead className="table-primary">
                                <tr>
                                    <th style={{ width: '60px' }} className="text-center">STT</th>
                                    <th style={{ width: '180px' }}>Khách hàng</th>
                                    <th>Câu hỏi của khách</th>
                                    <th>AI Phản hồi</th>
                                    <th style={{ width: '180px' }}>Thời gian</th>
                                    <th style={{ width: '100px' }} className="text-center">Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    <tr>
                                        <td colSpan="6" className="text-center py-4">
                                            <div className="spinner-border text-primary" role="status"></div>
                                            <div className="mt-2">Đang tải dữ liệu...</div>
                                        </td>
                                    </tr>
                                ) : error ? (
                                    <tr>
                                        <td colSpan="6" className="text-center py-4 text-danger">
                                            Lỗi tải dữ liệu. Vui lòng thử lại.
                                        </td>
                                    </tr>
                                ) : !historyList || historyList.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="text-center py-4 text-muted">
                                            Không có dữ liệu lịch sử.
                                        </td>
                                    </tr>
                                ) : (
                                    (historyList || []).map((item, idx) => (
                                        <tr key={item.id || idx}>
                                            <td className="text-center align-middle">
                                                {page * size + idx + 1}
                                            </td>
                                            <td className="align-middle fw-bold text-primary">
                                                {item.customerName || "Khách ẩn danh"}
                                            </td>
                                            <td className="align-middle">
                                                <div className="text-truncate" style={{ maxWidth: '300px' }}>
                                                    {item.question}
                                                </div>
                                            </td>
                                            <td className="align-middle">
                                                <div className="text-truncate text-muted" style={{ maxWidth: '350px' }}>
                                                    {item.aiResponse}
                                                </div>
                                            </td>
                                            <td className="align-middle text-muted">
                                                {item.createdAt ? new Date(item.createdAt).toLocaleString('vi-VN') : ''}
                                            </td>
                                            <td className="text-center align-middle">
                                                <button
                                                    className="btn btn-sm btn-primary"
                                                    data-bs-toggle="modal"
                                                    data-bs-target="#viewChatDetailModal"
                                                    onClick={() => setSelectedChat(item)}
                                                >
                                                    Chi tiết
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Khu vực Phân Trang */}
                {!isLoading && historyPageInfo?.totalElements > size && (
                    <div className="card-footer d-flex justify-content-between align-items-center bg-white">
                        <small className="text-muted">
                            Hiển thị {historyList?.length || 0} / {historyPageInfo?.totalElements || 0} bản ghi
                        </small>
                        <nav>
                            <ul className="pagination pagination-sm mb-0">
                                <li className={`page-item ${page === 0 ? 'disabled' : ''}`}>
                                    <button className="page-link" onClick={() => setPage(p => p - 1)}>Trước</button>
                                </li>

                                {[...Array(Math.ceil((historyPageInfo?.totalElements || 0) / size))].map((_, index) => (
                                    <li key={index} className={`page-item ${page === index ? 'active' : ''}`}>
                                        <button className="page-link" onClick={() => setPage(index)}>{index + 1}</button>
                                    </li>
                                ))}

                                <li className={`page-item ${page >= Math.ceil((historyPageInfo?.totalElements || 0) / size) - 1 ? 'disabled' : ''}`}>
                                    <button className="page-link" onClick={() => setPage(p => p + 1)}>Sau</button>
                                </li>
                            </ul>
                        </nav>
                    </div>
                )}
            </div>

            {/* MODAL XEM CHI TIẾT - Chuyển sang dạng hộp cơ bản */}
            <div className="modal fade" id="viewChatDetailModal" tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered modal-lg">
                    <div className="modal-content">
                        <div className="modal-header bg-primary text-white">
                            <h5 className="modal-title fw-bold">Chi tiết hội thoại</h5>
                            <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            {selectedChat ? (
                                <div>
                                    <div className="mb-3 border-bottom pb-3">
                                        <span className="fw-bold">Khách hàng: </span> 
                                        <span className="text-primary fw-bold me-3">{selectedChat.customerName || "Khách ẩn danh"}</span>
                                        <span className="text-muted">
                                            <i className="fa-regular fa-clock me-1"></i>
                                            {selectedChat.createdAt ? new Date(selectedChat.createdAt).toLocaleString('vi-VN') : ''}
                                        </span>
                                    </div>

                                    {/* Hộp thoại câu hỏi */}
                                    <div className="mb-3 p-3 bg-light border rounded">
                                        <strong className="text-dark">👤 Khách hàng hỏi:</strong>
                                        <p className="mb-0 mt-2 text-dark">{selectedChat.question}</p>
                                    </div>

                                    {/* Hộp thoại AI trả lời */}
                                    <div className="p-3 border border-primary rounded" style={{ backgroundColor: '#f8fbff' }}>
                                        <strong className="text-primary">🤖 AI Phản hồi:</strong>
                                        <p className="mb-0 mt-2 text-dark" style={{ whiteSpace: 'pre-wrap' }}>{selectedChat.aiResponse}</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center text-muted">Không có dữ liệu chi tiết.</div>
                            )}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary px-4" data-bs-dismiss="modal">Đóng</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatHistoryList;