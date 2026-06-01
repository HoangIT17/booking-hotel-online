import { useSearchParams } from "react-router-dom";
import CustomerPageShell from "../../components/customer/CustomerPageShell/CustomerPageShell";
import PaymentStatusCard from "../../components/customer/PaymentStatusCard/PaymentStatusCard";

const PaymentStatusPage = () => {
  const [searchParams] = useSearchParams();
  const active = searchParams.get("status") || "Pending";

  return (
    <CustomerPageShell active="My Reservations">
      <PaymentStatusCard active={active} />
    </CustomerPageShell>
  );
};

export default PaymentStatusPage;
