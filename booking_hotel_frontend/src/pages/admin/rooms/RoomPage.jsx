import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as LucideIcons from "lucide-react";
import {
    fetchRooms,
    fetchRoomStatuses,
    fetchRoomTypes,
    createRoom,
    updateRoom,
    deleteRoom,
    restoreRoom,
} from "../../../redux/slices/roomSlice";
import roomService from "../../../services/roomService";
import furnitureService from "../../../services/furnitureService";
import toast from "react-hot-toast";
import styles from "./RoomPage.module.css";

const STATUS_CONFIG = {
    READY:    { label: "Sẵn sàng",     bg: "#d4edda", color: "#155724" },
    OCCUPIED: { label: "Đang sử dụng", bg: "#cce5ff", color: "#004085" },
    CLEANING: { label: "Đang dọn",     bg: "#fff3cd", color: "#856404" },
    MAINTAIN: { label: "Bảo trì",      bg: "#ffe8d6", color: "#7d4100" },
    DIRTY:    { label: "Bẩn",          bg: "#f8d7da", color: "#721c24" },
};

const TYPE_CONFIG = {
    STANDARD: { label: "Standard", bg: "#e9ecef", color: "#495057" },
    SUPERIOR: { label: "Superior", bg: "#d1ecf1", color: "#0c5460" },
    DELUXE:   { label: "Deluxe",   bg: "#e2d9f3", color: "#4a0e8f" },
    VIP:      { label: "VIP",      bg: "#fff3cd", color: "#856404" },
    SUITE:    { label: "Suite",    bg: "#d6d8db", color: "#1b1e21" },
    FAMILY:   { label: "Family",   bg: "#d4f0ff", color: "#004d70" },
};

const EMPTY_FORM = { roomNumber: "", floor: "", roomType: "", status: "", description: "" };

const DynamicIcon = ({ name, size = 15 }) => {
    if (!name) return null;
    const Icon = LucideIcons[name];
    if (!Icon) return null;
    return <Icon size={size} />;
};

const RoomPage = () => {
    const dispatch = useDispatch();
    const { items, statuses, roomTypes, pagination, loading, submitting } = useSelector((s) => s.room);

    // ── Filter state ──────────────────────────────────────────────
    const [filterRoomNumber, setFilterRoomNumber] = useState("");
    const [filterFloor, setFilterFloor] = useState("");
    const [filterRoomType, setFilterRoomType] = useState("");
    const [filterStatus, setFilterStatus] = useState("");
    const [showDeleted, setShowDeleted] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);

    const numberDebRef = useRef(null);
    const floorDebRef = useRef(null);
    const filtersRef = useRef({ roomNumber: "", floor: "", roomType: "", status: "", showDeleted: false });

    // ── Create modal ──────────────────────────────────────────────
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [formData, setFormData] = useState(EMPTY_FORM);
    const [formErrors, setFormErrors] = useState({});

    // ── Detail modal ──────────────────────────────────────────────
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [roomDetail, setRoomDetail] = useState(null);
    const [detailLoading, setDetailLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("info");

    const [infoForm, setInfoForm] = useState({ roomType: "", status: "", description: "", price: "", area: "", maxPeople: "" });
    const [infoErrors, setInfoErrors] = useState({});
    const [infoSaving, setInfoSaving] = useState(false);

    const [allFurnitures, setAllFurnitures] = useState([]);
    const [selectedFurnitureIds, setSelectedFurnitureIds] = useState(new Set());
    const [furnitureSaving, setFurnitureSaving] = useState(false);

    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [imageUploading, setImageUploading] = useState(false);

    // ── Delete / Restore modal ────────────────────────────────────
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showRestoreModal, setShowRestoreModal] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState(null);

    // ── Initial load ──────────────────────────────────────────────
    useEffect(() => {
        dispatch(fetchRoomStatuses());
        dispatch(fetchRoomTypes());
        dispatch(fetchRooms({ page: 0, size: 20, sort: "roomNumber,asc", isDeleted: false }));
    }, [dispatch]);

    // ── Filter helpers ────────────────────────────────────────────
    const buildParams = (page = 0) => {
        const f = filtersRef.current;
        const params = { page, size: 20, sort: "roomNumber,asc", isDeleted: f.showDeleted };
        if (f.roomNumber.trim()) params.roomNumber = f.roomNumber.trim();
        const floorNum = parseInt(f.floor);
        if (!isNaN(floorNum) && floorNum > 0) params.floor = floorNum;
        if (f.roomType) params.roomTypeName = f.roomType;
        if (f.status) params.status = f.status;
        return params;
    };

    const handleRoomNumberChange = (e) => {
        const val = e.target.value;
        setFilterRoomNumber(val);
        filtersRef.current.roomNumber = val;
        clearTimeout(numberDebRef.current);
        numberDebRef.current = setTimeout(() => {
            setCurrentPage(0);
            dispatch(fetchRooms(buildParams(0)));
        }, 500);
    };

    const handleFloorChange = (e) => {
        const val = e.target.value;
        setFilterFloor(val);
        filtersRef.current.floor = val;
        clearTimeout(floorDebRef.current);
        floorDebRef.current = setTimeout(() => {
            setCurrentPage(0);
            dispatch(fetchRooms(buildParams(0)));
        }, 500);
    };

    const handleRoomTypeChange = (e) => {
        const val = e.target.value;
        setFilterRoomType(val);
        filtersRef.current.roomType = val;
        setCurrentPage(0);
        dispatch(fetchRooms(buildParams(0)));
    };

    const handleStatusChange = (e) => {
        const val = e.target.value;
        setFilterStatus(val);
        filtersRef.current.status = val;
        setCurrentPage(0);
        dispatch(fetchRooms(buildParams(0)));
    };

    const handleShowDeletedChange = (e) => {
        const val = e.target.checked;
        setShowDeleted(val);
        filtersRef.current.showDeleted = val;
        setCurrentPage(0);
        dispatch(fetchRooms(buildParams(0)));
    };

    const handleReset = () => {
        clearTimeout(numberDebRef.current);
        clearTimeout(floorDebRef.current);
        setFilterRoomNumber("");
        setFilterFloor("");
        setFilterRoomType("");
        setFilterStatus("");
        setShowDeleted(false);
        setCurrentPage(0);
        filtersRef.current = { roomNumber: "", floor: "", roomType: "", status: "", showDeleted: false };
        dispatch(fetchRooms({ page: 0, size: 20, sort: "roomNumber,asc", isDeleted: false }));
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
        dispatch(fetchRooms(buildParams(page)));
    };

    // ── Create ────────────────────────────────────────────────────
    const validateCreateForm = () => {
        const errors = {};
        if (!formData.roomNumber.trim()) errors.roomNumber = "Số phòng không được để trống";
        if (!formData.floor) {
            errors.floor = "Tầng không được để trống";
        } else if (isNaN(parseInt(formData.floor)) || parseInt(formData.floor) < 1) {
            errors.floor = "Tầng phải là số nguyên dương";
        }
        if (!formData.roomType) errors.roomType = "Vui lòng chọn loại phòng";
        if (!formData.status) errors.status = "Vui lòng chọn trạng thái";
        return errors;
    };

    const handleOpenCreate = () => {
        setFormData(EMPTY_FORM);
        setFormErrors({});
        setShowCreateModal(true);
    };

    const handleCreate = async () => {
        const errors = validateCreateForm();
        if (Object.keys(errors).length > 0) { setFormErrors(errors); return; }
        const result = await dispatch(
            createRoom({
                roomNumber: formData.roomNumber.trim(),
                floor: parseInt(formData.floor),
                roomType: formData.roomType,
                status: formData.status,
                description: formData.description?.trim() ?? "",
            })
        );
        if (createRoom.fulfilled.match(result)) {
            toast.success("Tạo phòng thành công");
            setShowCreateModal(false);
        } else {
            toast.error(result.payload || "Tạo phòng thất bại");
        }
    };

    // ── Detail modal ──────────────────────────────────────────────
    const handleOpenDetail = async (room) => {
        setActiveTab("info");
        setInfoErrors({});
        setImageFile(null);
        setImagePreview(null);
        setShowDetailModal(true);
        setDetailLoading(true);
        try {
            const [detail, furnitureResult] = await Promise.all([
                roomService.getDetail(room.id),
                furnitureService.getAll({ page: 0, size: 200 }),
            ]);
            setRoomDetail(detail);
            setInfoForm({
                roomType: detail.roomType,
                status: detail.status,
                description: detail.description ?? "",
                price: detail.price ?? "",
                area: detail.area ?? "",
                maxPeople: detail.maxPeople ?? "",
            });
            setSelectedFurnitureIds(new Set((detail.furnitures || []).map((f) => f.id)));
            setAllFurnitures(Array.isArray(furnitureResult) ? furnitureResult : (furnitureResult?.content || []));
        } catch {
            toast.error("Không thể tải chi tiết phòng");
            setShowDetailModal(false);
        } finally {
            setDetailLoading(false);
        }
    };

    const handleCloseDetail = () => {
        if (imagePreview) URL.revokeObjectURL(imagePreview);
        setImagePreview(null);
        setImageFile(null);
        setRoomDetail(null);
        setAllFurnitures([]);
        setShowDetailModal(false);
    };

    const handleSaveInfo = async () => {
        const errors = {};
        if (!infoForm.roomType) errors.roomType = "Vui lòng chọn loại phòng";
        if (!infoForm.status) errors.status = "Vui lòng chọn trạng thái";
        if (Object.keys(errors).length > 0) { setInfoErrors(errors); return; }

        setInfoSaving(true);
        const result = await dispatch(
            updateRoom({
                id: roomDetail.id,
                data: {
                    roomType: infoForm.roomType,
                    status: infoForm.status,
                    description: infoForm.description?.trim() ?? "",
                    price: infoForm.price !== "" ? Number(infoForm.price) : null,
                    area: infoForm.area !== "" ? Number(infoForm.area) : null,
                    maxPeople: infoForm.maxPeople !== "" ? parseInt(infoForm.maxPeople) : null,
                },
            })
        );
        setInfoSaving(false);
        if (updateRoom.fulfilled.match(result)) {
            setRoomDetail((prev) => ({ ...prev, ...result.payload }));
            toast.success("Cập nhật thông tin thành công");
        } else {
            toast.error(result.payload || "Cập nhật thất bại");
        }
    };

    const toggleFurniture = (id) => {
        setSelectedFurnitureIds((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const handleSaveFurnitures = async () => {
        setFurnitureSaving(true);
        try {
            const updatedDetail = await roomService.updateFurnitures(
                roomDetail.id,
                Array.from(selectedFurnitureIds)
            );
            setRoomDetail(updatedDetail);
            toast.success("Cập nhật nội thất thành công");
        } catch (err) {
            toast.error(err.response?.data?.message || "Cập nhật nội thất thất bại");
        } finally {
            setFurnitureSaving(false);
        }
    };

    const handleImageFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (imagePreview) URL.revokeObjectURL(imagePreview);
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const handleUploadImage = async () => {
        if (!imageFile) { toast.error("Vui lòng chọn ảnh"); return; }
        setImageUploading(true);
        try {
            const imageUrl = await roomService.uploadImage(roomDetail.id, imageFile);
            setRoomDetail((prev) => ({ ...prev, imageUrl }));
            URL.revokeObjectURL(imagePreview);
            setImageFile(null);
            setImagePreview(null);
            toast.success("Tải ảnh lên thành công");
        } catch (err) {
            toast.error(err.response?.data?.message || "Tải ảnh thất bại");
        } finally {
            setImageUploading(false);
        }
    };

    // ── Delete / Restore ──────────────────────────────────────────
    const handleOpenDelete = (room) => {
        setSelectedRoom(room);
        setShowDeleteModal(true);
    };

    const handleDelete = async () => {
        const result = await dispatch(deleteRoom(selectedRoom.id));
        if (deleteRoom.fulfilled.match(result)) {
            toast.success("Đã xóa phòng");
            setShowDeleteModal(false);
        } else {
            toast.error(result.payload || "Xóa phòng thất bại");
        }
    };

    const handleOpenRestore = (room) => {
        setSelectedRoom(room);
        setShowRestoreModal(true);
    };

    const handleRestore = async () => {
        const result = await dispatch(restoreRoom(selectedRoom.id));
        if (restoreRoom.fulfilled.match(result)) {
            toast.success("Khôi phục phòng thành công");
            setShowRestoreModal(false);
        } else {
            toast.error(result.payload || "Khôi phục thất bại");
        }
    };

    // ── Helpers ───────────────────────────────────────────────────
    const formatDate = (dateStr) => {
        if (!dateStr) return "-";
        return new Date(dateStr).toLocaleDateString("vi-VN");
    };

    const formatPrice = (price) => {
        if (!price) return "-";
        return Number(price).toLocaleString("vi-VN") + " ₫";
    };

    const getImageSrc = (url) => {
        if (!url) return null;
        if (url.startsWith("http")) return url;
        return `http://localhost:8080${url}`;
    };

    const groupedFurnitures = allFurnitures.reduce((acc, f) => {
        const type = f.furnitureType || "Khác";
        if (!acc[type]) acc[type] = [];
        acc[type].push(f);
        return acc;
    }, {});

    // ── Render ────────────────────────────────────────────────────
    return (
        <div>
            {/* Filter bar */}
            <div className={styles.filterBar}>
                <input
                    type="text"
                    className={`form-control ${styles.filterInput}`}
                    placeholder="Tìm số phòng..."
                    value={filterRoomNumber}
                    onChange={handleRoomNumberChange}
                />
                <input
                    type="number"
                    className={`form-control ${styles.filterInputSm}`}
                    placeholder="Tầng"
                    value={filterFloor}
                    min={1}
                    onChange={handleFloorChange}
                />
                <select className={`form-select ${styles.filterSelect}`} value={filterRoomType} onChange={handleRoomTypeChange}>
                    <option value="">Tất cả loại</option>
                    {roomTypes.map((t) => (
                        <option key={t} value={t}>{TYPE_CONFIG[t]?.label || t}</option>
                    ))}
                </select>
                <select className={`form-select ${styles.filterSelect}`} value={filterStatus} onChange={handleStatusChange}>
                    <option value="">Tất cả trạng thái</option>
                    {statuses.map((s) => (
                        <option key={s} value={s}>{STATUS_CONFIG[s]?.label || s}</option>
                    ))}
                </select>
                <label className={styles.checkboxLabel}>
                    <input type="checkbox" checked={showDeleted} onChange={handleShowDeletedChange} />
                    &nbsp;Đã xóa
                </label>
                <button className={`btn btn-outline-secondary ${styles.filterBtn}`} onClick={handleReset}>
                    Đặt lại
                </button>
                <button className={`btn btn-primary ${styles.filterBtn}`} onClick={handleOpenCreate}>
                    + Thêm phòng
                </button>
            </div>

            <div className={styles.counter}>
                Tổng: <strong>{pagination.totalElements}</strong> phòng
            </div>

            {/* Table */}
            <div className={styles.tableWrapper}>
                <table className={`table ${styles.table}`}>
                    <thead>
                        <tr>
                            <th style={{ width: 48 }}>STT</th>
                            <th>Số phòng</th>
                            <th>Tầng</th>
                            <th>Loại phòng</th>
                            <th>Trạng thái</th>
                            <th>Ngày tạo</th>
                            <th>Cập nhật</th>
                            <th style={{ width: 130 }}>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={8}>
                                    <div className={styles.loadingWrapper}>
                                        <div className="spinner-border spinner-border-sm text-primary" role="status" />
                                        &nbsp; Đang tải...
                                    </div>
                                </td>
                            </tr>
                        ) : items.length === 0 ? (
                            <tr>
                                <td colSpan={8}>
                                    <div className={styles.emptyState}><p>Không có dữ liệu phòng</p></div>
                                </td>
                            </tr>
                        ) : (
                            items.map((room, index) => (
                                <tr key={room.id} className={room.isDeleted ? styles.deletedRow : ""}>
                                    <td>{pagination.currentPage * pagination.pageSize + index + 1}</td>
                                    <td className={styles.roomNumberCell}>{room.roomNumber}</td>
                                    <td>{room.floor}</td>
                                    <td>
                                        <span className={styles.badge} style={{
                                            backgroundColor: TYPE_CONFIG[room.roomType]?.bg || "#e9ecef",
                                            color: TYPE_CONFIG[room.roomType]?.color || "#495057",
                                        }}>
                                            {TYPE_CONFIG[room.roomType]?.label || room.roomType}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={styles.badge} style={{
                                            backgroundColor: STATUS_CONFIG[room.status]?.bg || "#e9ecef",
                                            color: STATUS_CONFIG[room.status]?.color || "#495057",
                                        }}>
                                            {STATUS_CONFIG[room.status]?.label || room.status}
                                        </span>
                                    </td>
                                    <td>{formatDate(room.createdAt)}</td>
                                    <td>{formatDate(room.updatedAt)}</td>
                                    <td>
                                        <div className={styles.actionGroup}>
                                            {!room.isDeleted ? (
                                                <>
                                                    <button className={styles.btnDetail} onClick={() => handleOpenDetail(room)}>
                                                        Chi tiết
                                                    </button>
                                                    <button className={styles.btnDelete} onClick={() => handleOpenDelete(room)}>
                                                        Xóa
                                                    </button>
                                                </>
                                            ) : (
                                                <button className={styles.btnRestore} onClick={() => handleOpenRestore(room)}>
                                                    Khôi phục
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {!loading && pagination.totalPages > 1 && (
                <div className={styles.pagination}>
                    <button className="btn btn-sm btn-outline-secondary" disabled={currentPage === 0} onClick={() => handlePageChange(currentPage - 1)}>‹</button>
                    {pagination.totalPages <= 7
                        ? Array.from({ length: pagination.totalPages }, (_, i) => (
                              <button key={i} className={`btn btn-sm ${i === currentPage ? "btn-primary" : "btn-outline-secondary"}`} onClick={() => handlePageChange(i)}>
                                  {i + 1}
                              </button>
                          ))
                        : <span className={styles.pageInfo}>Trang {currentPage + 1} / {pagination.totalPages}</span>
                    }
                    <button className="btn btn-sm btn-outline-secondary" disabled={pagination.last} onClick={() => handlePageChange(currentPage + 1)}>›</button>
                </div>
            )}

            {/* ══ CREATE MODAL ══════════════════════════════════════════ */}
            {showCreateModal && (
                <>
                    <div className="modal fade show d-block" tabIndex="-1">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className={`modal-header ${styles.modalHeader}`}>
                                    <h5 className={styles.modalTitle}>Thêm phòng mới</h5>
                                    <button type="button" className="btn-close" onClick={() => setShowCreateModal(false)} />
                                </div>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label className={styles.formLabel}>Số phòng <span className="text-danger">*</span></label>
                                        <input type="text" className={`form-control ${styles.formControl} ${formErrors.roomNumber ? "is-invalid" : ""}`}
                                            placeholder="VD: 101, A201..."
                                            value={formData.roomNumber}
                                            onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })} />
                                        {formErrors.roomNumber && <div className={styles.errorText}>{formErrors.roomNumber}</div>}
                                    </div>
                                    <div className="mb-3">
                                        <label className={styles.formLabel}>Tầng <span className="text-danger">*</span></label>
                                        <input type="number" min={1} className={`form-control ${styles.formControl} ${formErrors.floor ? "is-invalid" : ""}`}
                                            placeholder="VD: 1, 2, 3..."
                                            value={formData.floor}
                                            onChange={(e) => setFormData({ ...formData, floor: e.target.value })} />
                                        {formErrors.floor && <div className={styles.errorText}>{formErrors.floor}</div>}
                                    </div>
                                    <div className="mb-3">
                                        <label className={styles.formLabel}>Loại phòng <span className="text-danger">*</span></label>
                                        <select className={`form-select ${styles.formControl} ${formErrors.roomType ? "is-invalid" : ""}`}
                                            value={formData.roomType}
                                            onChange={(e) => setFormData({ ...formData, roomType: e.target.value })}>
                                            <option value="">-- Chọn loại phòng --</option>
                                            {roomTypes.map((t) => <option key={t} value={t}>{TYPE_CONFIG[t]?.label || t}</option>)}
                                        </select>
                                        {formErrors.roomType && <div className={styles.errorText}>{formErrors.roomType}</div>}
                                    </div>
                                    <div className="mb-3">
                                        <label className={styles.formLabel}>Trạng thái <span className="text-danger">*</span></label>
                                        <select className={`form-select ${styles.formControl} ${formErrors.status ? "is-invalid" : ""}`}
                                            value={formData.status}
                                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
                                            <option value="">-- Chọn trạng thái --</option>
                                            {statuses.map((s) => <option key={s} value={s}>{STATUS_CONFIG[s]?.label || s}</option>)}
                                        </select>
                                        {formErrors.status && <div className={styles.errorText}>{formErrors.status}</div>}
                                    </div>
                                    <div className="mb-3">
                                        <label className={styles.formLabel}>Mô tả</label>
                                        <textarea rows={3} className={`form-control ${styles.formControl}`}
                                            placeholder="Mô tả ngắn về phòng..."
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button className="btn btn-secondary btn-sm" onClick={() => setShowCreateModal(false)}>Hủy</button>
                                    <button className="btn btn-primary btn-sm" onClick={handleCreate} disabled={submitting}>
                                        {submitting ? "Đang lưu..." : "Tạo phòng"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="modal-backdrop fade show" />
                </>
            )}

            {/* ══ DETAIL MODAL ══════════════════════════════════════════ */}
            {showDetailModal && (
                <>
                    <div className="modal fade show d-block" tabIndex="-1">
                        <div className="modal-dialog modal-xl modal-dialog-scrollable">
                            <div className="modal-content">
                                <div className={`modal-header ${styles.modalHeader}`}>
                                    <div>
                                        <h5 className={styles.modalTitle}>
                                            Phòng {roomDetail?.roomNumber}
                                            {roomDetail && (
                                                <span className={styles.badge} style={{
                                                    backgroundColor: STATUS_CONFIG[roomDetail.status]?.bg,
                                                    color: STATUS_CONFIG[roomDetail.status]?.color,
                                                    marginLeft: 10, fontSize: 12,
                                                }}>
                                                    {STATUS_CONFIG[roomDetail.status]?.label || roomDetail.status}
                                                </span>
                                            )}
                                        </h5>
                                    </div>
                                    <button type="button" className="btn-close" onClick={handleCloseDetail} />
                                </div>

                                <div className="modal-body">
                                    {detailLoading ? (
                                        <div className={styles.loadingWrapper}>
                                            <div className="spinner-border text-primary" role="status" />
                                            <div className="mt-2">Đang tải dữ liệu...</div>
                                        </div>
                                    ) : roomDetail && (
                                        <>
                                            {/* ── Top: Ảnh + Info (luôn hiển thị) ── */}
                                            <div className={styles.detailTop}>
                                                {/* Ảnh phòng */}
                                                <div className={styles.detailImageCol}>
                                                    <label className={styles.detailImageWrapper}>
                                                        <input type="file" accept="image/*" hidden onChange={handleImageFileChange} />
                                                        {imagePreview ? (
                                                            <img src={imagePreview} alt="preview" className={styles.roomImage} />
                                                        ) : roomDetail.imageUrl ? (
                                                            <img src={getImageSrc(roomDetail.imageUrl)} alt="room" className={styles.roomImage} />
                                                        ) : (
                                                            <div className={styles.imagePlaceholder}>
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                                                    <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
                                                                    <polyline points="21 15 16 10 5 21"/>
                                                                </svg>
                                                                <p>Chưa có ảnh</p>
                                                            </div>
                                                        )}
                                                        <div className={styles.detailImageOverlay}>
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                                                                <circle cx="12" cy="13" r="4"/>
                                                            </svg>
                                                            <span>Thay ảnh</span>
                                                        </div>
                                                    </label>
                                                    {imageFile && (
                                                        <div className={styles.imageConfirmBar}>
                                                            <span className={styles.imageFileName}>{imageFile.name}</span>
                                                            <div className={styles.imageConfirmActions}>
                                                                <button className="btn btn-primary btn-sm" onClick={handleUploadImage} disabled={imageUploading}>
                                                                    {imageUploading ? "Đang tải..." : "Xác nhận"}
                                                                </button>
                                                                <button className="btn btn-outline-secondary btn-sm" onClick={() => { URL.revokeObjectURL(imagePreview); setImageFile(null); setImagePreview(null); }}>
                                                                    Hủy
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Nội thất - dưới ảnh */}
                                                    <div className={styles.furnitureChipsSection}>
                                                        <span className={styles.furnitureChipsLabel}>
                                                            Nội thất
                                                            <span className={styles.furnitureCount}>{roomDetail.furnitures?.length || 0} món</span>
                                                        </span>
                                                        {roomDetail.furnitures?.length > 0 ? (
                                                            <div className={styles.currentFurnitures}>
                                                                {roomDetail.furnitures.map((f) => (
                                                                    <div key={f.id} className={styles.currentFurnitureTag}>
                                                                        <span className={styles.furnitureIcon}><DynamicIcon name={f.icon} size={12} /></span>
                                                                        <span>{f.furnitureName}</span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <span className={styles.noFurnitureText}>Chưa có</span>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Thông tin phòng */}
                                                <div className={styles.detailInfoCol}>
                                                    <div className={styles.infoGrid}>
                                                        {[
                                                            { label: "Số phòng",  value: roomDetail.roomNumber },
                                                            { label: "Tầng",      value: roomDetail.floor },
                                                            { label: "Giá",       value: formatPrice(roomDetail.price) },
                                                            { label: "Diện tích", value: roomDetail.area ? `${roomDetail.area} m²` : "-" },
                                                            { label: "Sức chứa",  value: roomDetail.maxPeople ? `${roomDetail.maxPeople} người` : "-" },
                                                            { label: "Ngày tạo",  value: formatDate(roomDetail.createdAt) },
                                                            { label: "Cập nhật",  value: formatDate(roomDetail.updatedAt) },
                                                        ].map(({ label, value }) => (
                                                            <div key={label} className={styles.infoCard}>
                                                                <div className={styles.infoLabel}>{label}</div>
                                                                <div className={styles.infoValue}>{value}</div>
                                                            </div>
                                                        ))}
                                                    </div>

                                                    {roomDetail.description && (
                                                        <div className={styles.descriptionBox}>{roomDetail.description}</div>
                                                    )}
                                                </div>
                                            </div>

                                            <hr className="my-3" />

                                            {/* ── Tabs ── */}
                                            <ul className="nav nav-tabs mb-3">
                                                {[
                                                    { key: "info",      label: "Cập nhật thông tin" },
                                                    { key: "furniture", label: "Quản lý nội thất" },
                                                ].map((tab) => (
                                                    <li key={tab.key} className="nav-item">
                                                        <button
                                                            className={`nav-link ${activeTab === tab.key ? "active" : ""}`}
                                                            style={{ fontSize: 13 }}
                                                            onClick={() => setActiveTab(tab.key)}
                                                        >
                                                            {tab.label}
                                                        </button>
                                                    </li>
                                                ))}
                                            </ul>

                                            {/* ── Tab: Cập nhật thông tin ── */}
                                            {activeTab === "info" && (
                                                <div>
                                                    <div className="row g-3">
                                                        <div className="col-md-6">
                                                            <label className={styles.formLabel}>Loại phòng <span className="text-danger">*</span></label>
                                                            <select className={`form-select ${styles.formControl} ${infoErrors.roomType ? "is-invalid" : ""}`}
                                                                value={infoForm.roomType}
                                                                onChange={(e) => setInfoForm({ ...infoForm, roomType: e.target.value })}>
                                                                <option value="">-- Chọn --</option>
                                                                {roomTypes.map((t) => <option key={t} value={t}>{TYPE_CONFIG[t]?.label || t}</option>)}
                                                            </select>
                                                            {infoErrors.roomType && <div className={styles.errorText}>{infoErrors.roomType}</div>}
                                                        </div>
                                                        <div className="col-md-6">
                                                            <label className={styles.formLabel}>Trạng thái <span className="text-danger">*</span></label>
                                                            <select className={`form-select ${styles.formControl} ${infoErrors.status ? "is-invalid" : ""}`}
                                                                value={infoForm.status}
                                                                onChange={(e) => setInfoForm({ ...infoForm, status: e.target.value })}>
                                                                <option value="">-- Chọn --</option>
                                                                {statuses.map((s) => <option key={s} value={s}>{STATUS_CONFIG[s]?.label || s}</option>)}
                                                            </select>
                                                            {infoErrors.status && <div className={styles.errorText}>{infoErrors.status}</div>}
                                                        </div>
                                                        <div className="col-md-4">
                                                            <label className={styles.formLabel}>Giá (₫/đêm)</label>
                                                            <input type="number" min={0} className={`form-control ${styles.formControl}`}
                                                                placeholder="VD: 500000"
                                                                value={infoForm.price}
                                                                onChange={(e) => setInfoForm({ ...infoForm, price: e.target.value })} />
                                                        </div>
                                                        <div className="col-md-4">
                                                            <label className={styles.formLabel}>Diện tích (m²)</label>
                                                            <input type="number" min={0} step="0.1" className={`form-control ${styles.formControl}`}
                                                                placeholder="VD: 25.5"
                                                                value={infoForm.area}
                                                                onChange={(e) => setInfoForm({ ...infoForm, area: e.target.value })} />
                                                        </div>
                                                        <div className="col-md-4">
                                                            <label className={styles.formLabel}>Sức chứa (người)</label>
                                                            <input type="number" min={1} className={`form-control ${styles.formControl}`}
                                                                placeholder="VD: 2"
                                                                value={infoForm.maxPeople}
                                                                onChange={(e) => setInfoForm({ ...infoForm, maxPeople: e.target.value })} />
                                                        </div>
                                                        <div className="col-12">
                                                            <label className={styles.formLabel}>Mô tả</label>
                                                            <textarea rows={3} className={`form-control ${styles.formControl}`}
                                                                placeholder="Mô tả ngắn về phòng..."
                                                                value={infoForm.description}
                                                                onChange={(e) => setInfoForm({ ...infoForm, description: e.target.value })} />
                                                        </div>
                                                    </div>
                                                    <div className="mt-3 text-end">
                                                        <button className="btn btn-primary btn-sm" onClick={handleSaveInfo} disabled={infoSaving}>
                                                            {infoSaving ? "Đang lưu..." : "Lưu thay đổi"}
                                                        </button>
                                                    </div>
                                                </div>
                                            )}

                                            {/* ── Tab: Quản lý nội thất ── */}
                                            {activeTab === "furniture" && (
                                                <div>
                                                    <p className={styles.sectionTitle}>
                                                        Đã chọn: <strong>{selectedFurnitureIds.size}</strong> nội thất
                                                    </p>
                                                    {Object.keys(groupedFurnitures).length === 0 ? (
                                                        <div className={styles.emptyState}><p>Chưa có nội thất nào trong hệ thống</p></div>
                                                    ) : (
                                                        <div className={styles.furnitureGroups}>
                                                            {Object.entries(groupedFurnitures).map(([type, list]) => (
                                                                <div key={type} className={styles.furnitureGroup}>
                                                                    <div className={styles.furnitureGroupTitle}>{type}</div>
                                                                    <div className={styles.furnitureGrid}>
                                                                        {list.map((f) => (
                                                                            <label key={f.id} className={`${styles.furnitureItem} ${selectedFurnitureIds.has(f.id) ? styles.furnitureItemSelected : ""}`}>
                                                                                <input type="checkbox" className={styles.furnitureCheckbox}
                                                                                    checked={selectedFurnitureIds.has(f.id)}
                                                                                    onChange={() => toggleFurniture(f.id)} />
                                                                                <span className={styles.furnitureIcon}><DynamicIcon name={f.icon} size={15} /></span>
                                                                                <span className={styles.furnitureName}>{f.furnitureName}</span>
                                                                            </label>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                    <div className="mt-3 text-end">
                                                        <button className="btn btn-primary btn-sm" onClick={handleSaveFurnitures} disabled={furnitureSaving}>
                                                            {furnitureSaving ? "Đang lưu..." : "Cập nhật nội thất"}
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="modal-backdrop fade show" />
                </>
            )}

            {/* ══ DELETE MODAL ══════════════════════════════════════════ */}
            {showDeleteModal && (
                <>
                    <div className="modal fade show d-block" tabIndex="-1">
                        <div className="modal-dialog modal-sm">
                            <div className="modal-content">
                                <div className={`modal-header ${styles.modalHeader}`}>
                                    <h5 className={styles.modalTitle}>Xác nhận xóa</h5>
                                    <button type="button" className="btn-close" onClick={() => setShowDeleteModal(false)} />
                                </div>
                                <div className={`modal-body ${styles.deleteModalBody}`}>
                                    <div className={styles.deleteIcon}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="3 6 5 6 21 6" />
                                            <path d="M19 6l-1 14H6L5 6" />
                                            <path d="M10 11v6" /><path d="M14 11v6" />
                                            <path d="M9 6V4h6v2" />
                                        </svg>
                                    </div>
                                    <h6>Xóa phòng {selectedRoom?.roomNumber}?</h6>
                                    <p>Phòng sẽ bị ẩn và có thể khôi phục lại sau.</p>
                                </div>
                                <div className="modal-footer">
                                    <button className="btn btn-secondary btn-sm" onClick={() => setShowDeleteModal(false)}>Hủy</button>
                                    <button className="btn btn-danger btn-sm" onClick={handleDelete} disabled={submitting}>
                                        {submitting ? "Đang xóa..." : "Xóa"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="modal-backdrop fade show" />
                </>
            )}

            {/* ══ RESTORE MODAL ═════════════════════════════════════════ */}
            {showRestoreModal && (
                <>
                    <div className="modal fade show d-block" tabIndex="-1">
                        <div className="modal-dialog modal-sm">
                            <div className="modal-content">
                                <div className={`modal-header ${styles.modalHeader}`}>
                                    <h5 className={styles.modalTitle}>Khôi phục phòng</h5>
                                    <button type="button" className="btn-close" onClick={() => setShowRestoreModal(false)} />
                                </div>
                                <div className={`modal-body ${styles.deleteModalBody}`}>
                                    <div className={styles.restoreIcon}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                                            <path d="M3 3v5h5" />
                                        </svg>
                                    </div>
                                    <h6>Khôi phục phòng {selectedRoom?.roomNumber}?</h6>
                                    <p>Phòng sẽ được hiển thị lại trong danh sách.</p>
                                </div>
                                <div className="modal-footer">
                                    <button className="btn btn-secondary btn-sm" onClick={() => setShowRestoreModal(false)}>Hủy</button>
                                    <button className="btn btn-success btn-sm" onClick={handleRestore} disabled={submitting}>
                                        {submitting ? "Đang khôi phục..." : "Khôi phục"}
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

export default RoomPage;
