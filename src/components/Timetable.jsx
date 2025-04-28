import { useState } from "react";
import ClockTimetable from "./ClockTimetable";

export default function Timetable({ tasks }) {
  const [selectedDate, setSelectedDate] = useState(null);

  const groupedByDate = tasks.reduce((acc, task) => {
    const date = new Date(task.completedAt).toLocaleDateString();
    if (!acc[date]) acc[date] = [];
    acc[date].push(task);
    return acc;
  }, {});

  const dates = Object.keys(groupedByDate).sort(
    (a, b) => new Date(b) - new Date(a)
  );

  return (
    <div className="p-4 bg-purple-100 rounded-xl shadow-md h-[500px] overflow-y-auto">
      <h2 className="text-xl font-semibold mb-4">🕒 시간표 (Timetable)</h2>

      {dates.length === 0 ? (
        <p className="text-gray-500">아직 완료된 작업이 없어요.</p>
      ) : selectedDate ? (
        <div>
          <button
            onClick={() => setSelectedDate(null)}
            className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
          >
            ◀ 돌아가기
          </button>
          <h3 className="text-lg font-bold text-center mb-4">{selectedDate}</h3>
          <ClockTimetable tasks={groupedByDate[selectedDate]} />
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {dates.map((date) => (
            <button
              key={date}
              onClick={() => setSelectedDate(date)}
              className="bg-white p-3 rounded shadow hover:bg-purple-200 text-center text-sm font-semibold"
            >
              {date}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
