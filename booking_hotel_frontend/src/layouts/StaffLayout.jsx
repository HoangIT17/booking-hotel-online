import { Outlet } from 'react-router-dom';
import Header from '../components/shared/Header';

// 🌟 Import đúng các thành phần của Nhân viên
import StaffSidebar from '../components/staff/StaffSidebar';
import StaffFooter from '../components/staff/StaffFooter';

// 🌟 Dùng chung khung CSS Layout với Admin
import styles from './AdminLayout.module.css'; 

const StaffLayout = () => {
  return (
    <div className={styles.wrapper}>
      {/* Sidebar của Nhân viên */}
      <StaffSidebar />

      <div className={styles.mainContent}>
        {/* Header cổng Nhân viên */}
        <Header portalName="Staff Workspace" />
        
        <main className={styles.scrollArea}>
          <div className={`container-fluid ${styles.contentCard}`}>
            {/* Ruột các trang chức năng (Nhiệm vụ dọn phòng, bảo trì...) */}
            <Outlet />
          </div>
        </main>

        {/* Footer riêng của Nhân viên */}
        <StaffFooter />
      </div>
    </div>
  );
};

export default StaffLayout;