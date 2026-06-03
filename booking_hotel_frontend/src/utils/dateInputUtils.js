export const toDateInputValue = (date) => {
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return localDate.toISOString().slice(0, 10);
};

export const getDefaultStayDates = () => {
  const checkIn = new Date();
  const checkOut = new Date(checkIn);
  checkOut.setDate(checkIn.getDate() + 1);

  return {
    checkIn: toDateInputValue(checkIn),
    checkOut: toDateInputValue(checkOut),
  };
};

export const toDateTimeLocalInputValue = (date) => {
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return localDate.toISOString().slice(0, 16);
};

export const toStayDateTimeInputValue = (dateValue, fallbackTime) => {
  if (!dateValue) return "";
  if (dateValue.includes("T")) return dateValue.slice(0, 16);
  return `${dateValue}T${fallbackTime}`;
};

export const getDefaultStayDateTimes = () => {
  const checkIn = new Date();
  checkIn.setHours(0, 0, 0, 0);

  const checkOut = new Date(checkIn);
  checkOut.setDate(checkIn.getDate() + 1);
  checkOut.setHours(0, 0, 0, 0);

  return {
    checkIn: toDateTimeLocalInputValue(checkIn),
    checkOut: toDateTimeLocalInputValue(checkOut),
  };
};
