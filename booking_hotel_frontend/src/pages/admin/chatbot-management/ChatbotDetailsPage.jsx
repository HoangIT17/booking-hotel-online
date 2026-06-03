import  { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { fetchKnowledgeDetails } from '../../../redux/slices/chatbotSlice';

const ChatbotDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [data, setData] = useState(null);

    useEffect(() => {
        dispatch(fetchKnowledgeDetails(id)).then((res) => {
            if (res.payload) {
                setData(res.payload);
            }
        });
    }, [id, dispatch]);

    if (!data) return (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
            <div className="spinner-border text-primary"></div>
        </div>
    );

    return (
        <div className="container-fluid px-3 py-3" style={{ backgroundColor: '#f4f7f6', minHeight: 'calc(100vh - 80px)' }}>
            <div className="row">
                <div className="col-12">
                    <div className="card shadow-sm border-0 rounded-4 overflow-hidden bg-white">
                        
                        {/* Header */}
                        <div className="card-header py-3 px-4 d-flex justify-content-between align-items-center" 
                             style={{ background: 'linear-gradient(90deg, #0dcaf0, #0097b2)', border: 'none' }}>
                            <div className="d-flex align-items-center gap-2 text-white">
                                <i className="fa-solid fa-circle-info fs-4"></i>
                                <h5 className="mb-0 fw-bold text-uppercase" style={{ letterSpacing: '1px' }}>
                                    Chi tiết AI Knowledge
                                </h5>
                            </div>
                            <span className="badge bg-white text-info fs-6 px-4 py-2 rounded-pill shadow-sm">
                                ID: {data.id}
                            </span>
                        </div>

                        {/* Body */}
                        <div className="card-body p-4">
                            
                            {/* Khối Question */}
                            <div className="mb-4">
                                <div className="d-flex align-items-center mb-2 text-secondary">
                                    <i className="fa-solid fa-user-tag me-2 fs-5"></i>
                                    <span className="fw-bold text-uppercase" style={{ fontSize: '0.8rem' }}>Câu hỏi từ User (Question)</span>
                                </div>
                                <div className="ps-2">
                                    <div className="fs-5 text-dark fw-medium border-start border-5 border-primary ps-4 py-3 bg-light rounded-3 shadow-sm">
                                        "{data.questionPattern || data.question}"
                                    </div>
                                </div>
                            </div>

                            {/* Divider */}
                            <div className="position-relative my-4 text-center">
                                <hr className="m-0 opacity-25" />
                                <div className="position-absolute top-50 start-50 translate-middle bg-white px-4 text-info">
                                    <i className="fa-solid fa-robot fs-3"></i>
                                </div>
                            </div>

                            {/* Khối Answer */}
                            <div className="mb-4">
                                <div className="d-flex align-items-center mb-2 text-secondary">
                                    <i className="fa-solid fa-comment-dots me-2 fs-5"></i>
                                    <span className="fw-bold text-uppercase" style={{ fontSize: '0.8rem' }}>AI Phản hồi (Answer)</span>
                                </div>
                                <div className="ps-2">
                                    <div className="text-muted p-4 rounded-4 border shadow-sm" 
                                         style={{ 
                                             backgroundColor: '#ffffff', 
                                             borderLeft: '8px solid #0dcaf0 !important', 
                                             lineHeight: '1.8',
                                             fontSize: '1.1rem',
                                             width: '100%',
                                             minHeight: '100px',
                                             whiteSpace: 'pre-wrap' // Giữ nguyên các ký tự \n xuống dòng
                                         }}>
                                        {data.answerContent || data.answer}
                                    </div>
                                </div>
                            </div>

                            {/* Footer Buttons */}
                            <div className="d-flex justify-content-between align-items-center mt-5 pt-4 border-top">
                                <button className="btn btn-outline-secondary px-4 py-2 rounded-pill fw-bold transition-all shadow-sm" 
                                        onClick={() => navigate(-1)}>
                                    <i className="fa-solid fa-arrow-left-long me-2"></i> Quay lại danh sách
                                </button>
                                
                                <button className="btn btn-warning px-5 py-2 text-white fw-bold rounded-pill shadow-sm"
                                        onClick={() => navigate(`/admin/chatbot/edit/${id}`)}>
                                    <i className="fa-solid fa-pen-to-square me-2"></i> Chỉnh sửa kiến thức
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatbotDetailsPage;