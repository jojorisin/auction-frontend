const DateTimeFormatter = ({ isoString }) => {
  if (!isoString) return "---";

  // returns localtime formatted
  const date = new Date(isoString);
  const formattedDate = date.toLocaleString("sv-SE", {
    day: "numeric",
    month: "short",
  });

  const formattedTime = date.toLocaleString("sv-SE", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const newDate = formattedDate.replace(".", "");

  return (
    <span title={isoString}>
      {newDate}, {formattedTime}
    </span>
  );
};

export default DateTimeFormatter;
