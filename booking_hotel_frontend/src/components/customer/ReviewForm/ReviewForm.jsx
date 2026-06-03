import RatingStars from "../../common/RatingStars/RatingStars";
import styles from "./ReviewForm.module.css";

const ReviewForm = ({
  title = "Write a review",
  rating = 5,
  placeholder = "Share your experience...",
  submitLabel = "Submit review",
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
