import { Outlet } from 'react-router-dom';

// Import CSS
import styles from './CustomerLayout.module.css';

// Import components
import Header from '../components/customer/Header';
import Footer from '../components/customer/Footer';
import ChatBox from '../pages/chatbot/ChatBox';

const CustomerLayout = () => {
    return (
        <div className={styles.layoutWrapper}>
            
            {/* 1. Header */}
            <Header />

            {/* 2. Main Content (Nơi chứa các trang con như Profile, Home, Rooms...) */}
            <main className={styles.mainContent}>
                <Outlet />
            </main>

            {/* 3. Footer */}
            <Footer />

            {/* 4. ChatBox */}
            <ChatBox />
            
        </div>
    );
};

export default CustomerLayout;