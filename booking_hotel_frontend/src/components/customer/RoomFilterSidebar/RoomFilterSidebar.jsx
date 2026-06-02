import styles from "./RoomFilterSidebar.module.css";

const roomTypes = ["STANDARD", "SUPERIOR", "DELUXE", "VIP", "SUITE", "FAMILY"];

const RoomFilterSidebar = ({ values, onChange, onReset, onSubmit }) => {
  return (
    <form className={styles.sidebar} onSubmit={onSubmit}>
      <div className={styles.head}>
        <h2>Bộ lọc</h2>
        <button type="button" onClick={onReset}>Đặt lại</button>
      </div>

      <label>
        <span>Loại phòng</span>
        <select name="roomType" value={values.roomType} onChange={onChange}>
          <option value="">Tất cả loại phòng</option>
          {roomTypes.map((type) => (
            <option value={type} key={type}>{type}</option>
          ))}
        </select>
      </label>

      <div className={styles.twoCols}>
        <label>
          <span>Giá thấp nhất</span>
          <input name="minPrice" type="number" min="0" value={values.minPrice} onChange={onChange} />
        </label>
        <label>
          <span>Giá cao nhất</span>
          <input name="maxPrice" type="number" min="0" value={values.maxPrice} onChange={onChange} />
        </label>
      </div>

      <label>
        <span>Đánh giá tối thiểu</span>
        <select name="minRating" value={values.minRating} onChange={onChange}>
          <option value="">Mọi đánh giá</option>
          <option value="4">Từ 4 sao</option>
          <option value="4.5">Từ 4.5 sao</option>
          <option value="5">5 sao</option>
          </select>
      </label>

      <button className={styles.searchButton} type="submit">Tìm kiếm</button>
    </form>
  );
};

export default RoomFilterSidebar;
