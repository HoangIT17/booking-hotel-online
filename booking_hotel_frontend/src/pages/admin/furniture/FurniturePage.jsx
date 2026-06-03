import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import * as LucideIcons from "lucide-react";
import toast from "react-hot-toast";

import {
    fetchFurnitures,
    fetchFurnitureTypes,
    createFurniture,
    updateFurniture,
    deleteFurniture,
} from "../../../redux/slices/furnitureSlice";
import styles from "./FurniturePage.module.css";

// ===== CONSTANTS =====
const TYPE_LABELS = {
    BED: "Giường",
    ELECTRONIC: "Điện tử",
    BATHROOM: "Phòng tắm",
    TABLE: "Bàn",
    CHAIR: "Ghế",
    DECOR: "Trang trí",
    LIGHTING: "Đèn",
    STORAGE: "Tủ/Lưu trữ",
    KITCHEN: "Bếp",
};

const TYPE_COLORS = {
    BED:        { bg: "#dbeafe", color: "#1d4ed8" },
    ELECTRONIC: { bg: "#e0f2fe", color: "#0369a1" },
    BATHROOM:   { bg: "#f0fdf4", color: "#15803d" },
    TABLE:      { bg: "#fef9c3", color: "#92400e" },
    CHAIR:      { bg: "#f3e8ff", color: "#7e22ce" },
    DECOR:      { bg: "#fce7f3", color: "#be185d" },
    LIGHTING:   { bg: "#fffbeb", color: "#d97706" },
    STORAGE:    { bg: "#f1f5f9", color: "#475569" },
    KITCHEN:    { bg: "#ecfdf5", color: "#065f46" },
};

// ===== HELPER COMPONENTS =====
const DynamicIcon = ({ name, size = 20 }) => {
    if (!name) return null;
    const Icon = LucideIcons[name];
    if (!Icon) return <span style={{ fontSize: 11, color: "#adb5bd" }}>?</span>;
    return <Icon size={size} />;
};

const TypeBadge = ({ type }) => {
    const label = TYPE_LABELS[type] || type;
    const colors = TYPE_COLORS[type] || { bg: "#f1f5f9", color: "#475569" };
    return (
        <span
            className={styles.typeBadge}
            style={{ backgroundColor: colors.bg, color: colors.color }}
        >
            {label}
        </span>
    );
};

const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
};

// ===== MAIN PAGE =====
const FurniturePage = () => {
    const dispatch = useDispatch();
    const { items, types, loading, submitting } = useSelector((state) => state.furniture);

    // Filter state
    const [filterName, setFilterName] = useState("");
    const [filterType, setFilterType] = useState("");
    const debounceRef = useRef(null);

    // Modal state
    const [showFormModal, setShowFormModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    // Icon preview for form
    const [iconPreview, setIconPreview] = useState("");

    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors },
    } = useForm();

    const watchedIcon = watch("icon", "");

    useEffect(() => {
        dispatch(fetchFurnitures({}));
        dispatch(fetchFurnitureTypes());
    }, [dispatch]);

    useEffect(() => {
        setIconPreview(watchedIcon);
    }, [watchedIcon]);

    // ===== HANDLERS =====
    const handleNameChange = (e) => {
        const value = e.target.value;
        setFilterName(value);
        clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            dispatch(fetchFurnitures({
                furnitureName: value || undefined,
                furnitureType: filterType || undefined,
            }));
        }, 500);
    };

    const handleTypeChange = (e) => {
        const value = e.target.value;
        setFilterType(value);
        clearTimeout(debounceRef.current);
        dispatch(fetchFurnitures({
            furnitureName: filterName || undefined,
            furnitureType: value || undefined,
        }));
    };

    const handleReset = () => {
        clearTimeout(debounceRef.current);
        setFilterName("");
        setFilterType("");
        dispatch(fetchFurnitures({}));
    };

    const openCreateModal = () => {
        setIsEditing(false);
        setSelectedItem(null);
        setIconPreview("");
        reset({ furnitureName: "", furnitureType: "", icon: "", description: "" });
        setShowFormModal(true);
    };

    const openEditModal = (item) => {
        setIsEditing(true);
        setSelectedItem(item);
        setIconPreview(item.icon || "");
        reset({
            furnitureName: item.furnitureName,
            furnitureType: item.furnitureType,
            icon: item.icon || "",
            description: item.description || "",
        });
        setShowFormModal(true);
    };

    const openDeleteModal = (item) => {
        setSelectedItem(item);
        setShowDeleteModal(true);
    };

    const closeFormModal = () => {
        setShowFormModal(false);
        reset();
    };

    const closeDeleteModal = () => {
        setShowDeleteModal(false);
        setSelectedItem(null);
    };

    const onSubmit = async (formData) => {
        const payload = {
            furnitureName: formData.furnitureName.trim(),
            furnitureType: formData.furnitureType,
            icon: formData.icon?.trim() ?? "",
            description: formData.description?.trim() ?? "",
        };

        if (isEditing) {
            const result = await dispatch(updateFurniture({ id: selectedItem.id, data: payload }));
            if (!result.error) {
                toast.success("Cập nhật nội thất thành công!");
                closeFormModal();
            }
        } else {
            const result = await dispatch(createFurniture(payload));
            if (!result.error) {
                toast.success("Thêm nội thất thành công!");
                closeFormModal();
            }
        }
    };

    const onConfirmDelete = async () => {
        if (!selectedItem) return;
        const result = await dispatch(deleteFurniture(selectedItem.id));
        if (!result.error) {
            toast.success("Xóa nội thất thành công!");
            closeDeleteModal();
        }
    };

    // ===== RENDER =====
    return (
        <div>
            {/* Filter Bar + Actions */}
            <div className={styles.filterBar}>
                <input
                    type="text"
                    className={`form-control ${styles.filterInput}`}
                    placeholder="Tìm theo tên nội thất..."
                    value={filterName}
                    onChange={handleNameChange}
                />
                <select
                    className={`form-select ${styles.filterSelect}`}
                    value={filterType}
                    onChange={handleTypeChange}
                >
                    <option value="">Tất cả loại</option>
                    {types.map((t) => (
                        <option key={t} value={t}>{TYPE_LABELS[t] || t}</option>
                    ))}
                </select>
                <button className={`btn btn-outline-secondary ${styles.filterBtn}`} onClick={handleReset}>
                    <i className="fa-solid fa-rotate-left me-1"></i> Đặt lại
                </button>
                <button className={`btn btn-primary ${styles.filterBtn}`} style={{ fontWeight: 600 }} onClick={openCreateModal}>
                    <i className="fa-solid fa-plus me-1"></i> Thêm Nội Thất
                </button>
            </div>

            {/* Counter */}
            {!loading && (
                <p className={styles.counter}>
                    Tìm thấy <strong>{items.length}</strong> nội thất
                </p>
            )}

            {/* Table */}
            {loading ? (
                <div className={styles.loadingWrapper}>
                    <div className="spinner-border text-primary" role="status" />
                    <p className="mt-2 mb-0" style={{ fontSize: 14 }}>Đang tải dữ liệu...</p>
                </div>
            ) : (
                <div className={styles.tableWrapper}>
                    <table className={`table table-hover ${styles.table}`}>
                        <thead>
                            <tr>
                                <th style={{ width: 40 }}>STT</th>
                                <th style={{ width: 56 }}>Icon</th>
                                <th>Tên Nội Thất</th>
                                <th style={{ width: 120 }}>Loại</th>
                                <th>Mô Tả</th>
                                <th style={{ width: 105 }}>Ngày Tạo</th>
                                <th style={{ width: 105 }}>Cập Nhật</th>
                                <th style={{ width: 110, textAlign: "center" }}>Thao Tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.length === 0 ? (
                                <tr>
                                    <td colSpan={8}>
                                        <div className={styles.emptyState}>
                                            <LucideIcons.PackageOpen size={40} strokeWidth={1.5} />
                                            <p>Không có nội thất nào. Hãy thêm mới!</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                items.map((item, index) => (
                                    <tr key={item.id}>
                                        <td style={{ color: "#adb5bd", fontWeight: 600 }}>{index + 1}</td>
                                        <td>
                                            {item.icon ? (
                                                <div className={styles.iconCell}>
                                                    <DynamicIcon name={item.icon} size={22} />
                                                </div>
                                            ) : (
                                                <div className={styles.iconPlaceholder}>
                                                    <LucideIcons.Box size={18} />
                                                </div>
                                            )}
                                        </td>
                                        <td style={{ fontWeight: 500 }}>{item.furnitureName}</td>
                                        <td><TypeBadge type={item.furnitureType} /></td>
                                        <td>
                                            <span className={styles.descCell} title={item.description}>
                                                {item.description || <span style={{ color: "#adb5bd" }}>—</span>}
                                            </span>
                                        </td>
                                        <td style={{ color: "#6c757d", fontSize: 12 }}>{formatDate(item.createdAt)}</td>
                                        <td style={{ color: "#6c757d", fontSize: 12 }}>{formatDate(item.updatedAt)}</td>
                                        <td>
                                            <div className={styles.actionGroup}>
                                                <button className={styles.btnEdit} onClick={() => openEditModal(item)}>
                                                    <LucideIcons.Pencil size={13} /> Sửa
                                                </button>
                                                <button className={styles.btnDelete} onClick={() => openDeleteModal(item)}>
                                                    <LucideIcons.Trash2 size={13} /> Xóa
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* ===== FORM MODAL (CREATE / EDIT) ===== */}
            {showFormModal && (
                <>
                    <div className="modal fade show d-block" tabIndex="-1" onClick={(e) => e.target === e.currentTarget && closeFormModal()}>
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content" style={{ borderRadius: 12, border: "none", boxShadow: "0 10px 40px rgba(0,0,0,0.15)" }}>
                                <div className={styles.modalHeader}>
                                    <h5 className={styles.modalTitle}>
                                        {isEditing ? (
                                            <><LucideIcons.Pencil size={18} className="me-2" style={{ color: "#0d6efd" }} />Cập Nhật Nội Thất</>
                                        ) : (
                                            <><LucideIcons.Plus size={18} className="me-2" style={{ color: "#0d6efd" }} />Thêm Nội Thất Mới</>
                                        )}
                                    </h5>
                                    <button type="button" className="btn-close" onClick={closeFormModal} />
                                </div>

                                <form onSubmit={handleSubmit(onSubmit)}>
                                    <div className="modal-body p-4">
                                        <div className="row g-3">
                                            {/* Tên nội thất */}
                                            <div className="col-12">
                                                <label className={styles.formLabel}>Tên Nội Thất <span style={{ color: "#dc3545" }}>*</span></label>
                                                <input
                                                    className={`form-control ${styles.formControl} ${errors.furnitureName ? "is-invalid" : ""}`}
                                                    placeholder="Ví dụ: Giường đôi king size..."
                                                    {...register("furnitureName", { required: "Vui lòng nhập tên nội thất" })}
                                                />
                                                {errors.furnitureName && <p className={styles.errorText}>{errors.furnitureName.message}</p>}
                                            </div>

                                            {/* Loại nội thất */}
                                            <div className="col-12">
                                                <label className={styles.formLabel}>Loại Nội Thất <span style={{ color: "#dc3545" }}>*</span></label>
                                                <select
                                                    className={`form-select ${styles.formControl} ${errors.furnitureType ? "is-invalid" : ""}`}
                                                    {...register("furnitureType", { required: "Vui lòng chọn loại nội thất" })}
                                                >
                                                    <option value="">-- Chọn loại --</option>
                                                    {types.map((t) => (
                                                        <option key={t} value={t}>{TYPE_LABELS[t] || t}</option>
                                                    ))}
                                                </select>
                                                {errors.furnitureType && <p className={styles.errorText}>{errors.furnitureType.message}</p>}
                                            </div>

                                            {/* Icon */}
                                            <div className="col-12">
                                                <label className={styles.formLabel}>
                                                    Icon <span style={{ color: "#adb5bd", fontWeight: 400 }}>(tên Lucide icon, không bắt buộc)</span>
                                                </label>
                                                <input
                                                    className={`form-control ${styles.formControl}`}
                                                    placeholder="Ví dụ: BedDouble, Tv, Lamp..."
                                                    {...register("icon")}
                                                />
                                                {iconPreview && (
                                                    <div className={styles.iconPreview}>
                                                        <div className={styles.iconPreviewBox}>
                                                            <DynamicIcon name={iconPreview} size={18} />
                                                        </div>
                                                        <span>Xem trước icon</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Mô tả */}
                                            <div className="col-12">
                                                <label className={styles.formLabel}>Mô Tả <span style={{ color: "#adb5bd", fontWeight: 400 }}>(không bắt buộc)</span></label>
                                                <textarea
                                                    className={`form-control ${styles.formControl}`}
                                                    rows={3}
                                                    placeholder="Mô tả ngắn về nội thất này..."
                                                    {...register("description")}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="modal-footer" style={{ borderTop: "1px solid #f0f0f0", padding: "12px 1.25rem" }}>
                                        <button type="button" className="btn btn-light" style={{ borderRadius: 8, fontSize: 14 }} onClick={closeFormModal}>
                                            Hủy
                                        </button>
                                        <button type="submit" className="btn btn-primary" style={{ borderRadius: 8, fontSize: 14, fontWeight: 600 }} disabled={submitting}>
                                            {submitting ? (
                                                <><span className="spinner-border spinner-border-sm me-2" />Đang lưu...</>
                                            ) : isEditing ? (
                                                <><LucideIcons.Save size={15} className="me-1" />Cập Nhật</>
                                            ) : (
                                                <><LucideIcons.Plus size={15} className="me-1" />Thêm Mới</>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                    <div className="modal-backdrop fade show"></div>
                </>
            )}

            {/* ===== DELETE CONFIRM MODAL ===== */}
            {showDeleteModal && (
                <>
                    <div className="modal fade show d-block" tabIndex="-1" onClick={(e) => e.target === e.currentTarget && closeDeleteModal()}>
                        <div className="modal-dialog modal-dialog-centered modal-sm">
                            <div className="modal-content" style={{ borderRadius: 12, border: "none", boxShadow: "0 10px 40px rgba(0,0,0,0.15)" }}>
                                <div className="modal-body p-0">
                                    <div className={styles.deleteModalBody}>
                                        <div className={styles.deleteIcon}>
                                            <LucideIcons.Trash2 size={26} />
                                        </div>
                                        <h6>Xác nhận xóa</h6>
                                        <p>
                                            Bạn có chắc muốn xóa nội thất <br />
                                            <strong style={{ color: "#212529" }}>&quot;{selectedItem?.furnitureName}&quot;</strong>?<br />
                                            Hành động này không thể hoàn tác.
                                        </p>
                                    </div>
                                </div>
                                <div className="modal-footer justify-content-center gap-2" style={{ borderTop: "1px solid #f0f0f0", padding: "12px" }}>
                                    <button className="btn btn-light px-4" style={{ borderRadius: 8, fontSize: 14 }} onClick={closeDeleteModal}>
                                        Hủy
                                    </button>
                                    <button className="btn btn-danger px-4" style={{ borderRadius: 8, fontSize: 14, fontWeight: 600 }} onClick={onConfirmDelete} disabled={submitting}>
                                        {submitting ? <span className="spinner-border spinner-border-sm" /> : "Xóa"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="modal-backdrop fade show"></div>
                </>
            )}
        </div>
    );
};

export default FurniturePage;