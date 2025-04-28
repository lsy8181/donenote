// src/hooks/useTags.js
import { useState, useEffect } from "react";
import { STORAGE_KEYS } from "../constants/storageKeys";

// 기본 태그
const DEFAULT_TAGS = {
  공부: "#60A5FA",
  업무: "#34D399",
  운동: "#F87171",
  기타: "#A3A3A3",
};

export function useTags() {
  const [tagMap, setTagMap] = useState(DEFAULT_TAGS);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.tags);
    if (saved) {
      const parsed = JSON.parse(saved);
      setTagMap({ ...DEFAULT_TAGS, ...parsed });
    }
  }, []);

  const save = (updated) => {
    const customOnly = Object.fromEntries(
      Object.entries(updated).filter(([name]) => !DEFAULT_TAGS[name])
    );
    localStorage.setItem(STORAGE_KEYS.tags, JSON.stringify(customOnly));
  };

  const addTag = (name, color) => {
    const updated = { ...tagMap, [name]: color };
    setTagMap(updated);
    save(updated);
  };

  const removeTag = (name) => {
    if (DEFAULT_TAGS[name]) return; // 기본 태그는 삭제 불가
    const updated = { ...tagMap };
    delete updated[name];
    setTagMap(updated);
    save(updated);
  };

  return { tagMap, addTag, removeTag };
}
