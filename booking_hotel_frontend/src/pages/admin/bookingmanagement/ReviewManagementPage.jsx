import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import managementService from "../../../services/managementService";
import { formatDate, getPageContent } from "../../../utils/customerDataUtils";
import styles from "./ManagementPages.module.css";

const PAGE_SIZE = 10;

const ReviewManagementPage = () => {
  const [reviews, setReviews] = useState([]);
  const [pageInfo, setPageInfo] = useState({ currentPage: 0, totalPages: 0 });
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ rating: 5, comment: "" });

  const fetchReviews = async (page = 0) => {
    try {
      setLoading(true);
      const response = await managementService.getReviews({ page, size: PAGE_SIZE });
      setReviews(getPageContent(response));
      setPageInfo(response?.data || { currentPage: page, totalPages: 0 });
    } catch {
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchReviews(0);
  }, []);

  const openEdit = (review) => {
    setEditing(review);
    setForm({
      rating: review.rating || 5,
      comment: review.comment || "",
    });
  };

  const closeEdit = () => setEditing(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!editing) return;
    try {
      await managementService.updateReview(editing.reviewId, {
        rating: Number(form.rating),
        comment: form.comment,
      });
      toast.success("Review updated successfully");
      closeEdit();
      fetchReviews(pageInfo.currentPage);
    } catch {
      // axiosInstance shows API errors globally.
    }
  };

  const handleDelete = async (review) => {
    if (!window.confirm(`Delete review #${review.reviewId}?`)) return;
    try {
      await managementService.deleteReview(review.reviewId);
      toast.success("Review deleted successfully");
      fetchReviews(pageInfo.currentPage);
    } catch {
      // axiosInstance shows API errors globally.
    }
  };

  const emptyRows = Math.max(PAGE_SIZE - reviews.length, 0);

  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h1>Review Management</h1>
          <p>Manager and Admin can view, edit, and delete customer reviews.</p>
        </div>
        <button
          className={styles.secondaryButton}
          type="button"
          onClick={() => fetchReviews(pageInfo.currentPage)}
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Rating</th>
              <th>Comment</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((review) => (
              <tr key={review.reviewId}>
                <td>{review.reviewId}</td>
                <td>{review.username || "-"}</td>
                <td>{review.rating}</td>
                <td className={styles.commentCell} title={review.comment || ""}>
                  {review.comment || "-"}
                </td>
                <td>{formatDate(review.createdAt)}</td>
                <td>
                  <div className={styles.actions}>
                    <button className={styles.secondaryButton} type="button" onClick={() => openEdit(review)}>
                      Edit
                    </button>
                    <button className={styles.dangerButton} type="button" onClick={() => handleDelete(review)}>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {Array.from({ length: emptyRows }, (_, index) => (
              <tr key={`empty-review-row-${index}`} aria-hidden="true">
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pageInfo.totalPages > 0 && (
        <div className={styles.pagination}>
          <button type="button" disabled={pageInfo.currentPage <= 0} onClick={() => fetchReviews(pageInfo.currentPage - 1)}>
            {"<"}
          </button>
          <button type="button" className={styles.activePage}>
            {pageInfo.currentPage + 1}
          </button>
          <button type="button" disabled={pageInfo.currentPage >= pageInfo.totalPages - 1} onClick={() => fetchReviews(pageInfo.currentPage + 1)}>
            {">"}
          </button>
        </div>
      )}

      {editing && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2>Edit review #{editing.reviewId}</h2>
              <button type="button" onClick={closeEdit}>x</button>
            </div>
            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.field}>
                <label>Rating</label>
                <select
                  value={form.rating}
                  onChange={(event) => setForm((prev) => ({ ...prev, rating: event.target.value }))}
                >
                  <option value={5}>5</option>
                  <option value={4}>4</option>
                  <option value={3}>3</option>
                  <option value={2}>2</option>
                  <option value={1}>1</option>
                </select>
              </div>
              <div className={`${styles.field} ${styles.fieldFull}`}>
                <label>Comment</label>
                <textarea
                  value={form.comment}
                  onChange={(event) => setForm((prev) => ({ ...prev, comment: event.target.value }))}
                />
              </div>
              <div className={styles.modalActions}>
                <button className={styles.secondaryButton} type="button" onClick={closeEdit}>Cancel</button>
                <button className={styles.primaryButton} type="submit">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewManagementPage;
