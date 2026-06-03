import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import managementService from "../../../services/managementService";
import {
  formatCurrency,
  getResponseData,
} from "../../../utils/customerDataUtils";
import styles from "./ManagementPages.module.css";

const emptyForm = {
  code: "",
  discountPercent: "",
  maxDiscount: "",
  minBookingValue: "",
  usageLimit: "",
  usedCount: "0",
  startDate: "",
  endDate: "",
};

const toInputDateTime = (value) => value?.slice?.(0, 16) || "";
const PAGE_SIZE = 10;

const VoucherManagementPage = () => {
  const [vouchers, setVouchers] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const fetchVouchers = async () => {
    try {
      setLoading(true);
      const response = await managementService.getVouchers();
      const data = getResponseData(response, []);
      setVouchers(Array.isArray(data) ? data : []);
      setCurrentPage(0);
    } catch {
      setVouchers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchVouchers();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (voucher) => {
    setEditing(voucher);
    setForm({
      code: voucher.code || "",
      discountPercent: voucher.discountPercent ?? "",
      maxDiscount: voucher.maxDiscount ?? "",
      minBookingValue: voucher.minBookingValue ?? "",
      usageLimit: voucher.usageLimit ?? "",
      usedCount: voucher.usedCount ?? 0,
      startDate: toInputDateTime(voucher.startDate),
      endDate: toInputDateTime(voucher.endDate),
    });
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const buildPayload = () => ({
    code: form.code.trim(),
    discountPercent: Number(form.discountPercent),
    maxDiscount: Number(form.maxDiscount),
    minBookingValue: Number(form.minBookingValue),
    usageLimit: Number(form.usageLimit),
    usedCount: Number(form.usedCount || 0),
    startDate: form.startDate || null,
    endDate: form.endDate || null,
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const payload = buildPayload();
      if (editing) {
        await managementService.updateVoucher(editing.id, payload);
        toast.success("Voucher updated successfully");
      } else {
        await managementService.createVoucher(payload);
        toast.success("Voucher created successfully");
      }
      closeModal();
      fetchVouchers();
    } catch {
      // axiosInstance shows API errors globally.
    }
  };

  const handleDelete = async (voucher) => {
    if (!window.confirm(`Delete voucher ${voucher.code}?`)) return;
    try {
      await managementService.deleteVoucher(voucher.id);
      toast.success("Voucher deleted successfully");
      fetchVouchers();
    } catch {
      // axiosInstance shows API errors globally.
    }
  };

  const totalPages = Math.ceil(vouchers.length / PAGE_SIZE);
  const pagedVouchers = vouchers.slice(
    currentPage * PAGE_SIZE,
    currentPage * PAGE_SIZE + PAGE_SIZE,
  );

  const handlePageChange = (page) => {
    if (page < 0 || page >= totalPages || page === currentPage) return;
    setCurrentPage(page);
  };

  const emptyRows = Math.max(PAGE_SIZE - pagedVouchers.length, 0);

  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h1>Voucher Management</h1>
          <p>Manager and Admin can create, update, and delete vouchers.</p>
        </div>
        <button className={styles.primaryButton} type="button" onClick={openCreate}>
          New voucher
        </button>
      </div>

      <div className={styles.toolbar}>
        <span className={styles.counter}>
          {loading ? "Loading..." : `${vouchers.length} vouchers`}
        </span>
        <button className={styles.secondaryButton} type="button" onClick={fetchVouchers}>
          Refresh
        </button>
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>STT</th>
              <th>CODE</th>
              <th>Discount Percent</th>
              <th>Max Discount</th>
              <th>Min Booking Value</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pagedVouchers.map((voucher, index) => (
              <tr key={voucher.id || voucher.code}>
                <td>{currentPage * PAGE_SIZE + index + 1}</td>
                <td>{voucher.code}</td>
                <td>{voucher.discountPercent}%</td>
                <td>{formatCurrency(voucher.maxDiscount)}</td>
                <td>{formatCurrency(voucher.minBookingValue)}</td>
                <td>
                  <div className={styles.actions}>
                    <button className={styles.secondaryButton} type="button" onClick={() => openEdit(voucher)}>
                      Edit
                    </button>
                    <button className={styles.dangerButton} type="button" onClick={() => handleDelete(voucher)}>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {Array.from({ length: emptyRows }, (_, index) => (
              <tr key={`empty-voucher-row-${index}`} aria-hidden="true">
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

      {totalPages > 0 && (
        <div className={styles.pagination}>
          <button
            type="button"
            disabled={currentPage <= 0}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            {"<"}
          </button>
          <button type="button" className={styles.activePage}>
            {currentPage + 1}
          </button>
          <button
            type="button"
            disabled={currentPage >= totalPages - 1}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            {">"}
          </button>
        </div>
      )}

      {modalOpen && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2>{editing ? "Edit voucher" : "Create voucher"}</h2>
              <button type="button" onClick={closeModal}>x</button>
            </div>
            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.field}>
                <label>CODE</label>
                <input name="code" value={form.code} onChange={handleChange} required />
              </div>
              <div className={styles.field}>
                <label>Discount Percent</label>
                <input name="discountPercent" type="number" min="1" max="100" value={form.discountPercent} onChange={handleChange} required />
              </div>
              <div className={styles.field}>
                <label>Max Discount</label>
                <input name="maxDiscount" type="number" min="0" value={form.maxDiscount} onChange={handleChange} required />
              </div>
              <div className={styles.field}>
                <label>Min Booking Value</label>
                <input name="minBookingValue" type="number" min="0" value={form.minBookingValue} onChange={handleChange} required />
              </div>
              <div className={styles.field}>
                <label>Usage Limit</label>
                <input name="usageLimit" type="number" min="1" value={form.usageLimit} onChange={handleChange} required />
              </div>
              <div className={styles.field}>
                <label>Used Count</label>
                <input name="usedCount" type="number" min="0" value={form.usedCount} onChange={handleChange} />
              </div>
              <div className={styles.field}>
                <label>Start Date</label>
                <input name="startDate" type="datetime-local" value={form.startDate} onChange={handleChange} required />
              </div>
              <div className={styles.field}>
                <label>End Date</label>
                <input name="endDate" type="datetime-local" value={form.endDate} onChange={handleChange} required />
              </div>
              <div className={styles.modalActions}>
                <button className={styles.secondaryButton} type="button" onClick={closeModal}>Cancel</button>
                <button className={styles.primaryButton} type="submit">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VoucherManagementPage;
