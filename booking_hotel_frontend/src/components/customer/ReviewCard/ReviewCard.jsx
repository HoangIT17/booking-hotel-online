import RatingStars from "../../common/RatingStars/RatingStars";
import styles from "./ReviewCard.module.css";

const ReviewCard = ({ rating = 5, comment, author, date }) => {
  return (
    <article className={styles.card}>
      <RatingStars value={rating} />
      <p>{comment}</p>
      <strong>{author}</strong>
      <small>{date}</small>
    </article>
  );
};

export default ReviewCard;
