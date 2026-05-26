import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/admin/AdminSidebar';
import Header from '../components/shared/Header';
import AdminFooter from '../components/admin/AdminFooter';
import styles from './AdminLayout.module.css'; 

const AdminLayout = () => {
  return (
    <div className={styles.wrapper}>
      {/* Sidebar */}
      <AdminSidebar />

      <div className={styles.mainContent}>
        {/* Header */}
        <Header portalName="Admin System" />

        <main className={styles.scrollArea}>
          <div className={`container-fluid ${styles.contentCard}`}>
            {/* Nơi hiển thị DashboardPage, UserListPage... */}
            <Outlet />
          </div>
        </main>

        <AdminFooter />
      </div>
    </div>
  );
};

export default AdminLayout;