import { Star } from "lucide-react";
import styles from "./RoomCard.module.css";

const RoomCard = ({
  image,
  name,
  description,
  price,
  formattedPrice,
  priceUnit = "/night",
  rating,
  reviewCount,
  actionLabel = "View details",
  onAction,
}) => {
  return (
    <article className={styles.card}>
      <div className={styles.imageWrap}>
        <img src={image} alt={name} />
        {(rating || reviewCount) && (
          <span className={styles.rating}>
            <Star size={12} fill="#f9b115" />
            {rating} {reviewCount ? `(${reviewCount})` : ""}
          </span>
        )}
      </div>

      <div className={styles.body}>
        <h3>{name}</h3>
        {description}

        <div className={styles.footer}>
          <div className={styles.price}>
            <strong>{formattedPrice ?? `$${price}`}</strong>
            <span>{priceUnit}</span>
          </div>
          <button type="button" onClick={onAction}>
            {actionLabel}
          </button>
        </div>
      </div>
    </article>
  );
};

export default RoomCard;
