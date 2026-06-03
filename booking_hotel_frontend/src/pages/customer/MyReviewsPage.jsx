import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchMyReviews } from "../../redux/slices/reviewSlice";
import useAuth from "../../hooks/useAuth";
import styles from "./MyReviewsPage.module.css";

const renderStars = (rating) => (
    <span className={styles.stars}>
        {"★".repeat(rating)}
        {"☆".repeat(5 - rating)}
        <span className={styles.ratingNum}>({rating}/5)</span>
    </span>
);

const formatDate = (dateStr) =>
    dateStr
        ? new Date(dateStr).toLocaleDateString("vi-VN", { day: "2-digit", month: "long", year: "numeric" })
        : "—";

const RATING_OPTIONS = [
    { value: "", label: "Tất cả số sao" },
    { value: "5", label: "★★★★★ (5 sao)" },
    { value: "4", label: "★★★★☆ (4 sao)" },
    { value: "3", label: "★★★☆☆ (3 sao)" },
    { value: "2", label: "★★☆☆☆ (2 sao)" },
    { value: "1", label: "★☆☆☆☆ (1 sao)" },
];

const MyReviewsPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const { items, pagination, loading } = useSelector((state) => state.review.myReviews);

    const [filterRating, setFilterRating] = useState("");
    const [filterDate, setFilterDate] = useState("");
    const [currentPage, setCurrentPage] = useState(0);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/login");
            return;
        }
        const params = { page: currentPage, size: 10, sort: "createdAt,desc" };
        if (filterRating) params.rating = filterRating;
        if (filterDate) {
            params.fromDate = filterDate;
            params.toDate = filterDate;
        }
        dispatch(fetchMyReviews(params));
    }, [dispatch, isAuthenticated, navigate, filterRating, filterDate, currentPage]);

    const handleRatingChange = (e) => {
        setFilterRating(e.target.value);
        setCurrentPage(0);
    };

    const handleDateChange = (e) => {
        setFilterDate(e.target.value);
        setCurrentPage(0);
    };

    const handleClearFilters = () => {
        setFilterRating("");
        setFilterDate("");
        setCurrentPage(0);
    };

    const hasActiveFilter = filterRating || filterDate;

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
            <div className={styles.container}>

                {/* Header bar */}
                <div className={styles.headerBar}>
                    <div className={styles.titleGroup}>
                        <i className="fa-solid fa-star" style={{ color: "#c7a252", marginRight: 10 }} />
                        <span className={styles.title}>Đánh giá của tôi</span>
                        {pagination.totalElements > 0 && (
                            <span className={styles.totalBadge}>{pagination.totalElements}</span>
                        )}
                    </div>
                    <div className={styles.filterGroup}>
                        <input
                            type="date"
                            className={styles.filterControl}
                            value={filterDate}
                            onChange={handleDateChange}
                        />
                        <select
                            className={styles.filterControl}
                            value={filterRating}
                            onChange={handleRatingChange}
                        >
                            {RATING_OPTIONS.map((o) => (
                                <option key={o.value} value={o.value}>{o.label}</option>
                            ))}
                        </select>
                        {hasActiveFilter && (
                            <button className={styles.clearBtn} onClick={handleClearFilters}>
                                <i className="fa-solid fa-xmark" style={{ marginRight: 5 }} />
                                Xóa bộ lọc
                            </button>
                        )}
                    </div>
                </div>

                {/* Content */}
                {loading ? (
                    <div className={styles.emptyState}>
                        <div className="spinner-border" style={{ color: "#c7a252" }} role="status" />
                        <p className={styles.emptyText}>Đang tải...</p>
                    </div>
                ) : items.length === 0 ? (
                    <div className={styles.emptyState}>
                        <i className="fa-regular fa-star" style={{ fontSize: 48, color: "#dee2e6" }} />
                        <p className={styles.emptyText}>Bạn chưa có đánh giá nào</p>
                    </div>
                ) : (
                    <div className={styles.cardList}>
                        {items.map((review) => {
                            const isReplied = !!review.staffReply;
                            return (
                                <div key={review.id} className={styles.card}>
                                    <div className={styles.cardHeader}>
                                        <div className={styles.cardLeft}>
                                            {review.roomName && (
                                                <span className={styles.roomName}>
                                                    <i className="fa-solid fa-door-open" style={{ marginRight: 6, color: "#c7a252" }} />
                                                    {review.roomName}
                                                </span>
                                            )}
                                            <div className={styles.starsRow}>{renderStars(review.rating)}</div>
                                        </div>
                                        <div className={styles.cardRight}>
                                            <span className={isReplied ? styles.badgeReplied : styles.badgePending}>
                                                {isReplied ? (
                                                    <><i className="fa-solid fa-check-circle" /> Đã phản hồi</>
                                                ) : (
                                                    <><i className="fa-regular fa-clock" /> Chờ phản hồi</>
                                                )}
                                            </span>
                                            <span className={styles.reviewDate}>
                                                <i className="fa-regular fa-calendar" style={{ marginRight: 5 }} />
                                                {formatDate(review.createdAt)}
                                            </span>
                                        </div>
                                    </div>

                                    <p className={styles.comment}>{review.comment}</p>

                                    {isReplied && (
                                        <div className={styles.replyBox}>
                                            <div className={styles.replyMeta}>
                                                <i className="fa-solid fa-comment-dots" style={{ color: "#c7a252", marginRight: 6 }} />
                                                <strong>Phản hồi từ khách sạn</strong>
                                                {review.repliedByName && (
                                                    <span className={styles.repliedBy}> · {review.repliedByName}</span>
                                                )}
                                                {review.repliedAt && (
                                                    <span className={styles.repliedAt}> · {formatDate(review.repliedAt)}</span>
                                                )}
                                            </div>
                                            <p className={styles.replyText}>{review.staffReply}</p>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}

                {renderPagination()}
            </div>
        </div>
    );
}; 

export default MyReviewsPage;