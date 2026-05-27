import { Outlet } from 'react-router-dom';
import ManagerSidebar from '../components/manager/ManagerSidebar';
import Header from '../components/shared/Header';
import ManagerFooter from '../components/manager/ManagerFooter';
import styles from './AdminLayout.module.css'; 

const ManagerLayout = () => {
  return (
    <div className={styles.wrapper}>
      {/* Sidebar */}
      <ManagerSidebar />

      <div className={styles.mainContent}>
        {/* Header */}
        <Header portalName="Manager System" />
        <main className={styles.scrollArea}>
          <div className={`container-fluid ${styles.contentCard}`}>
            {/* Nơi hiển thị DashboardPage, UserListPage... */}
            <Outlet />
          </div>
        </main>

        <ManagerFooter />
      </div>
    </div>
  );
};

export default ManagerLayout;