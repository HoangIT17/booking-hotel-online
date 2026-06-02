import { Calendar, UsersRound } from "lucide-react";
import SearchPanel, {
  SearchPanelField,
} from "../../customer/SearchPanel/SearchPanel";

const guestOptions = [
  { value: 1, label: "1 guest" },
  { value: 2, label: "2 guests" },
  { value: 3, label: "3 guests" },
  { value: 4, label: "4 guests" },
];

const StaySearchForm = ({
  values,
  onChange,
  onSubmit,
  guestLabel = "Guests",
  submitLabel,
}) => {
  return (
    <SearchPanel onSubmit={onSubmit} submitLabel={submitLabel}>
      <SearchPanelField
        icon={Calendar}
        label="Check-in date"
        type="date"
        name="checkIn"
        value={values.checkIn}
        onChange={onChange}
      />
      <SearchPanelField
        icon={Calendar}
        label="Check-out date"
        type="date"
        name="checkOut"
        value={values.checkOut}
        onChange={onChange}
      />
      <SearchPanelField
        icon={UsersRound}
        label={guestLabel}
        name="numGuests"
        value={values.numGuests}
        onChange={onChange}
        options={guestOptions}
      />
    </SearchPanel>
  );
};

export default StaySearchForm;
