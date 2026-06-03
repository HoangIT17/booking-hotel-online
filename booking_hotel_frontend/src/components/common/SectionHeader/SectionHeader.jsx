import { ArrowRight } from "lucide-react";
import styles from "./SectionHeader.module.css";

const SectionHeader = ({ title, description, actionLabel, onAction, actionHref }) => {
  const ActionTag = actionHref ? "a" : "button";

  return (
    <div className={styles.header}>
      <div>
        <h2>{title}</h2>
        {description && <p>{description}</p>}
      </div>

      {actionLabel && (
        <ActionTag
          className={styles.action}
          href={actionHref}
          onClick={onAction}
          type={actionHref ? undefined : "button"}
        >
          {actionLabel}
          <ArrowRight size={13} />
        </ActionTag>
      )}
    </div>
  );
};

export default SectionHeader;
