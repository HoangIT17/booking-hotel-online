import PublicNavbar from "../../common/PublicNavbar/PublicNavbar";
import useAuth from "../../../hooks/useAuth";
import { useDispatch } from "react-redux";
import { logoutThunk } from "../../../redux/slices/authSlice";
import styles from "./CustomerPageShell.module.css";

const navLinks = [
  { label: "Home", href: "/home" },
  { label: "Rooms", href: "/rooms" },
  { label: "Offers", href: "/offers" },
  { label: "My Reservations", href: "/reservations" },
];

const CustomerPageShell = ({ active = "", children }) => {
  const dispatch = useDispatch();
  const { isAuthenticated, role } = useAuth();
  const isCustomer = isAuthenticated && role === "CUSTOMER";
  const links = navLinks
    .filter((link) => link.label !== "My Reservations" || isCustomer)
    .map((link) => ({
      ...link,
      active: link.label === active,
    }));

  return (
    <div className={styles.page}>
      <PublicNavbar
        links={links}
        action={
          isCustomer
            ? { label: "Account", href: "/profile" }
            : { label: "Sign In", href: "/login" }
        }
        secondaryAction={
          isCustomer
            ? {
                label: "Logout",
                onClick: async () => {
                  await dispatch(logoutThunk());
                  window.location.href = "/home";
                },
              }
            : null
        }
      />
      <main className={styles.main}>{children}</main>
    </div>
  );
};

export default CustomerPageShell;
