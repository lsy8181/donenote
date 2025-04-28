import { useState } from "react";
import { groupTasksByDate } from "../utils/dateUtils";

export default function Donenote({ tasks }) {
  const [openDates, setOpenDates] = useState({});

  const formatTime = (ms) => {
    const min = Math.floor(ms / 1000 / 60);
    const sec = Math.floor(ms / 1000) % 60;
    return `${min}분 ${sec}초`;
  };

  const groupedTasks = groupTasksByDate(tasks);

  const toggleDate = (date) => {
    setOpenDates((prev) => ({ ...prev, [date]: !prev[date] }));
  };

  return (
    <div className="p-4 bg-green-100 rounded-xl shadow-md h-[400px] overflow-y-auto">
      <h2 className="text-xl font-semibold mb-4">✅ 완료된 작업</h2>
      {Object.keys(groupedTasks).length === 0 && (
        <p className="text-gray-500">아직 완료된 작업이 없어요.</p>
      )}

      <div className="space-y-4">
        {Object.entries(groupedTasks).map(([date, taskList]) => (
          <div key={date} className="bg-white rounded shadow">
            <button
              className="w-full text-left p-3 font-semibold bg-green-200 hover:bg-green-300"
              onClick={() => toggleDate(date)}
            >
              {date} {openDates[date] ? "▲" : "▼"}
            </button>
            {openDates[date] && (
              <ul className="p-3 space-y-2">
                {taskList.map((task) => (
                  <li
                    key={task.id}
                    className="flex justify-between items-center"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: task.tag.color }}
                      ></span>
                      <span>
                        {task.text}{" "}
                        <span className="text-sm text-gray-500">
                          #{task.tag.name}
                        </span>
                      </span>
                    </div>
                    <span className="text-sm text-gray-600">
                      {formatTime(task.elapsed)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
