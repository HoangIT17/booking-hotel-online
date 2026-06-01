import  { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ReactMarkdown from 'react-markdown';
import styles from './ChatBox.module.css';
import useAuth from '../../hooks/useAuth';
import botIcon from '../../assets/images/chatbot.jpg';

// 🌟 Import các actions từ Redux Slice vừa tạo
import { toggleChatWindow, addUserMessage, askGeminiThunk } from '../../redux/slices/chatSlice';

const ChatBox = () => {
    const dispatch = useDispatch();
    const { user } = useAuth();
    const chatBodyRef = useRef(null);

    // Ô nhập liệu thì vẫn dùng local state cho nhẹ web
    const [input, setInput] = useState("");

    // 🌟 Rút toàn bộ dữ liệu Chat từ Redux Store ra
    const { isOpen, isTyping, messages } = useSelector((state) => state.chat);

    // Tự động cuộn xuống khi có tin nhắn mới hoặc khi bot đang gõ (isTyping)
    useEffect(() => {
        if (chatBodyRef.current) {
            chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
        }
    }, [messages, isTyping, isOpen]);

    const handleSend = () => {
        if (!input.trim()) return;
        
        // 1. Lưu ngay câu hỏi của user vào Redux để hiển thị lên màn hình
        dispatch(addUserMessage(input));
        
        // 2. Gọi API hỏi Bot (Thunk sẽ tự động đổi isTyping thành true/false)
        dispatch(askGeminiThunk(input));
        
        // 3. Xóa ô input
        setInput("");
    };

    const handleToggle = () => {
        dispatch(toggleChatWindow());
    };

    return (
        <div className={`${styles.chatbotContainer} ${user?.role === 'teacher' ? styles.teacherTheme : ''}`}>
            {isOpen && (
                <div className={styles.chatWindow}>
                    <div className={styles.chatHeader}>
                        <div className={styles.headerInfo}>
                            <img src={botIcon} alt="Bot" className={styles.headerAvatar} />
                            <div>
                                {/* Đổi tên bot cho hợp với dự án LuxeStay */}
                                <div className={styles.headerTitle}>LuxeStay AI Support</div>
                                <div className={styles.onlineStatus}>● Online</div>
                            </div>
                        </div>
                        <button className={styles.closeBtn} onClick={handleToggle}>—</button>
                    </div>
                    
                    <div className={styles.chatBody} ref={chatBodyRef}>
                        {messages.map((m, i) => (
                            <div key={i} className={m.sender === 'user' ? styles.userRow : styles.botRow}>
                                {m.sender === 'bot' && <img src={botIcon} alt="Bot" className={styles.msgAvatar} />}
                                <div className={styles.msgContent}>
                                    <div className={styles.msgBubble}>
                                        <ReactMarkdown>{m.text}</ReactMarkdown>
                                    </div>
                                    <span className={styles.msgTime}>{m.time}</span>
                                </div>
                                {m.sender === 'user' && <div className={styles.userAvatarIcon}><i className="fa-solid fa-user"></i></div>}
                            </div>
                        ))}

                        {/* 🌟 Thay loading cục bộ bằng isTyping của Redux */}
                        {isTyping && (
                            <div className={styles.botRow}>
                                <img src={botIcon} alt="Bot" className={styles.msgAvatar} />
                                <div className={`${styles.msgBubble} ${styles.typing}`}>
                                    <span></span><span></span><span></span>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className={styles.chatFooter}>
                        <input 
                            placeholder="Type your message here..."
                            value={input} 
                            onChange={(e) => setInput(e.target.value)} 
                            onKeyDown={(e) => e.key === 'Enter' && !isTyping && handleSend()}
                            disabled={isTyping} // Khóa ô nhập khi bot đang suy nghĩ tránh spam
                        />
                        <button onClick={handleSend} className={styles.sendBtn} disabled={isTyping || !input.trim()}>
                            <i className="fa-solid fa-paper-plane"></i>
                        </button>
                    </div>
                </div>
            )}

            <button className={styles.chatToggleBtn} onClick={handleToggle}>
                {isOpen ? <i className="fa-solid fa-xmark"></i> : <img src={botIcon} alt="Open Chat" className={styles.toggleImg} />}
            </button>
        </div>
    );
};

export default ChatBox;