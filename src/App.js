import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Donote from "./components/Donote";
import Donenote from "./components/Donenote";
import Timetable from "./components/Timetable";
import { STORAGE_KEYS } from "./constants/storageKeys";

function App() {
  const [index, setIndex] = useState(0);
  const [tasks, setTasks] = useState([]); // 진행 중
  const [doneTasks, setDoneTasks] = useState([]); // 완료됨

  // 🔁 페이지 로드시 localStorage에서 불러오기
  useEffect(() => {
    const savedActive = localStorage.getItem(STORAGE_KEYS.active);
    const savedDone = localStorage.getItem(STORAGE_KEYS.done);
    if (savedActive) setTasks(JSON.parse(savedActive));
    if (savedDone) setDoneTasks(JSON.parse(savedDone));
  }, []);

  // ✅ 저장 함수
  const saveToStorage = (activeList, doneList) => {
    localStorage.setItem(STORAGE_KEYS.active, JSON.stringify(activeList));
    localStorage.setItem(STORAGE_KEYS.done, JSON.stringify(doneList));
  };

  // 🟨 할 일 추가
  const addTask = (newTask) => {
    const updated = [...tasks, newTask];
    setTasks(updated);
    saveToStorage(updated, doneTasks);
  };

  // 🟩 완료 처리
  const completeTask = (taskWithTime) => {
    const updatedActive = tasks.filter((t) => t.id !== taskWithTime.id);
    const updatedDone = [...doneTasks, taskWithTime];
    setTasks(updatedActive);
    setDoneTasks(updatedDone);
    saveToStorage(updatedActive, updatedDone);
  };

  const tabs = [
    <Donote
      tasks={tasks}
      setTasks={setTasks}
      onAdd={addTask}
      onComplete={completeTask}
    />,
    <Donenote tasks={doneTasks} />,
    <Timetable tasks={doneTasks} />,
  ];

  const paginate = (newIndex) => {
    if (newIndex < 0 || newIndex >= tabs.length) return;
    setIndex(newIndex);
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center overflow-hidden">
      <h1 className="text-3xl font-bold mb-4">donenote</h1>

      <div className="w-full max-w-md relative h-[500px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ x: 300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ duration: 0.3 }}
            className="absolute w-full"
          >
            {tabs[index]}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex mt-8 gap-4">
        <button onClick={() => paginate(index - 1)}>◀</button>
        <button onClick={() => paginate(index + 1)}>▶</button>
      </div>
    </div>
  );
}

export default App;
