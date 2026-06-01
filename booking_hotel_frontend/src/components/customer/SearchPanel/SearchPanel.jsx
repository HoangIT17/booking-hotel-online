import { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";
import styles from "./SearchPanel.module.css";

export const SearchPanelField = ({
  icon: Icon,
  label,
  value,
  defaultValue,
  placeholder,
  type = "text",
  name,
  onChange,
  options,
}) => {
  const [open, setOpen] = useState(false);
  const selectRef = useRef(null);
  const inputValueProps = onChange
    ? { value: value ?? "", onChange }
    : { defaultValue: defaultValue ?? value ?? "" };
  const selectedOption = options?.find((option) => String(option.value) === String(value));

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event) => {
      if (!selectRef.current?.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [open]);

  const handleSelect = (optionValue) => {
    onChange?.({ target: { name, value: optionValue } });
    setOpen(false);
  };

  return (
    <label className={styles.field}>
      {Icon && <Icon size={15} />}
      <span>
        <small>{label}</small>
        {options ? (
          <div className={styles.customSelect} ref={selectRef}>
            <button
              type="button"
              className={styles.selectTrigger}
              aria-haspopup="listbox"
              aria-expanded={open}
              onClick={() => setOpen((current) => !current)}
            >
              <span>{selectedOption?.label || placeholder || "Chọn"}</span>
              <i aria-hidden="true" />
            </button>
            {open && (
              <div className={styles.selectMenu} role="listbox">
                {options.map((option) => (
                  <button
                    type="button"
                    key={option.value}
                    className={String(option.value) === String(value) ? styles.selectedOption : ""}
                    role="option"
                    aria-selected={String(option.value) === String(value)}
                    onClick={() => handleSelect(option.value)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <input
            type={type}
            name={name}
            placeholder={placeholder}
            {...inputValueProps}
          />
        )}
      </span>
    </label>
  );
};

const SearchPanel = ({ children, onSubmit, submitLabel = "Tìm kiếm" }) => {
  return (
    <form className={styles.searchCard} onSubmit={onSubmit}>
      <div className={styles.fields}>{children}</div>
      <button className={styles.searchButton} type="submit">
        <Search size={14} />
        <span>{submitLabel}</span>
      </button>
    </form>
  );
};

export default SearchPanel;
