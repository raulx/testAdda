const DisplayDate = ({ dateString }: { dateString: string }) => {
  // Convert the date string to a Date object
  const date = new Date(dateString);

  // Format the date using toLocaleDateString and toLocaleTimeString
  const formattedDate = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const formattedTime = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div>
      <p>Date: {formattedDate}</p>
      <p>Time: {formattedTime}</p>
    </div>
  );
};

export default DisplayDate;
// Usage
//   <DisplayDate dateString="2024-10-14T16:39:41.941Z" />;
