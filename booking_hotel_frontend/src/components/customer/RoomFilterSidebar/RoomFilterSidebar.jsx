import styles from "./RoomFilterSidebar.module.css";

const roomTypes = ["STANDARD", "SUPERIOR", "DELUXE", "VIP", "SUITE", "FAMILY"];

const RoomFilterSidebar = ({ values, onChange, onReset, onSubmit }) => {
  return (
    <form className={styles.sidebar} onSubmit={onSubmit}>
      <div className={styles.head}>
        <h2>Filters</h2>
        <button type="button" onClick={onReset}>Reset</button>
      </div>

      <label>
        <span>Room type</span>
        <select name="roomType" value={values.roomType} onChange={onChange}>
          <option value="">All room types</option>
          {roomTypes.map((type) => (
            <option value={type} key={type}>{type}</option>
          ))}
        </select>
      </label>

      <div className={styles.twoCols}>
        <label>
          <span>Min price</span>
          <input name="minPrice" type="number" min="0" value={values.minPrice} onChange={onChange} />
        </label>
        <label>
          <span>Max price</span>
          <input name="maxPrice" type="number" min="0" value={values.maxPrice} onChange={onChange} />
        </label>
      </div>

      <label>
        <span>Minimum rating</span>
        <select name="minRating" value={values.minRating} onChange={onChange}>
          <option value="">Any rating</option>
          <option value="4">From 4 stars</option>
          <option value="4.5">From 4.5 stars</option>
          <option value="5">5 stars</option>
        </select>
      </label>

      <button className={styles.searchButton} type="submit">Search</button>
    </form>
  );
};

export default RoomFilterSidebar;
