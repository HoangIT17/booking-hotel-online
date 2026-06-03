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
              "Unable to load active vouchers.",
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
      toast.success(`Copied ${code}`);
    } catch {
      toast.error("Unable to copy voucher code");
    }
  };

  return (
    <CustomerPageShell active="Offers">
      <section className={styles.hero}>
        <h1>Active promotions</h1>
        <p>
          Browse active vouchers. Enter a voucher code during booking if your
          total meets the minimum value.
        </p>
      </section>

      <div className={styles.toolbar}>
        <div>
          <strong>{availableVouchers.length} active vouchers</strong>
          <p>
            {loading
              ? "Syncing the latest vouchers..."
              : error || "Data is updated from the hotel voucher catalog."}
          </p>
        </div>
        <a href="/rooms">Find rooms</a>
      </div>

      {availableVouchers.length === 0 ? (
        <section className={styles.empty}>
          <h2>No vouchers yet</h2>
          <p>There are no active vouchers right now. Please check back later.</p>
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
