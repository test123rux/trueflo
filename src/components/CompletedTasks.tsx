import React from 'react';
import { CheckCircle, Clock } from 'lucide-react';
import { Task } from '../types/task';
import { formatTime, formatDuration } from '../utils/dateUtils';

interface CompletedTasksProps {
  tasks: Task[];
}

export default function CompletedTasks({ tasks }: CompletedTasksProps) {
  const completedTasks = tasks.filter(task => task.status === 'Completed');

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="flex items-center gap-2 mb-6">
        <CheckCircle className="text-green-500" size={24} />
        <h2 className="text-2xl font-bold text-white">Completed Tasks</h2>
      </div>
      
      <div className="space-y-4">
        {completedTasks.map((task) => (
          <div key={task.id} className="bg-gray-700 rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-semibold text-white">{task.name}</h3>
              <span className="text-green-500 text-sm font-medium">
                {task.duration && formatDuration(task.duration)}
              </span>
            </div>
            
            {task.actualStartTime && task.actualEndTime && (
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <Clock size={16} />
                <span>{formatTime(task.actualStartTime)} - {formatTime(task.actualEndTime)}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}