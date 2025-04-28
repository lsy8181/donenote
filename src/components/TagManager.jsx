import { useState } from "react";
import { useTags } from "../hooks/useTags";

export default function TagManager() {
  const { tagMap, addTag, removeTag } = useTags();
  const [newName, setNewName] = useState("");
  const [newColor, setNewColor] = useState("#888888");

  return (
    <div className="p-4 bg-white rounded-xl shadow max-w-md">
      <h2 className="text-xl font-semibold mb-4">🏷 태그 커스터마이징</h2>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="태그 이름"
          className="flex-1 p-2 border rounded"
        />
        <input
          type="color"
          value={newColor}
          onChange={(e) => setNewColor(e.target.value)}
          className="w-10 h-10 border rounded"
        />
        <button
          onClick={() => {
            if (newName.trim()) {
              addTag(newName.trim(), newColor);
              setNewName("");
              // ✅ 태그 추가 후 새로고침
              window.location.reload();
            }
          }}
          className="bg-blue-500 text-white px-4 rounded"
        >
          추가
        </button>
      </div>

      <ul className="space-y-2">
        {Object.entries(tagMap).map(([name, color]) => (
          <li
            key={name}
            className="flex justify-between items-center bg-gray-100 p-2 rounded"
          >
            <div className="flex items-center gap-2">
              <span
                className="w-4 h-4 inline-block rounded-full"
                style={{ backgroundColor: color }}
              ></span>
              <span>{name}</span>
            </div>
            {!["공부", "업무", "운동", "기타"].includes(name) && (
              <button
                onClick={() => {
                  removeTag(name);
                  // ✅ 태그 삭제 후 새로고침
                  window.location.reload();
                }}
                className="text-sm text-red-500"
              >
                삭제
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
