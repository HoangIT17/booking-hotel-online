import { Star } from "lucide-react";
import styles from "./RoomCard.module.css";

const RoomCard = ({
  image,
  name,
  description,
  price,
  formattedPrice,
  priceUnit = "/ đêm",
  rating,
  reviewCount,
  amenities = [],
  actionLabel = "Xem chi tiết",
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
        {description && <p>{description}</p>}

        {amenities.length > 0 && (
          <div className={styles.amenities}>
            {amenities.map((amenity) => (
              <span key={amenity}>{amenity}</span>
            ))}
          </div>
        )}

        <div className={styles.footer}>
          <div className={styles.price}>
            <strong>{formattedPrice ?? `$${price}`}</strong>
            <span>{priceUnit}</span>
          </div>
          <button type="button" onClick={onAction}>{actionLabel}</button>
        </div>
      </div>
    </article>
  );
};

export default RoomCard;
