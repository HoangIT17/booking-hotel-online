import { Outlet } from 'react-router-dom';
import Header from '../components/shared/Header';

// 🌟 Import đúng các thành phần của Lễ tân
import ReceptionistSidebar from '../components/receptionist/ReceptionistSidebar';
import ReceptionistFooter from '../components/receptionist/ReceptionistFooter';

// 🌟 Dùng chung khung CSS Layout với Admin
import styles from './AdminLayout.module.css'; 

const ReceptionistLayout = () => {
  return (
    <div className={styles.wrapper}>
      {/* Sidebar của Lễ tân */}
      <ReceptionistSidebar />

      <div className={styles.mainContent}>
        {/* Header cổng Lễ tân */}
        <Header portalName="Receptionist Portal" />
        
        <main className={styles.scrollArea}>
          <div className={`container-fluid ${styles.contentCard}`}>
            {/* Ruột các trang chức năng (Đặt phòng, Check-in/out...) */}
            <Outlet />
          </div>
        </main>

        {/* Footer riêng của Lễ tân */}
        <ReceptionistFooter />
      </div>
    </div>
  );
};

export default ReceptionistLayout;