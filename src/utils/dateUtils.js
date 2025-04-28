export function formatDate(date) {
  return date.toISOString().split("T")[0];
}

export function groupTasksByDate(tasks) {
  const grouped = {};
  tasks.forEach((task) => {
    const date = task.completedAt
      ? formatDate(new Date(task.completedAt))
      : "알 수 없음";
    if (!grouped[date]) grouped[date] = [];
    grouped[date].push(task);
  });
  return grouped;
}
