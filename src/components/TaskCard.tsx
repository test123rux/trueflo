import React from 'react';
import { Clock, Tag, AlertCircle } from 'lucide-react';
import { Task } from '../types/task';
import { formatTime } from '../utils/dateUtils';

interface TaskCardProps {
  task: Task;
  onStatusChange: (id: string, status: Task['status']) => void;
  onDelete: (id: string) => void;
}

export default function TaskCard({ task, onStatusChange, onDelete }: TaskCardProps) {
  const priorityColors = {
    High: 'bg-red-500',
    Medium: 'bg-yellow-500',
    Low: 'bg-green-500'
  };

  const statusColors = {
    'Pending': 'bg-gray-500',
    'In Progress': 'bg-blue-500',
    'Completed': 'bg-green-500'
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold text-white">{task.name}</h3>
        <div className="flex gap-2">
          <span className={`${priorityColors[task.priority]} px-2 py-1 rounded text-xs text-white`}>
            {task.priority}
          </span>
          <span className={`${statusColors[task.status]} px-2 py-1 rounded text-xs text-white`}>
            {task.status}
          </span>
        </div>
      </div>

      {task.description && (
        <p className="text-gray-300 mb-4 text-sm">{task.description}</p>
      )}

      <div className="flex flex-col gap-2 mb-4">
        <div className="flex items-center gap-2 text-gray-400">
          <Clock size={16} />
          <span className="text-sm">
            {formatTime(task.start_time)} - {formatTime(task.end_time)}
          </span>
        </div>
        <div className="flex items-center gap-2 text-gray-400">
          <Tag size={16} />
          <span className="text-sm">{task.category}</span>
        </div>
      </div>

      <div className="flex gap-2">
        <select
          value={task.status}
          onChange={(e) => onStatusChange(task.id, e.target.value as Task['status'])}
          className="bg-gray-700 text-white rounded px-3 py-1 text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
        >
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
        
        <button
          onClick={() => onDelete(task.id)}
          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition-colors duration-200"
        >
          Delete
        </button>
      </div>
    </div>
  );
}