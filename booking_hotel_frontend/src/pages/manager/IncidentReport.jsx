import React, { useState, useEffect } from "react";
//import { incidentApi } from "../../api/incidentApi"; // Import từ file API của bạn
import { incidentApi } from "../../services/incidentApi"; // Đảm bảo đường dẫn đúng với cấu trúc dự án của bạn

const IncidentReport = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchReports = async () => {
    setLoading(true);
    try {
      // Gọi qua hàm đã định nghĩa trong incidentApi.js
      const response = await incidentApi.getDamagedLostReport();

      // Kiểm tra cấu trúc dữ liệu trả về từ API
      // Dựa vào code trước, response thường chứa data ở response.data
      // Nếu API trả về { success: true, data: { content: [...] } }
      setData(response.data?.content || []);
    } catch (err) {
      console.error("Lỗi khi tải báo cáo:", err);
      alert("Không thể tải danh sách sự cố! Vui lòng kiểm tra quyền truy cập.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  // Helper hiển thị badge trạng thái bằng Bootstrap
  const renderStatus = (status) => {
    const classes =
      status === "RESOLVED"
        ? "bg-success"
        : status === "FIXING"
          ? "bg-primary"
          : "bg-warning";
    return (
      <span className={`badge ${classes} text-white`}>
        {status || "PENDING"}
      </span>
    );
  };

  return (
    <div className="container-fluid p-4">
      <h3 className="mb-4">Báo cáo sự cố thiết bị</h3>

      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card text-center p-3 shadow-sm">
            <div className="text-muted">Tổng sự cố</div>
            <h4>{data.length}</h4>
          </div>
        </div>
      </div>

      <div className="card p-3 shadow-sm">
        {loading ? (
          <div className="text-center p-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Đang tải...</span>
            </div>
          </div>
        ) : (
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>Phòng</th>
                <th>Thiết bị</th>
                <th>Người báo cáo</th>
                <th>Mô tả</th>
                <th>Trạng thái</th>
                <th>Ngày báo cáo</th>
              </tr>
            </thead>
            <tbody>
              {data.length > 0 ? (
                data.map((item) => (
                  <tr key={item.id}>
                    <td>{item.roomNumber}</td>
                    <td>{item.furnitureName}</td>
                    <td>{item.staffName}</td>
                    <td>{item.description}</td>
                    <td>{renderStatus(item.status)}</td>
                    <td>{item.createdAt}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center">
                    Không có dữ liệu sự cố.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default IncidentReport;
