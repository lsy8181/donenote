import { useState, useEffect, useRef } from "react";

export function useTaskTimer(taskId) {
  const [elapsed, setElapsed] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const startTimeRef = useRef(null);
  const intervalRef = useRef(null);

  const STORAGE_KEY = `timer_${taskId}`;

  const start = () => {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    const now = Date.now();
    startTimeRef.current = now;
    setIsRunning(true);
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        ...saved,
        startedAt: new Date(now).toISOString(),
      })
    );
  };

  const pause = () => {
    if (!startTimeRef.current) return;
    const now = Date.now();
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    const accumulated = saved.accumulated || 0;
    const session = now - startTimeRef.current;
    const total = accumulated + session;

    setElapsed(total);
    setIsRunning(false);
    startTimeRef.current = null;

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        accumulated: total,
      })
    );
  };

  const reset = () => {
    setElapsed(0);
    setIsRunning(false);
    startTimeRef.current = null;
    localStorage.removeItem(STORAGE_KEY);
  };

  const load = () => {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved) {
      const accumulated = saved.accumulated || 0;
      const startedAt = saved.startedAt ? new Date(saved.startedAt) : null;
      if (startedAt) {
        const now = Date.now();
        const ms = now - startedAt.getTime();
        setElapsed(accumulated + ms);
        startTimeRef.current = startedAt.getTime();
        setIsRunning(true);
      } else {
        setElapsed(accumulated);
      }
    }
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        if (startTimeRef.current) {
          const now = Date.now();
          const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
          const accumulated = saved.accumulated || 0;
          setElapsed(accumulated + (now - startTimeRef.current));
        }
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning]);

  return {
    elapsed,
    isRunning,
    start,
    pause,
    reset,
  };
}
