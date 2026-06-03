import RatingStars from "../../common/RatingStars/RatingStars";
import styles from "./ReviewCard.module.css";

const ReviewCard = ({ rating = 5, comment, author, date }) => {
  return (
    <article className={styles.card}>
      <strong>{author}</strong>
      <p>{comment}</p>
      <small>{date}</small>
      <RatingStars value={rating} />
    </article>
  );
};

export default ReviewCard;
