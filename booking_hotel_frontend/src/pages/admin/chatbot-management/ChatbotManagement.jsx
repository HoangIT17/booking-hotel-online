import  { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { fetchKnowledge, trainChatbot, deleteKnowledge } from "../../../redux/slices/chatbotSlice";

const ChatbotManagement = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    // Lấy state từ Redux
    const { knowledgeList, pageInfo, isLoading } = useSelector((state) => state.chatbot);

    // Local State
    const [formData, setFormData] = useState({ question: "", answer: "" });
    const [searchTerm, setSearchTerm] = useState("");
    const [searchInput, setSearchInput] = useState(""); // Dùng để gõ mà chưa search ngay
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // 🌟 Gọi API mỗi khi Trang hoặc Từ khóa thay đổi
    useEffect(() => {
        dispatch(fetchKnowledge({ 
            page: currentPage, 
            size: itemsPerPage, 
            search: searchTerm 
        }));
    }, [dispatch, currentPage, searchTerm]);

    // Xử lý tính toán tổng số trang
    const totalPages = Math.ceil((pageInfo?.totalElements || 0) / itemsPerPage);

    // Xử lý Form nạp kiến thức
    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleTrainSubmit = (e) => {
        e.preventDefault();
        if (!formData.question.trim() || !formData.answer.trim()) {
            Swal.fire("Cảnh báo", "Vui lòng nhập đầy đủ Câu hỏi và Câu trả lời!", "warning");
            return;
        }

        // Chú ý: Cấu trúc gửi đi phải khớp với DTO của Backend (ở đây mình dùng questionPattern và answerContent theo Entity của bạn)
        const payload = {
            questionPattern: formData.question,
            answerContent: formData.answer
        };

        dispatch(trainChatbot(payload)).then((res) => {
            if (!res.error) {
                setFormData({ question: "", answer: "" });
                Swal.fire({ icon: 'success', title: 'Đã nạp kiến thức mới!', timer: 1500, showConfirmButton: false });
            }
        });
    };

    // Xử lý Xóa
    const handleDelete = (id) => {
        Swal.fire({
            title: 'Bạn có chắc chắn?',
            text: "Dữ liệu AI này sẽ bị xóa vĩnh viễn!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Xóa ngay!',
            cancelButtonText: 'Hủy'
        }).then((result) => {
            if (result.isConfirmed) {
                dispatch(deleteKnowledge(id)).then((res) => {
                    if (!res.error) {
                        Swal.fire('Đã xóa!', 'Kiến thức đã được gỡ bỏ.', 'success');
                        // Nếu xóa hết data ở trang hiện tại mà không phải trang 1 thì lùi lại 1 trang
                        if (knowledgeList.length === 1 && currentPage > 1) {
                            setCurrentPage(currentPage - 1);
                        }
                    }
                });
            }
        });
    };

    // Xử lý Tìm kiếm
    const handleSearch = () => {
        setCurrentPage(1); // Trở về trang 1 khi search
        setSearchTerm(searchInput);
    };

    const handleReset = () => {
        setSearchInput("");
        setSearchTerm("");
        setCurrentPage(1);
    };

    return (
        <div className="container-fluid py-4">
            <div className="card shadow-sm border-0">
                
                
                <div className="card-body">
                    {/* --- Form nạp kiến thức (Train Bot) --- */}
                    <form onSubmit={handleTrainSubmit} className="row g-3 mb-4 p-0 bg-light rounded shadow-sm border">
                        <h5 className="mb-2 text-dark"><i className="fa-solid fa-graduation-cap me-2"></i>Huấn luyện AI </h5>
                        <div className="col-md-5">
                            <label className="form-label fw-bold">Câu hỏi mẫu:</label>
                            <input
                                type="text"
                                name="question"
                                className="form-control"
                                placeholder="VD: Khách sạn có hồ bơi không?"
                                value={formData.question}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="col-md-5">
                            <label className="form-label fw-bold">AI Trả lời:</label>
                            <input
                                type="text"
                                name="answer"
                                className="form-control"
                                placeholder="VD: Dạ, khách sạn có hồ bơi vô cực..."
                                value={formData.answer}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="col-md-2 d-flex align-items-end">
                            <button type="submit" className="btn btn-primary w-100" disabled={isLoading}>
                                {isLoading ? <span className="spinner-border spinner-border-sm"></span> : <><i className="fa-solid fa-bolt me-1"></i> Train Bot</>}
                            </button>
                        </div>
                    </form>

                    {/* --- Công cụ Tìm kiếm --- */}
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <div className="d-flex gap-2">
                            <div className="input-group shadow-sm" style={{ width: "800px" }}>
                                <span className="input-group-text bg-white text-primary">
                                    <i className="fa-solid fa-magnifying-glass"></i>
                                </span>
                                <input 
                                    type="text" 
                                    className="form-control border-start-0 ps-1" 
                                    placeholder="Tìm kiếm câu hỏi hoặc câu trả lời..." 
                                    value={searchInput}
                                    onChange={(e) => setSearchInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                />
                                <button className="btn btn-primary" onClick={handleSearch} type="button">Tìm</button>
                            </div>
                            <button className="btn btn-outline-secondary d-flex align-items-center gap-2 shadow-sm" onClick={handleReset}>
                                <i className="fa-solid fa-rotate-right"></i> Làm mới
                            </button>
                        </div>
                        <div className="text-muted small">
                            <i className="fa-solid fa-database me-1"></i> Tổng số: <strong>{pageInfo?.totalElements || 0}</strong> dòng
                        </div>
                    </div>

                    {/* --- Bảng Dữ Liệu --- */}
                    <div className="table-responsive shadow-sm rounded border">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="table-primary">
                                <tr>
                                    <th style={{ width: "5%", padding: "12px" }}>ID</th>
                                    <th style={{ width: "30%", padding: "12px" }}>Câu Hỏi</th>
                                    <th style={{ width: "50%", padding: "12px" }}>Trả Lời</th>
                                    <th style={{ width: "15%", textAlign: "center", padding: "12px" }}>Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    <tr><td colSpan="4" className="text-center py-5"><span className="spinner-border text-primary"></span></td></tr>
                                ) : knowledgeList && knowledgeList.length > 0 ? (
                                    knowledgeList.map((item) => (
                                        <tr key={item.id}>
                                            <td className="fw-bold ps-3">{item.id}</td>
                                            <td className="text-dark fw-medium">{item.questionPattern || item.question}</td>
                                            <td className="text-muted" style={{ whiteSpace: "normal" }}>{item.answerContent || item.answer}</td>
                                            <td className="text-center">
                                                <div className="d-flex gap-2 justify-content-center">
                                                    <button className="btn btn-outline-info btn-sm" onClick={() => navigate(`/admin/chatbot/${item.id}`)} title="Xem chi tiết">
                                                        <i className="fa-solid fa-eye"></i>
                                                    </button>
                                                    <button className="btn btn-outline-warning btn-sm" onClick={() => navigate(`/admin/chatbot/edit/${item.id}`)} title="Sửa">
                                                        <i className="fa-solid fa-pen"></i>
                                                    </button>
                                                    <button className="btn btn-outline-danger btn-sm" onClick={() => handleDelete(item.id)} title="Xóa">
                                                        <i className="fa-solid fa-trash"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan="4" className="text-center py-4 text-muted">Không tìm thấy dữ liệu phù hợp.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* --- Phân Trang (Server-side Pagination) --- */}
                    {totalPages > 1 && (
                        <nav className="mt-4">
                            <ul className="pagination justify-content-center">
                                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                    <button className="page-link" onClick={() => setCurrentPage(currentPage - 1)}>Trước</button>
                                </li>
                                {[...Array(totalPages)].map((_, index) => (
                                    <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                                        <button className="page-link" onClick={() => setCurrentPage(index + 1)}>{index + 1}</button>
                                    </li>
                                ))}
                                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                    <button className="page-link" onClick={() => setCurrentPage(currentPage + 1)}>Sau</button>
                                </li>
                            </ul>
                        </nav>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChatbotManagement;