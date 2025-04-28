import { useRef, useEffect } from "react";

export default function ClockTimetable({ tasks }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const width = (canvas.width = 300);
    const height = (canvas.height = 300);
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = 100;
    const arcWidth = 15;

    ctx.clearRect(0, 0, width, height);

    // 배경 원형 시계판
    for (let h = 0; h < 24; h++) {
      const angle = timeToAngle(h, 0) - 90;
      const x = Math.cos(degreesToRadians(angle)) * radius * 1.15 + centerX;
      const y = Math.sin(degreesToRadians(angle)) * radius * 1.15 + centerY;
      ctx.fillStyle = "#666";
      ctx.font = "10px sans-serif";
      ctx.fillText(h.toString().padStart(2, "0"), x - 7, y + 3);

      // 선 그리기
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      const xx = Math.cos(degreesToRadians(angle)) * radius + centerX;
      const yy = Math.sin(degreesToRadians(angle)) * radius + centerY;
      ctx.lineTo(xx, yy);
      ctx.strokeStyle = "#e0e0e0";
      ctx.lineWidth = 0.3;
      ctx.stroke();
      ctx.closePath();
    }

    // 작업 아크 그리기
    tasks.forEach((task) => {
      drawTaskArc(
        ctx,
        new Date(task.startedAt),
        new Date(task.completedAt),
        task.tag.color,
        centerX,
        centerY,
        radius,
        arcWidth
      );
    });
  }, [tasks]);

  return (
    <div className="flex items-center justify-center">
      <canvas
        ref={canvasRef}
        width={300}
        height={300}
        className="border rounded"
      />
    </div>
  );
}

function drawTaskArc(
  ctx,
  startTime,
  endTime,
  color,
  centerX,
  centerY,
  radius,
  width
) {
  const startAngle = degreesToRadians(timeToAngleFromDate(startTime) - 90);
  const endAngle = degreesToRadians(timeToAngleFromDate(endTime) - 90);

  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, startAngle, endAngle);
  ctx.lineWidth = width;
  ctx.strokeStyle = color;
  ctx.stroke();
  ctx.closePath();
}

function timeToAngle(hour, minute) {
  const totalMinutes = hour * 60 + minute;
  return (totalMinutes / 1440) * 360;
}

function timeToAngleFromDate(date) {
  return timeToAngle(date.getHours(), date.getMinutes());
}

function degreesToRadians(degrees) {
  return degrees * (Math.PI / 180);
}
