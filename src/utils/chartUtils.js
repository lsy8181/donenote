// chartUtils.js
export const TAG_COLOR_MAP = {
  공부: "#60A5FA",
  업무: "#34D399",
  운동: "#F87171",
  기타: "#A3A3A3",
};

export function convertTasksToChartData(tasks) {
  return tasks.map((task) => {
    const start = new Date(task.startedAt);
    const end = new Date(task.completedAt);
    const duration = (end - start) / 1000 / 60;

    return {
      name: task.text,
      duration: duration,
      fill: TAG_COLOR_MAP[task.tag.name] || "#8884d8",
    };
  });
}
