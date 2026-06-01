import RatingStars from "../../common/RatingStars/RatingStars";
import styles from "./ReviewForm.module.css";

const ReviewForm = ({
  title = "Viết đánh giá",
  rating = 5,
  placeholder = "Chia sẻ trải nghiệm của bạn...",
  submitLabel = "Gửi đánh giá",
  note,
  onSubmit,
}) => {
  return (
    <form className={styles.form} onSubmit={onSubmit}>
      <h2>{title}</h2>
      <RatingStars value={rating} />
      <textarea placeholder={placeholder} />
      <button type="submit">{submitLabel}</button>
      {note && <small>{note}</small>}
    </form>
  );
};

export default ReviewForm;
