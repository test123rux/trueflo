import React from 'react';
import { Task } from '../types/task';
import { formatTime } from '../utils/dateUtils';

interface TimelineProps {
  tasks: Task[];
}

export default function Timeline({ tasks }: TimelineProps) {
  const sortedTasks = [...tasks].sort((a, b) => a.start_time.getTime() - b.start_time.getTime());

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-6 text-white">Today's Timeline</h2>
      <div className="space-y-4">
        {sortedTasks.map((task) => (
          <div
            key={task.id}
            className="relative pl-8 pb-8 border-l-2 border-orange-500 last:pb-0"
          >
            <div className="absolute left-[-8px] top-0 w-4 h-4 bg-orange-500 rounded-full" />
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold text-white">{task.name}</h3>
                <span className="text-orange-400 text-sm">
                  {formatTime(task.start_time)} - {formatTime(task.end_time)}
                </span>
              </div>
              <div className="flex gap-2">
                <span className={`px-2 py-1 rounded text-xs text-white
                  ${task.status === 'Completed' ? 'bg-green-500' : 
                    task.status === 'In Progress' ? 'bg-blue-500' : 'bg-gray-500'}`}>
                  {task.status}
                </span>
                <span className={`px-2 py-1 rounded text-xs text-white
                  ${task.priority === 'High' ? 'bg-red-500' : 
                    task.priority === 'Medium' ? 'bg-yellow-500' : 'bg-green-500'}`}>
                  {task.priority}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}