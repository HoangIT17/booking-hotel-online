import styles from '../admin/AdminFooter.module.css';

const ReceptionistFooter = () => (
  <footer className={styles.footer}>
    <div className="fw-medium">
      © 2026 <span className="text-dark fw-bold">LuxeStay</span> Receptionist Panel
    </div>
    
    <div className="d-flex align-items-center gap-4">
      <div className="d-flex align-items-center">
        <span className={styles.statusIndicator}></span>
        <span className="text-muted">Trạng thái hệ thống: </span>
        <span className="text-success fw-bold ms-1">Ổn định</span>
      </div>
      <div className="vr h-50 my-auto mx-1"></div>
      <span className="font-monospace text-uppercase">v1.0.2-release</span>
    </div>
  </footer>
);

export default ReceptionistFooter;