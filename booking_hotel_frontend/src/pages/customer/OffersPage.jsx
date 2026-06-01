import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import CustomerPageShell from "../../components/customer/CustomerPageShell/CustomerPageShell";
import VoucherCard from "../../components/customer/VoucherCard/VoucherCard";
import customerBookingService from "../../services/customerBookingService";
import styles from "./OffersPage.module.css";
import { getResponseData } from "../../utils/customerDataUtils";

const isVoucherAvailable = (voucher) => {
  const now = new Date();
  const start = voucher.startDate ? new Date(voucher.startDate) : null;
  const end = voucher.endDate ? new Date(voucher.endDate) : null;
  const hasUsage =
    voucher.usageLimit == null || (voucher.usedCount || 0) < voucher.usageLimit;

  return hasUsage && (!start || start <= now) && (!end || end >= now);
};

const OffersPage = () => {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const fetchVouchers = async () => {
      try {
        setError("");
        setLoading(true);
        const response = await customerBookingService.getAvailableVouchers();
        const data = getResponseData(response, []);
        if (mounted && Array.isArray(data)) {
          setVouchers(data);
        }
      } catch (err) {
        if (mounted) {
          setError(
            err.response?.data?.message ||
              "Không thể tải voucher đang áp dụng.",
          );
          setVouchers([]);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchVouchers();

    return () => {
      mounted = false;
    };
  }, []);

  const availableVouchers = useMemo(
    () => vouchers.filter(isVoucherAvailable),
    [vouchers],
  );

  const handleCopy = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
      toast.success(`Đã sao chép ${code}`);
    } catch {
      toast.error("Không thể sao chép mã voucher");
    }
  };

  return (
    <CustomerPageShell active="Offers">
      <section className={styles.hero}>
        <span>Ưu đãi đang áp dụng</span>
        <h1>Chương trình khuyến mãi đang hoạt động</h1>
        <p>
          Xem các voucher đang hoạt động. Nhập mã voucher khi đặt phòng nếu tổng
          tiền đáp ứng giá trị tối thiểu.
        </p>
      </section>

      <div className={styles.toolbar}>
        <div>
          <strong>{availableVouchers.length} voucher đang áp dụng</strong>
          <p>
            {loading
              ? "Đang đồng bộ voucher mới nhất..."
              : error || "Dữ liệu được cập nhật từ kho voucher của khách sạn."}
          </p>
        </div>
        <a href="/rooms">Tìm phòng</a>
      </div>

      {availableVouchers.length === 0 ? (
        <section className={styles.empty}>
          <h2>Chưa có voucher</h2>
          <p>Hiện chưa có voucher đang hoạt động. Vui lòng quay lại sau.</p>
        </section>
      ) : (
        <section className={styles.grid}>
          {availableVouchers.map((voucher) => (
            <VoucherCard
              key={voucher.id || voucher.code}
              voucher={voucher}
              onCopy={handleCopy}
            />
          ))}
        </section>
      )}
    </CustomerPageShell>
  );
};

export default OffersPage;
