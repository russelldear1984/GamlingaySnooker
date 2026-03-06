export const toDateTime = (date, time) => new Date(`${date}T${time}:00`);

export const compareMatches = (a, b) => {
  const startA = toDateTime(a.date, a.startTime);
  const startB = toDateTime(b.date, b.startTime);
  return startA - startB;
};

export const isToday = (dateString) => {
  const today = new Date();
  const date = new Date(`${dateString}T00:00:00`);
  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
};

export const dayLabels = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
