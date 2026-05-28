import { Outlet } from 'react-router-dom';
import Header from '../components/shared/Header';

import ManagerSidebar from '../components/manager/ManagerSidebar';
import ManagerFooter from '../components/manager/ManagerFooter';

import styles from './AdminLayout.module.css'; 

const ManagerLayout = () => {
  return (
    <div className={styles.wrapper}>
      {/* Sidebar của Manager */}
      <ManagerSidebar />

      <div className={styles.mainContent}>
        {/* Header cổng Manager */}
        <Header portalName="Manager System" />
        
        <main className={styles.scrollArea}>
          <div className={`container-fluid ${styles.contentCard}`}>
            {/* Ruột các trang chức năng (Phòng, Dịch vụ, Doanh thu...) */}
            <Outlet />
          </div>
        </main>

        {/* Footer riêng của Manager (Đã được tối ưu CSS) */}
        <ManagerFooter />
      </div>
    </div>
  );
};

export default ManagerLayout;