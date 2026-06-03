import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { fetchKnowledgeDetails, updateKnowledge } from '../../../redux/slices/chatbotSlice';
import Swal from 'sweetalert2';

const ChatbotEditPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({ questionPattern: '', answerContent: '' });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        dispatch(fetchKnowledgeDetails(id)).then((res) => {
            if (res.payload) {
                setFormData({ 
                    questionPattern: res.payload.questionPattern || res.payload.question || '', 
                    answerContent: res.payload.answerContent || res.payload.answer || '' 
                });
            }
        });
    }, [id, dispatch]);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!formData.questionPattern.trim() || !formData.answerContent.trim()) {
            Swal.fire('Lỗi', 'Vui lòng không để trống thông tin!', 'error');
            return;
        }

        setIsLoading(true);
        dispatch(updateKnowledge({ id, data: formData })).then((res) => {
            setIsLoading(false);
            if (!res.error) {
                Swal.fire({
                    icon: 'success',
                    title: 'Thành công!',
                    text: 'Dữ liệu đã được cập nhật.',
                    timer: 1500,
                    showConfirmButton: false
                }).then(() => {
                    navigate('/admin/chatbot');
                });
            }
        });
    };

    return (
        <div className="container-fluid py-4 px-3" style={{ backgroundColor: '#f2f2f2', minHeight: 'calc(100vh - 80px)' }}>
            <div className="card border-0 mx-auto rounded-3 overflow-hidden" style={{ maxWidth: '900px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                
                {/* Header: nền vàng, sát viền trên, không bo góc lẻ */}
                <div className="py-3 px-4 d-flex align-items-center gap-2" 
                     style={{ backgroundColor: '#ffc107', borderBottom: 'none' }}>
                    <i className="fa-solid fa-pen-to-square fs-5 text-dark"></i>
                    <h5 className="mb-0 fw-semibold text-dark">Chỉnh Sửa Kiến Thức {id}</h5>
                </div>

                {/* Body: padding sát và đều 2 bên */}
                <div className="p-4 p-md-5 bg-white">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="form-label fw-semibold text-secondary mb-2">Câu Hỏi (Question Pattern):</label>
                            <textarea 
                                className="form-control" 
                                rows="3"
                                placeholder="Nhập câu hỏi mẫu..."
                                value={formData.questionPattern}
                                onChange={(e) => setFormData({...formData, questionPattern: e.target.value})}
                                style={{ borderColor: '#ced4da', resize: 'vertical', fontSize: '0.95rem' }}
                            />
                        </div>
                        
                        <div className="mb-5">
                            <label className="form-label fw-semibold text-secondary mb-2">Câu Trả Lời (Answer Content):</label>
                            <textarea 
                                className="form-control" 
                                rows="6"
                                placeholder="Nhập câu trả lời chi tiết của AI..."
                                value={formData.answerContent}
                                onChange={(e) => setFormData({...formData, answerContent: e.target.value})}
                                style={{ borderColor: '#ced4da', resize: 'vertical', fontSize: '0.95rem' }}
                            />
                        </div>

                        <div className="d-flex gap-3 justify-content-end pt-3 border-top">
                            <button 
                                type="button" 
                                className="btn px-4 py-2 fw-semibold" 
                                onClick={() => navigate(-1)}
                                style={{ backgroundColor: '#fff', border: '1px solid #ced4da', color: '#495057' }}
                            >
                                Hủy bỏ
                            </button>
                            <button 
                                type="submit" 
                                className="btn px-5 py-2 fw-semibold text-dark" 
                                disabled={isLoading}
                                style={{ backgroundColor: '#ffc107', border: 'none' }}
                            >
                                {isLoading ? (
                                    <span className="spinner-border spinner-border-sm me-2"></span>
                                ) : (
                                    <i className="fa-solid fa-floppy-disk me-2"></i>
                                )}
                                Lưu Thay Đổi
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ChatbotEditPage;