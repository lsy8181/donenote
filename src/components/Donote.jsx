import { useState } from "react";
import { useTaskTimer } from "../hooks/useTaskTimer";
import { useTags } from "../hooks/useTags";

export default function Donote({ tasks, setTasks, onAdd, onComplete }) {
  const { tagMap, addTag, removeTag } = useTags();
  const [taskText, setTaskText] = useState("");
  const [filterTag, setFilterTag] = useState("전체");
  const [selectedTagName, setSelectedTagName] = useState(
    Object.keys(tagMap)[0]
  );
  const [showTagModal, setShowTagModal] = useState(false);
  const [newTagName, setNewTagName] = useState("");
  const [newTagColor, setNewTagColor] = useState("#888888");
  const [taskToDelete, setTaskToDelete] = useState(null);

  const TAGS = Object.entries(tagMap).map(([name, color]) => ({ name, color }));
  const selectedTag = TAGS.find((t) => t.name === selectedTagName);

  const addTask = () => {
    if (!taskText.trim()) return;
    const newTask = {
      id: Date.now(),
      text: taskText,
      tag: selectedTag,
    };
    onAdd(newTask);
    setTaskText("");
  };

  const addNewTag = () => {
    if (!newTagName.trim() || tagMap[newTagName]) return;
    addTag(newTagName, newTagColor);
    setSelectedTagName(newTagName);
    setNewTagName("");
    setNewTagColor("#888888");
    setShowTagModal(false);
  };

  const removeTask = (id) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const filteredTasks =
    filterTag === "전체"
      ? tasks
      : tasks.filter((task) => task.tag.name === filterTag);

  return (
    <div className="p-4 bg-blue-100 rounded-xl shadow-md h-[500px] overflow-y-auto">
      <h2 className="text-xl font-semibold mb-4">📝 할 일 목록</h2>

      {/* 입력창 */}
      <div className="flex gap-2 mb-4">
        <input
          value={taskText}
          onChange={(e) => setTaskText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault(); // 엔터 기본 제출 막기
              addTask();
            }
          }}
          className="flex-1 p-2 rounded border"
          placeholder="할 일을 입력하세요"
        />

        <select
          className="p-2 rounded"
          onChange={(e) => setSelectedTagName(e.target.value)}
          value={selectedTagName}
        >
          {TAGS.map((tag) => (
            <option key={tag.name} value={tag.name}>
              {tag.name}
            </option>
          ))}
        </select>
        <button
          onClick={addTask}
          className="bg-blue-500 text-white px-4 rounded"
        >
          추가
        </button>
      </div>

      {/* 태그 추가 버튼 */}
      <div className="mb-4 text-right">
        <button
          onClick={() => setShowTagModal(true)}
          className="bg-purple-500 text-white px-3 py-1 rounded text-sm"
        >
          태그 추가
        </button>
      </div>

      {/* 태그 필터 */}
      <div className="mb-4 flex flex-wrap gap-2">
        <button
          onClick={() => setFilterTag("전체")}
          className={`px-3 py-1 rounded text-sm ${
            filterTag === "전체"
              ? "bg-purple-500 text-white"
              : "bg-white border"
          }`}
        >
          전체
        </button>
        {TAGS.map((tag) => (
          <div key={tag.name} className="flex items-center gap-1">
            <button
              onClick={() => setFilterTag(tag.name)}
              className={`px-3 py-1 rounded text-sm ${
                filterTag === tag.name
                  ? "bg-purple-500 text-white"
                  : "bg-white border"
              }`}
            >
              {tag.name}
            </button>
            {!["공부", "업무", "운동", "기타"].includes(tag.name) && (
              <button
                onClick={() => {
                  removeTag(tag.name);
                  if (filterTag === tag.name) setFilterTag("전체");
                  if (selectedTagName === tag.name) setSelectedTagName("공부");
                }}
                className="text-xs text-red-500 hover:underline"
                title="태그 삭제"
              >
                ✕
              </button>
            )}
          </div>
        ))}
      </div>

      {/* 할 일 리스트 */}
      <ul className="space-y-2">
        {filteredTasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onComplete={(elapsed) => {
              onComplete({
                ...task,
                elapsed,
                completedAt: new Date(),
              });
              localStorage.removeItem(`timer_${task.id}`);
              removeTask(task.id);
            }}
            onDelete={() => setTaskToDelete(task)}
          />
        ))}
      </ul>

      {/* 🆕 태그 추가 모달 */}
      {showTagModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-sm w-[90%]">
            <h3 className="text-lg font-semibold mb-4">새 태그 만들기</h3>
            <div className="flex flex-col gap-2">
              <input
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                className="p-2 rounded border"
                placeholder="태그 이름을 입력하세요"
              />
              <input
                type="color"
                value={newTagColor}
                onChange={(e) => setNewTagColor(e.target.value)}
                className="w-full h-10 rounded border"
              />
              <div className="flex justify-between mt-2">
                <button
                  onClick={addNewTag}
                  className="bg-purple-500 text-white px-4 py-2 rounded"
                >
                  추가
                </button>
                <button
                  onClick={() => setShowTagModal(false)}
                  className="text-gray-500 hover:underline text-sm"
                >
                  닫기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 🆕 삭제 확인 모달 */}
      {taskToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-sm w-[90%]">
            <p className="text-lg mb-4">정말 이 작업을 삭제할까요?</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setTaskToDelete(null)}
                className="text-gray-500 hover:underline"
              >
                취소
              </button>
              <button
                onClick={() => {
                  removeTask(taskToDelete.id);
                  localStorage.removeItem(`timer_${taskToDelete.id}`);
                  setTaskToDelete(null);
                }}
                className="bg-red-500 text-white px-4 py-1 rounded"
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// --- 하위 컴포넌트
function TaskItem({ task, onComplete, onDelete }) {
  const timer = useTaskTimer(task.id);

  return (
    <li className="bg-white p-3 rounded shadow flex flex-col gap-2">
      <div className="flex items-center gap-2 justify-between">
        <div className="flex items-center gap-2">
          <span
            className="w-3 h-3 rounded-full inline-block"
            style={{ backgroundColor: task.tag.color }}
          ></span>
          <span>{task.text}</span>
          <span className="text-sm text-gray-500">#{task.tag.name}</span>
        </div>
        <span className="text-sm text-gray-600">
          {formatTime(timer.elapsed)}
        </span>
      </div>

      <div className="flex gap-2">
        {timer.isRunning ? (
          <>
            <button
              onClick={timer.pause}
              className="bg-yellow-300 px-2 py-1 rounded text-sm"
            >
              중단
            </button>
            <button
              onClick={() => {
                timer.pause();
                onComplete(timer.elapsed);
              }}
              className="bg-green-400 px-2 py-1 rounded text-sm text-white"
            >
              완료
            </button>
          </>
        ) : (
          <button
            onClick={timer.start}
            className="bg-yellow-400 px-2 py-1 rounded text-sm"
          >
            시작
          </button>
        )}
        <button
          onClick={onDelete}
          className="bg-red-400 px-2 py-1 rounded text-sm text-white"
        >
          삭제
        </button>
      </div>
    </li>
  );
}

// --- 시간 포맷 함수
function formatTime(ms) {
  const totalSec = Math.floor(ms / 1000);
  const min = String(Math.floor(totalSec / 60)).padStart(2, "0");
  const sec = String(totalSec % 60).padStart(2, "0");
  return `${min}:${sec}`;
}
