import React, { useState, useEffect } from 'react';
import { PlayCircle, StopCircle } from 'lucide-react';
import { Task } from '../types/task';
import { formatTime, formatDuration } from '../utils/dateUtils';

interface ActiveTaskWidgetProps {
  task: Task;
  onComplete: (taskId: string) => void;
}

export default function ActiveTaskWidget({ task, onComplete }: ActiveTaskWidgetProps) {
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    const startTime = task.actual_start_time?.getTime() || Date.now();
    const interval = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [task.actual_start_time]);

  return (
    <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <PlayCircle className="text-white" size={24} />
          <h3 className="text-xl font-bold text-white">Active Task</h3>
        </div>
        <span className="text-white text-2xl font-mono">
          {formatDuration(elapsedTime)}
        </span>
      </div>

      <div className="bg-white/10 rounded-lg p-4 mb-4">
        <h4 className="text-lg font-semibold text-white mb-2">{task.name}</h4>
        {task.description && (
          <p className="text-white/80 text-sm mb-2">{task.description}</p>
        )}
        <div className="flex items-center gap-2 text-white/80 text-sm">
          <span>Started at: {formatTime(task.actual_start_time || new Date())}</span>
        </div>
      </div>

      <button
        onClick={() => onComplete(task.id)}
        className="w-full bg-white text-orange-600 py-2 px-4 rounded-lg font-semibold
          hover:bg-orange-50 transform hover:scale-[1.02] transition-all duration-200
          flex items-center justify-center gap-2"
      >
        <StopCircle size={20} />
        Complete Task
      </button>
    </div>
  );
}