import { Star } from "lucide-react";
import styles from "./RatingStars.module.css";

const RatingStars = ({ value = 5, size = 16, max = 5 }) => {
  return (
    <span className={styles.stars} aria-label={`${value} out of ${max} stars`}>
      {Array.from({ length: max }).map((_, index) => (
        <Star
          key={index}
          size={size}
          fill={index < value ? "#f9b115" : "none"}
        />
      ))}
    </span>
  );
};

export default RatingStars;
