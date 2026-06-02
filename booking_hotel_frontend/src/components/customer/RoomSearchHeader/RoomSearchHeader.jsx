import { Calendar, Search, UsersRound } from "lucide-react";
import SearchPanel, { SearchPanelField } from "../SearchPanel/SearchPanel";
import styles from "./RoomSearchHeader.module.css";

const RoomSearchHeader = ({ values, onChange, onSubmit }) => {
  return (
    <section className={styles.header}>
      <span className={styles.badge}>Tìm phòng còn trống</span>
      <h1>Tìm phòng phù hợp với kỳ nghỉ của bạn</h1>
      <p>
        Lọc theo ngày, số khách, loại phòng, giá và đánh giá trước khi xem chi
        tiết phòng.
      </p>

      <div className={styles.searchWrap}>
        <SearchPanel onSubmit={onSubmit}>
          <SearchPanelField
            icon={Calendar}
            label="Nhận phòng"
            type="date"
            name="checkIn"
            value={values.checkIn}
            onChange={onChange}
          />
          <SearchPanelField
            icon={Calendar}
            label="Trả phòng"
            type="date"
            name="checkOut"
            value={values.checkOut}
            onChange={onChange}
          />
          <SearchPanelField
            icon={UsersRound}
            label="Số người"
            name="numGuests"
            value={values.numGuests}
            onChange={onChange}
            options={[
              { value: 1, label: "1 người" },
              { value: 2, label: "2 người" },
              { value: 3, label: "3 người" },
              { value: 4, label: "4 người" },
            ]}
          />
        </SearchPanel>
      </div>
    </section>
  );
};

export default RoomSearchHeader;
