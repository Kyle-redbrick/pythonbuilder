export const checkDueDate = (date) => {
  const dueDate = new Date(date);
  dueDate.setDate(dueDate.getDate() + 1);
  return Date.parse(dueDate) > Date.now();
};
