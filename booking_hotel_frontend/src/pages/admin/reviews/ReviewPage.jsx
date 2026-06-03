import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { fetchReviews, replyReview, deleteReview } from "../../../redux/slices/reviewSlice";
import styles from "./ReviewPage.module.css";

// ── Cấu hình hiển thị trạng thái phản hồi ──
const REPLY_STATUS_CONFIG = {
    replied: { label: "Đã phản hồi", bg: "#d4edda", color: "#155724" },
    pending: { label: "Chờ phản hồi", bg: "#fff3cd", color: "#856404" },
};

// ── Các tab filter theo trạng thái phản hồi ──
const TABS = [
    { key: "all",     label: "Tất cả" },
    { key: "pending", label: "Chờ phản hồi" },
    { key: "replied", label: "Đã phản hồi" },
];

// ── Render sao từ rating ──
const renderStars = (rating) => {
    return (
        <span className={styles.stars}>
            {"★".repeat(rating)}
            {"☆".repeat(5 - rating)}
            <span style={{ color: "#6c757d", marginLeft: 4, fontSize: "0.8rem" }}>
                ({rating})
            </span>
        </span>
    );
};

const formatDate = (dateStr) =>
    dateStr ? new Date(dateStr).toLocaleDateString("vi-VN") : "—";

const ReviewPage = () => {
    const dispatch = useDispatch();
    const { items, pagination, loading, submitting } = useSelector((state) => state.review);

    // ── State filter ──────────────────────────────────
    const [activeTab,          setActiveTab]          = useState("all");
    const [filterCustomerName, setFilterCustomerName] = useState("");
    const [debouncedName,      setDebouncedName]      = useState("");
    const [filterRating,       setFilterRating]       = useState("");
    const [filterFromDate,     setFilterFromDate]     = useState("");
    const [filterToDate,       setFilterToDate]       = useState("");
    const [currentPage,        setCurrentPage]        = useState(0);

    // ── State modal phản hồi ──────────────────────────
    const [showModal,       setShowModal]       = useState(false);
    const [selectedReview,  setSelectedReview]  = useState(null);
    const [replyText,       setReplyText]       = useState("");
    const [replyError,      setReplyError]      = useState("");

    const debounceRef = useRef(null);

    // ── Debounce tên khách hàng ──
    const handleNameChange = (e) => {
        const val = e.target.value;
        setFilterCustomerName(val);
        clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            setDebouncedName(val);
            setCurrentPage(0);
        }, 500);
    };

    // ── Reset trang khi đổi filter ──
    const handleTabChange = (tabKey) => {
        setActiveTab(tabKey);
        setCurrentPage(0);
    };

    const handleRatingChange = (e) => {
        setFilterRating(e.target.value);
        setCurrentPage(0);
    };

    const handleFromDateChange = (e) => {
        setFilterFromDate(e.target.value);
        setCurrentPage(0);
    };

    const handleToDateChange = (e) => {
        setFilterToDate(e.target.value);
        setCurrentPage(0);
    };

    // ── Fetch danh sách đánh giá ──
    useEffect(() => {
        const params = {
            page: currentPage,
            size: 10,
            sort: "createdAt,desc",
        };
        if (activeTab === "pending") params.hasReply = false;
        if (activeTab === "replied") params.hasReply = true;
        if (filterRating)           params.rating       = filterRating;
        if (filterFromDate)         params.fromDate     = filterFromDate;
        if (filterToDate)           params.toDate       = filterToDate;
        if (debouncedName.trim())   params.customerName = debouncedName.trim();

        dispatch(fetchReviews(params));
    }, [dispatch, activeTab, filterRating, filterFromDate, filterToDate, debouncedName, currentPage]);

    // ── Mở modal phản hồi ──
    const handleOpenModal = (review) => {
        setSelectedReview(review);
        setReplyText(review.staffReply || "");
        setReplyError("");
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedReview(null);
    };

    // ── Xóa đánh giá ──
    const handleDeleteReview = async (reviewId) => {
        if (!window.confirm("Bạn có chắc muốn xóa đánh giá này không?")) return;
        const result = await dispatch(deleteReview(reviewId));
        if (deleteReview.fulfilled.match(result)) {
            toast.success("Đã xóa đánh giá!");
        } else {
            toast.error(result.payload || "Xóa thất bại");
        }
    };

    // ── Gửi phản hồi ──
    const handleSubmitReply = async () => {
        if (!replyText.trim()) {
            setReplyError("Nội dung phản hồi không được để trống");
            return;
        }
        const result = await dispatch(replyReview({
            reviewId: selectedReview.id,
            data: { staffReply: replyText.trim() },
        }));
        if (replyReview.fulfilled.match(result)) {
            toast.success("Phản hồi thành công!");
            handleCloseModal();
        } else {
            toast.error(result.payload || "Gửi phản hồi thất bại");
        }
    };

    // ── Render pagination ──
    const renderPagination = () => {
        const { currentPage: cp, totalPages } = pagination;
        if (totalPages <= 1) return null;

        return (
            <div className={styles.pagination}>
                <button
                    className={`${styles.pageBtn} ${cp === 0 ? styles.pageBtnDisabled : ""}`}
                    onClick={() => setCurrentPage(cp - 1)}
                    disabled={cp === 0}
                >
                    ‹
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                    <button
                        key={i}
                        className={`${styles.pageBtn} ${i === cp ? styles.pageBtnActive : ""}`}
                        onClick={() => setCurrentPage(i)}
                    >
                        {i + 1}
                    </button>
                ))}
                <button
                    className={`${styles.pageBtn} ${pagination.last ? styles.pageBtnDisabled : ""}`}
                    onClick={() => setCurrentPage(cp + 1)}
                    disabled={pagination.last}
                >
                    ›
                </button>
            </div>
        );
    };

    return (
        <div className={styles.pageWrapper}>
            {/* ── Filter bar ── */}
            <div className={styles.filterBar}>
                {/* Tab trạng thái phản hồi */}
                <div className={styles.tabGroup}>
                    {TABS.map((tab) => (
                        <button
                            key={tab.key}
                            className={`${styles.tabBtn} ${activeTab === tab.key ? styles.tabBtnActive : ""}`}
                            onClick={() => handleTabChange(tab.key)}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Tìm theo tên khách */}
                <input
                    type="text"
                    className={styles.filterInput}
                    placeholder="Tìm theo tên khách..."
                    value={filterCustomerName}
                    onChange={handleNameChange}
                    style={{ minWidth: 180 }}
                />

                {/* Lọc theo số sao */}
                <select
                    className={styles.filterInput}
                    value={filterRating}
                    onChange={handleRatingChange}
                >
                    <option value="">Tất cả số sao</option>
                    {[1, 2, 3, 4, 5].map((r) => (
                        <option key={r} value={r}>{r} ★</option>
                    ))}
                </select>

                {/* Khoảng ngày */}
                <input
                    type="date"
                    className={styles.filterInput}
                    value={filterFromDate}
                    onChange={handleFromDateChange}
                />
                <span className={styles.filterSeparator}>→</span>
                <input
                    type="date"
                    className={styles.filterInput}
                    value={filterToDate}
                    onChange={handleToDateChange}
                />
            </div>

            {/* ── Bảng danh sách ── */}
            <div className={styles.tableCard}>
                {loading ? (
                    <div className={styles.emptyState}>
                        <div className="spinner-border text-secondary" role="status" />
                        <p className="mt-3">Đang tải...</p>
                    </div>
                ) : items.length === 0 ? (
                    <div className={styles.emptyState}>
                        <p>Không có đánh giá nào</p>
                    </div>
                ) : (
                    <>
                        <div className={styles.totalText} style={{ padding: "12px 16px 0" }}>
                            Tổng: <strong>{pagination.totalElements}</strong> đánh giá
                        </div>
                        <table className={`table ${styles.table}`}>
                            <thead>
                                <tr>
                                    <th style={{ width: 44 }}>STT</th>
                                    <th style={{ width: 110 }}>Khách hàng</th>
                                    <th style={{ width: 90 }}>Đánh giá</th>
                                    <th style={{ width: 160 }}>Nội dung</th>
                                    <th style={{ width: 115, whiteSpace: "nowrap" }}>Trạng thái</th>
                                    <th style={{ width: 95 }}>Ngày đánh giá</th>
                                    <th style={{ width: 155, whiteSpace: "nowrap" }}>Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((review, idx) => {
                                    const isReplied = !!review.staffReply;
                                    const statusCfg = isReplied
                                        ? REPLY_STATUS_CONFIG.replied
                                        : REPLY_STATUS_CONFIG.pending;

                                    return (
                                        <tr key={review.id}>
                                            <td>{pagination.currentPage * pagination.pageSize + idx + 1}</td>
                                            <td style={{ fontWeight: 500 }}>
                                                {review.customerName || "—"}
                                            </td>
                                            <td>{renderStars(review.rating)}</td>
                                            <td>
                                                <div className={styles.commentCell} title={review.comment}>
                                                    {review.comment}
                                                </div>
                                            </td>
                                            <td>
                                                <span
                                                    className={styles.badge}
                                                    style={{ background: statusCfg.bg, color: statusCfg.color }}
                                                >
                                                    {statusCfg.label}
                                                </span>
                                            </td>
                                            <td>{formatDate(review.createdAt)}</td>
                                            <td style={{ whiteSpace: "nowrap" }}>
                                                <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                                                    <button
                                                        className={styles.btnReply}
                                                        onClick={() => handleOpenModal(review)}
                                                    >
                                                        {isReplied ? "Xem & Sửa" : "Phản hồi"}
                                                    </button>
                                                    <button
                                                        className={styles.btnDelete}
                                                        onClick={() => handleDeleteReview(review.id)}
                                                    >
                                                        Xóa
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                        {renderPagination()}
                    </>
                )}
            </div>

            {/* ── Modal phản hồi ── */}
            {showModal && selectedReview && (
                <>
                    <div className="modal fade show d-block">
                        <div className="modal-dialog modal-lg">
                            <div className="modal-content" style={{ borderRadius: 12 }}>

                                <div className="modal-header" style={{ borderBottom: "1px solid #f1f3f5" }}>
                                    <h5 className="modal-title" style={{ fontWeight: 700 }}>
                                        {selectedReview.staffReply ? "Sửa phản hồi" : "Phản hồi đánh giá"}
                                    </h5>
                                    <button className="btn-close" onClick={handleCloseModal} />
                                </div>

                                <div className="modal-body">
                                    {/* Thông tin đánh giá */}
                                    <div className={styles.reviewCard}>
                                        <div className={styles.reviewMeta}>
                                            <span className={styles.customerName}>
                                                {selectedReview.customerName}
                                            </span>
                                            <span className={styles.reviewDate}>
                                                {formatDate(selectedReview.createdAt)}
                                            </span>
                                        </div>
                                        <div style={{ marginBottom: 8 }}>
                                            {renderStars(selectedReview.rating)}
                                        </div>
                                        <p className={styles.reviewComment}>
                                            {selectedReview.comment}
                                        </p>
                                    </div>

                                    {/* Phản hồi hiện tại (nếu có) */}
                                    {selectedReview.staffReply && (
                                        <div style={{
                                            background: "#e8f4fd",
                                            borderRadius: 10,
                                            padding: "12px 16px",
                                            marginBottom: 16,
                                            borderLeft: "3px solid #6c63ff",
                                        }}>
                                            <div style={{ fontSize: "0.8rem", color: "#6c757d", marginBottom: 4 }}>
                                                Phản hồi của <strong>{selectedReview.repliedByName}</strong>
                                                {" · "}{formatDate(selectedReview.repliedAt)}
                                            </div>
                                            <p style={{ margin: 0, color: "#495057" }}>
                                                {selectedReview.staffReply}
                                            </p>
                                        </div>
                                    )}

                                    {/* Ô nhập phản hồi mới */}
                                    <div className={styles.replySection}>
                                        <label>
                                            {selectedReview.staffReply ? "Chỉnh sửa phản hồi" : "Nội dung phản hồi"}
                                        </label>
                                        <textarea
                                            className={styles.replyTextarea}
                                            rows={4}
                                            placeholder="Nhập phản hồi của bạn..."
                                            value={replyText}
                                            onChange={(e) => {
                                                setReplyText(e.target.value);
                                                if (replyError) setReplyError("");
                                            }}
                                        />
                                        {replyError && (
                                            <div className={styles.errorText}>{replyError}</div>
                                        )}
                                    </div>
                                </div>

                                <div className="modal-footer" style={{ borderTop: "1px solid #f1f3f5" }}>
                                    <button className="btn btn-secondary" onClick={handleCloseModal}>
                                        Hủy
                                    </button>
                                    <button
                                        className="btn"
                                        style={{ background: "#6c63ff", color: "#fff" }}
                                        onClick={handleSubmitReply}
                                        disabled={submitting}
                                    >
                                        {submitting
                                            ? <><span className="spinner-border spinner-border-sm me-1" />Đang gửi...</>
                                            : "Gửi phản hồi"
                                        }
                                    </button>
                                </div>

                            </div>
                        </div>
                    </div>
                    <div className="modal-backdrop fade show" />
                </>
            )}
        </div>
    );
};

export default ReviewPage;